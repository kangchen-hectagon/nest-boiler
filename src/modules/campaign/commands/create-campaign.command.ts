import type { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';

import type { CampaignEntity } from '../campaign.entity';
import { CampaignRepository } from '../campaign.repository';
import type { CreateCampaignDto } from '../dtos/create-campaign.dto';

export class CreateCampaignCommand implements ICommand {
  constructor(
    public readonly userId: number,
    public readonly createCampaignDto: CreateCampaignDto,
  ) {}
}

@CommandHandler(CreateCampaignCommand)
export class CreateCampaignHandler
  implements ICommandHandler<CreateCampaignCommand, CampaignEntity>
{
  constructor(private campaignRepository: CampaignRepository) {}

  async execute(command: CreateCampaignCommand) {
    const { userId, createCampaignDto } = command;
    const campaignEntity = this.campaignRepository.create(createCampaignDto);
    campaignEntity.userId = userId;
    await this.campaignRepository.save(campaignEntity);

    return campaignEntity;
  }
}
