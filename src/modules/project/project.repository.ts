import { EntityRepository, Repository } from 'typeorm';

import { ProjectEntity } from './project.entity';

@EntityRepository(ProjectEntity)
export class ProjectRepository extends Repository<ProjectEntity> {}
