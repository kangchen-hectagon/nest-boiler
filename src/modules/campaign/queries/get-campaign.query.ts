import type { ICommand, IQueryHandler } from '@nestjs/cqrs';
import { QueryHandler } from '@nestjs/cqrs';

import { CampaignRepository } from '../campaign.repository';

export class GetCampaignQuery implements ICommand {
  constructor(public readonly userId: number) {}
}

@QueryHandler(GetCampaignQuery)
export class GetCampaignHandler implements IQueryHandler<GetCampaignQuery> {
  constructor(private campaignRepository: CampaignRepository) {}

  async execute(query: GetCampaignQuery) {
    return this.campaignRepository.find({
      userId: query.userId,
    });
  }
}
