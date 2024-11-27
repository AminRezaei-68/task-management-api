import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn(), 
    };

    jwtService = {
      sign: jest.fn(), 
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('Should find user with valid email and check password', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      password: await bcrypt.hash('123456', 10),
    };
    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser);

    const result = await authService.validateUserByEmail('test@example.com', '123456');
    expect(result).toEqual({ id: mockUser.id, email: mockUser.email });
  });

  it('Should return UnauthorizedException error for invalid email or password', async () => {
    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);

    await expect(authService.validateUserByEmail('invalid@example.com', 'wrong-password')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('It should generate JWT token with user data', () => {
    const mockPayload = { sub: '1', email: 'test@example.com' };
    const mockToken = 'mockToken';
    jest.spyOn(jwtService, 'sign').mockReturnValue(mockToken);

    const result = authService.generateToken(mockPayload);
    expect(result).toEqual(mockToken);
  });
});
