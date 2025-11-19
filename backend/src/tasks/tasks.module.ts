import { Module } from '@nestjs/common'

import { TasksController } from './tasks.controller'
import { TasksService } from './tasks.service'

@Module({
  providers: [TasksService],
  controllers: [TasksController],
})
export class TasksModule {}
