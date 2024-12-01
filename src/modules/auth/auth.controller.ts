import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthCredentialsDto } from '../auth/dto/auth-credential.dto'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('singup')
    async singUp(@Body() createUserDto: CreateUserDto): Promise<{ message: string; userId: string }> {
       return await this.authService.signUp(createUserDto);
    }

    @Post('signin')
    async signIn(@Body() authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        return this.authService.signIn(authCredentialsDto);
    }


}
