import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity'
import { Repository } from 'typeorm';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from '../auth/dto/auth-credential.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) {}
;
    async signUp(createUserDto: CreateUserDto):Promise<{ message: string; userId: string }> {
        const { email , password } = createUserDto;
        const userExists = await this.userRepository.findOneBy({ email });
        if (userExists) {
            throw new ConflictException('User already exists');
        }

        const SALT_ROUNDS = 10;
        const hashPassword = await bcrypt.hash(password, SALT_ROUNDS);

        try {
            const user = this.userRepository.create({ ...createUserDto, password: hashPassword });
            await this.userRepository.save(user);
    
            return {message: "User created successfully", userId: user.id};
        } catch (error) {
            throw new BadRequestException(error.message || 'An error occurred while creating the user');
        }
    }

    async signIn(authCredentialDto: AuthCredentialsDto): Promise<{accessToken: string}> {
        const { email, password } = authCredentialDto;

        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
          throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { sub: user.id };
        const accessToken = await this.jwtService.sign(payload);

        return { accessToken };
    }

    async validateUserById(userId: string): Promise<Partial<User>> {
        const user = await this.userRepository.findOne({ where: { id: userId }});
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return {id: user.id, email: user.email, username: user.username};
    }
}
