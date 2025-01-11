import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20, { message: 'Username must not exceed 20 characters.' })
  @MinLength(3, { message: 'Username cannot be less than 3 characters.' })
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  readonly firstname: string;

  @IsString()
  @IsNotEmpty()
  readonly lastname: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  readonly password: string;
}
