import { NumberField } from '../../../decorators';

export class ApproveCampaignDto {
  @NumberField({ int: true })
  mappingId: number;
}
