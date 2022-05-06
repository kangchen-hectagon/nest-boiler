import { CampaignStatus, CampaignType } from '../../../constants';
import {
  DateField,
  DateFieldOptional,
  EnumField,
  NumberField,
  NumberFieldOptional,
  StringField,
  StringFieldOptional,
} from '../../../decorators';

export class CreateCampaignDto {
  @NumberField({ int: true })
  projectId: number;

  @StringField()
  name: string;

  @DateField()
  publishAt: Date;

  @StringField()
  typeChain: string;

  @StringField()
  tokenAddress: string;

  @NumberField({ int: true })
  totalToken: number;

  @StringField()
  description: string;

  @EnumField(() => CampaignType)
  type: CampaignType;

  @EnumField(() => CampaignStatus)
  status: CampaignStatus;

  @NumberFieldOptional({ int: true })
  stage?: number;

  @NumberFieldOptional({ int: true })
  tokenPerStage?: number;

  @NumberFieldOptional({ int: true })
  stageLength?: number;

  @DateField()
  startTime: Date;

  @DateFieldOptional()
  endTime?: Date;

  @StringFieldOptional()
  userReward?: string;
}
