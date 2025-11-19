import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'

import { CreateTaskDto } from './dto/create-task.dto'
import { UpdateTaskDto } from './dto/update-task.dto'
import { TasksService } from './tasks.service'

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll() {
    return this.tasksService.findAll()
  }

  @Post()
  create(@Body() dto: CreateTaskDto) {
    return this.tasksService.create(dto)
  }

  @Patch('reorder')
  reorder(
    @Body()
    body: {
      tasks: { id: string; status: 'todo' | 'done'; order: number }[]
    },
  ) {
    return this.tasksService.reorder(body.tasks)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.tasksService.update(id, dto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id)
  }
}
