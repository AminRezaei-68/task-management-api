import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Partial<User>> {
    const { email } = createUserDto;

    const userExists = await this.userRepository.findOneBy({ email });
    if (userExists) {
      throw new BadRequestException('A user with this email already exists.');
    }

    const user = this.userRepository.create(createUserDto);
    const saveUser = this.userRepository.save(user);

    return { id: (await saveUser).id, email: (await saveUser).email };
  }

  async findAll(): Promise<Partial<User>[]> {
    const users = await this.userRepository.find();

    return users.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
    }));
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
