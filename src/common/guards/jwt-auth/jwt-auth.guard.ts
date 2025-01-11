import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotImplementedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../../../modules/users/users.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(
    protected readonly reflector: Reflector,
    private readonly usersService: UsersService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivate = await super.canActivate(context);

    if (!canActivate) {
      return false;
    }

    const request = context.switchToHttp().getRequest();

    const user = request.user;

    const dbUser = await this.usersService.findOne(user.userId);

    if (!dbUser) {
      throw new NotImplementedException('User not found');
    }
    
    return true;
  }
}
