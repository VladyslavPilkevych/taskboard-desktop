import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.task.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  create(data: CreateTaskDto) {
    return this.prisma.task.create({ data });
  }

  async update(id: string, data: UpdateTaskDto) {
    const existing = await this.prisma.task.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Task not found');

    return this.prisma.task.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.task.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Task not found');

    await this.prisma.task.delete({ where: { id } });
    return { success: true };
  }
}
