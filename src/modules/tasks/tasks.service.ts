import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Task, TaskDocument } from './schemas/task.schema';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';


@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
  ) {}

  async findAll(paginationQuery: PaginationQueryDto): Promise<Task[]> {
    const { limit, offset } = paginationQuery;
    return this.taskModel.find().skip(offset).limit(limit).exec();
  }

  async findOne(id: number): Promise<Task> {
    if (id <= 0) {
      throw new BadRequestException('ID must be a positive number.');
    }

    const task = await this.taskModel.findOne({id}).exec();
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found.`);
    }

    return task;
  }

  async create(createTaskDto: CreateTaskDto, author: string): Promise<Task> {
    const task = new this.taskModel({...createTaskDto, author: author});
    return await task.save();
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise <TaskDocument> {
    const task = await this.taskModel.findByIdAndUpdate(
      id,
      updateTaskDto,
      { new: true },
    );
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found.`);
    }

    return task;
  }

  async remove(id: number): Promise<{ message: string }> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format.');
    }
    const result = await this.taskModel.findByIdAndDelete(id);


    if (!result) {
      throw new NotFoundException(`Task with id ${id} not found.`);
    }

    return { message: `Task with ID "${id}" successfully deleted.` };
  }
}
