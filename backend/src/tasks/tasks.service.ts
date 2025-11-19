import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.task.findMany({
      orderBy: [{ status: "asc" }, { order: "asc" }],
    });
  }

  async create(dto: CreateTaskDto) {
    const status: "todo" | "done" = dto.status ?? "todo";

    const maxOrder = await this.prisma.task.aggregate({
      _max: { order: true },
      where: { status },
    });

    const nextOrder = (maxOrder._max.order ?? -1) + 1;

    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description ?? "",
        status,
        order: nextOrder,
      },
    });
  }

  async update(id: string, dto: UpdateTaskDto) {
    const existing = await this.prisma.task.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Task not found");

    const status = dto.status ?? existing.status;

    const order =
      typeof (dto as any).order === "number"
        ? (dto as any).order
        : existing.order;

    return this.prisma.task.update({
      where: { id },
      data: {
        title: dto.title ?? existing.title,
        description: dto.description ?? existing.description,
        status,
        order,
      },
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.task.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Task not found");

    await this.prisma.task.delete({ where: { id } });
    return { success: true };
  }

  async reorder(
    tasks: { id: string; status: "todo" | "done"; order: number }[]
  ) {
    const todo = tasks
      .filter((t) => t.status === "todo")
      .sort((a, b) => a.order - b.order);

    const done = tasks
      .filter((t) => t.status === "done")
      .sort((a, b) => a.order - b.order);

    const ops: Prisma.PrismaPromise<any>[] = [];

    todo.forEach((t, index) => {
      ops.push(
        this.prisma.task.update({
          where: { id: t.id },
          data: { status: "todo", order: index },
        })
      );
    });

    done.forEach((t, index) => {
      ops.push(
        this.prisma.task.update({
          where: { id: t.id },
          data: { status: "done", order: index },
        })
      );
    });

    await this.prisma.$transaction(ops);

    return this.prisma.task.findMany({
      orderBy: [{ status: "asc" }, { order: "asc" }],
    });
  }
}
