import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthCredentialsDto } from './entities/auth-credential.dto'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('singup')
    async singUp(@Body() createUserDto: CreateUserDto): Promise<void> {
        await this.authService.signUP(createUserDto);
    }

    @Post('signin')
    async signIn(@Body() authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        return this.authService.signIn(authCredentialsDto);
    }


}
