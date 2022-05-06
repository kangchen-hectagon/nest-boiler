import { PageOptionsDto } from '../../../common/dto/page-options.dto';
import { CampaignStatus, CampaignType } from '../../../constants';
import {
  DateFieldOptional,
  EnumFieldOptional,
  NumberFieldOptional,
} from '../../../decorators';

export class CampaignPageOptionsDto extends PageOptionsDto {
  @EnumFieldOptional(() => CampaignType)
  type?: CampaignType;

  @EnumFieldOptional(() => CampaignStatus)
  status?: CampaignStatus;

  @NumberFieldOptional({ int: true })
  projectId?: number;

  @DateFieldOptional()
  startTime?: Date;

  @DateFieldOptional()
  endTime?: Date;
}
