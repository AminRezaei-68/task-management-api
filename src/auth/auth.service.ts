import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity'
import { Repository } from 'typeorm';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from './entities/auth-credential.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) {}
;
    async signUP(createUserDto: CreateUserDto):Promise<void> {
        const { email , password } = createUserDto;
        const userExists = await this.userRepository.findOneBy({ email });
        if (userExists) {
            throw new Error('User already exists');
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = this.userRepository.create({ ...createUserDto, password: hashPassword });
        await this.userRepository.save(user);
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

    async validateUserById(userId: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id: userId }});
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
}
