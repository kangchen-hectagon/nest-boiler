import { Column, Entity, OneToMany } from 'typeorm';

import type { IAbstractEntity } from '../../common/abstract.entity';
import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { CampaignEntity } from '../campaign/campaign.entity';
import { ProjectDto } from './dtos/project.dto';

export interface IProjectEntity extends IAbstractEntity<ProjectDto> {
  name?: string;
}

@Entity({ name: 'projects' })
@UseDto(ProjectDto)
export class ProjectEntity
  extends AbstractEntity<ProjectDto>
  implements IProjectEntity
{
  @Column({ nullable: true })
  name?: string;

  @OneToMany(() => CampaignEntity, (campaignEntity) => campaignEntity.user)
  campaigns: CampaignEntity[];
}
