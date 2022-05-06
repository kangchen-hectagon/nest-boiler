import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { CampaignStatus, CampaignType } from '../../constants';
import { UseDto } from '../../decorators';
import { ProjectEntity } from '../project/project.entity';
import { UserEntity } from '../user/user.entity';
import { CampaignDto } from './dtos/campaign.dto';

@Entity({ name: 'campaigns' })
@UseDto(CampaignDto)
export class CampaignEntity extends AbstractEntity<CampaignDto> {
  @Column({ type: 'int' })
  userId: number;

  @Column({ type: 'int' })
  projectId: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'timestamp' })
  publishAt: Date;

  @Column({ type: 'varchar' })
  typeChain: string;

  @Column({ type: 'varchar' })
  tokenAddress: string;

  @Column({ type: 'int' })
  totalToken: number;

  @Column({ type: 'varchar' })
  logo: string;

  @Column({ type: 'varchar' })
  photo: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: CampaignType })
  type: CampaignType;

  @Column({ type: 'enum', enum: CampaignStatus })
  status: CampaignStatus;

  @Column({ type: 'int' })
  stage?: number;

  @Column({ type: 'int' })
  tokenPerStage?: number;

  @Column({ type: 'int' })
  stageLength?: number;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  endTime?: Date;

  @Column({ type: 'json' })
  userReward?: string;

  @Column({ type: 'int' })
  mappingId?: number;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.campaigns, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => ProjectEntity, (projectEntity) => projectEntity.campaigns, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project: ProjectEntity;
}
