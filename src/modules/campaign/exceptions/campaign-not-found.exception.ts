import { NotFoundException } from '@nestjs/common';

export class CampaignNotFoundException extends NotFoundException {
  constructor(error?: string) {
    super('error.campaignNotFound', error);
  }
}
