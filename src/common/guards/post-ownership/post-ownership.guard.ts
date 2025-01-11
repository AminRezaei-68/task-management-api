import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TasksService } from 'src/modules/tasks/tasks.service';

@Injectable()
export class TaskOwnershipGuard implements CanActivate {
  constructor(private readonly tasksService: TasksService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const taskId = request.params.id;
    const username = request.user.username;

    return this.tasksService.findOne(taskId).then((task) => {
      if (!task) {
        throw new NotFoundException('Post not found');
      }
      return task.author === username;
    });
  }
}
