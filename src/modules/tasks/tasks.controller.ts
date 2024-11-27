import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { TasksService } from "./tasks.service";
import { PaginationQueryDto } from "../../common/dto/pagination-query.dto";

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService){}

    @Get()
    findAll(@Query() paginationQury: PaginationQueryDto){
        return this.tasksService.findAll(paginationQury);
    }

    @Get(':id')
    findOne(@Param('id') id: number){
        return this.tasksService.findOne(id);
    }

    @Post()
    create(@Body() createTaskDto: CreateTaskDto){
        return this.tasksService.create(createTaskDto);
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() updateTaskDto: UpdateTaskDto){
        return this.tasksService.update(id, updateTaskDto);
    }

    @Delete(':id')
    remove(@Param('id') id: number){
        return this.tasksService.remove(id);
    }
}
