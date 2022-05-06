import { Injectable, NotFoundException } from '@nestjs/common';

import type { PageDto } from '../../common/dto/page.dto';
import type { PageOptionsDto } from '../../common/dto/page-options.dto';
import type { ProjectDto } from './dtos/project.dto';
import { ProjectRepository } from './project.repository';

@Injectable()
export class ProjectService {
  constructor(private userRepository: ProjectRepository) {}

  async getProjects(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<ProjectDto>> {
    const queryBuilder = this.userRepository.createQueryBuilder('project');
    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async getProject(projectId: number): Promise<ProjectDto> {
    const queryBuilder = this.userRepository.createQueryBuilder('project');

    queryBuilder.where('project.id = :projectId', { projectId });

    const userEntity = await queryBuilder.getOne();

    if (!userEntity) {
      throw new NotFoundException();
    }

    return userEntity.toDto();
  }
}
