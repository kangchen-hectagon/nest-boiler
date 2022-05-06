import { ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { ProjectEntity } from '../project.entity';

export class ProjectDto extends AbstractDto {
  @ApiPropertyOptional()
  name?: string;

  constructor(project: ProjectEntity) {
    super(project);
    this.name = project.name;
  }
}
