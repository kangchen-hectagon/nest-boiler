import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { PageDto } from '../../common/dto/page.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ApiPageOkResponse, Auth } from '../../decorators';
import { ProjectDto } from './dtos/project.dto';
import { ProjectService } from './project.service';

@Controller('projects')
@ApiTags('projects')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Get()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get projects list',
    type: PageDto,
  })
  getProjects(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<ProjectDto>> {
    return this.projectService.getProjects(pageOptionsDto);
  }

  @Get(':id')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get project',
    type: ProjectDto,
  })
  getProject(@Param('id') projectId: number): Promise<ProjectDto> {
    return this.projectService.getProject(projectId);
  }
}
