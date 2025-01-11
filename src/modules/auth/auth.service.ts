import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from '../auth/dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../auth/dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userservice: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto): Promise<{ message: string }> {
    const existingUser = await this.userservice.findByUsernameOrEmail(
      signupDto.username,
    );
    if (existingUser) {
      throw new UnauthorizedException('Username or email already exists');
    }

    await this.userservice.create(signupDto);

    return { message: 'User registered successfully' };
  }

  async login(loginDto: LoginDto): Promise<{ message: string; token: string }> {
    const user = await this.userservice.findByUsernameOrEmail(
      loginDto.usernameOrEmail,
      true,
    );

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Incorrect password');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname
    };
    const token = this.jwtService.sign(payload);

    return { message: 'Login successful', token };
  }
}
