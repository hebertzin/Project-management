import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { ProjectsService } from 'src/projects/services/projects/projects.service';
import { TUpdate } from 'src/updates/types/updates';
import { UserService } from 'src/user/services/user/user.service';
import { Updates } from '@prisma/client';

@Injectable()
export class UpdatesService {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService,
    private projectService: ProjectsService,
  ) {}

  async createUpdateToProject(data: TUpdate): Promise<Updates> {
    await this.userService.checkUserExistence(data.userId);
    await this.projectService.checkProjectExistence(data.projectId);

    const updates = await this.prismaService.updates.create({
      data: {
        ...data,
      },
    });
    return updates;
  }

  async findUpdateById(update_id: string): Promise<Updates> {
    const updateFound = await this.prismaService.updates.findUnique({
      where: {
        id: update_id,
      },
    });
    if (!updateFound) {
      throw new NotFoundException(`this update ${update_id} does not exist`);
    }
    return updateFound;
  }

  async editUpdateProjectbyId(
    update_id: string,
    data: TUpdate,
  ): Promise<Updates> {
    await this.userService.checkUserExistence(data.userId);
    await this.projectService.checkProjectExistence(data.projectId);
    const update = await this.prismaService.updates.update({
      where: {
        id: update_id,
      },
      data: {
        ...data,
      },
    });
    return update;
  }

  async findByIdAndDeleteUpdate(update_id: string): Promise<Updates> {
    return await this.prismaService.updates.delete({
      where: {
        id: update_id,
      },
    });
  }
}
