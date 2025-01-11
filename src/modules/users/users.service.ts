import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/change-password.dto';

type UserResponse = Partial<User> & { id: string };

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByUsernameOrEmail(
    usernameOrEmail: string,
    includeSensitiveData: boolean = false,
  ): Promise<UserResponse | undefined> {
    const user = await this.userRepository
      .findOne({
        where: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      });

    if (!user) {
      return undefined;
    }

    const userRespone: UserResponse = {
      id: user.id.toString(),
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
    };

    if (includeSensitiveData) {
      userRespone.password = user.password;
    }

    return userRespone;
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await this.userRepository.save(user);
    return { message: 'Password updated successfully' };
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    const { email, password } = createUserDto;

    const userExists = await this.userRepository.findOne({ where:{email} });
    if (userExists) {
      throw new BadRequestException('A user with this email already exists.');
    }

    const hashedPassword = await this.hashPassword(password);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    const savedUser = await this.userRepository.save(user);

    return {
      id: savedUser.id.toString(),
      email: savedUser.email,
      username: savedUser.username,
    };
  }

  async findOne(id: string): Promise<Partial<User>> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }
    return { id: user.id, username: user.username, email: user.email };
  }

  async findByEmail(email: string): Promise<Partial<User> | undefined> {
    const user = await this.userRepository.findOneBy({ email });

    return user
      ? { id: user.id, username: user.username, email: user.email }
      : undefined;
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }

    if (updateUserDto.email) {
      const emailExists = await this.userRepository.findOneBy({
        email: updateUserDto.email,
      });
      if (emailExists && emailExists.id !== id) {
        throw new BadRequestException('This email is already in use.');
      }
    }

    Object.assign(user, updateUserDto);
    const userUpdate = await this.userRepository.save(user);

    return {
      id: userUpdate.id,
      username: userUpdate.username,
      email: userUpdate.email,
    };
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }

    await this.userRepository.remove(user);

    return { message: `User with ID "${id}" has been deleted.` };
  }
}
