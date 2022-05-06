import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { CampaignStatus, CampaignType } from '../../../constants';
import type { CampaignEntity } from '../campaign.entity';

export class CampaignDto extends AbstractDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  projectId: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  publishAt: Date;

  @ApiProperty()
  typeChain: string;

  @ApiProperty()
  tokenAddress: string;

  @ApiProperty()
  totalToken: number;

  @ApiProperty()
  logo: string;

  @ApiProperty()
  photo: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ enum: CampaignType })
  type: CampaignType;

  @ApiProperty({ enum: CampaignStatus })
  status: CampaignStatus;

  @ApiPropertyOptional()
  stage?: number;

  @ApiPropertyOptional()
  tokenPerStage?: number;

  @ApiPropertyOptional()
  stageLength?: number;

  @ApiProperty()
  startTime: Date;

  @ApiPropertyOptional()
  endTime?: Date;

  @ApiPropertyOptional()
  userReward?: string;

  @ApiPropertyOptional()
  mappingId?: number;

  constructor(campaignEntity: CampaignEntity) {
    super(campaignEntity);
    this.userId = campaignEntity.userId;
    this.projectId = campaignEntity.projectId;
    this.name = campaignEntity.name;
    this.typeChain = campaignEntity.typeChain;
    this.tokenAddress = campaignEntity.tokenAddress;
    this.totalToken = campaignEntity.totalToken;
    this.status = campaignEntity.status;
    this.type = campaignEntity.type;
    this.logo = campaignEntity.logo;
    this.photo = campaignEntity.photo;
    this.stage = campaignEntity.stage;
    this.tokenPerStage = campaignEntity.tokenPerStage;
    this.stageLength = campaignEntity.stageLength;
    this.startTime = campaignEntity.startTime;
    this.endTime = campaignEntity.endTime;
    this.userReward = campaignEntity.userReward;
    this.mappingId = campaignEntity.mappingId;
  }
}
