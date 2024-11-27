import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto/pagination-query.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task) private readonly taskRepository: Repository <Task>
    ){}

    async findAll(paginationQuery: PaginationQueryDto): Promise<Task[]> {
        const {limit, offset} = paginationQuery;
        return this.taskRepository.find({skip: offset, take: limit});
    }

    async findOne(id: number): Promise<Task> {
        const task = await this.taskRepository.findOne({ where: {id} });
        if (!task) {
            throw new NotFoundException(`Task with id ${id} not found.`)
        }
        return task;
    }

    create(createTaskDto: CreateTaskDto): Promise<Task> {
        const task = this.taskRepository.create(createTaskDto);
        return this.taskRepository.save(task);
    }

    async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
        const task = await this.taskRepository.preload({
            id, 
            ...updateTaskDto
        });

        if (!task) {
            throw new NotFoundException(`Task with id ${id} not found.`);
        }

        return this.taskRepository.save(task);
    }

    async remove(id: number): Promise<Task> {
        const task = await this.taskRepository.findOne({where: {id}});

        if (!task) {
            throw new NotFoundException(`Task with id ${id} not found.`);
        }

        return this.taskRepository.remove(task);

    }

}
