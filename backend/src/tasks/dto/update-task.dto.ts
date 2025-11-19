import { PartialType } from '@nestjs/mapped-types'
import { IsNumber, IsOptional } from 'class-validator'

import { CreateTaskDto } from './create-task.dto'

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsNumber()
  @IsOptional()
  order?: number
}
