import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CampaignController } from './campaign.controller';
import { CampaignRepository } from './campaign.repository';
import { CampaignService } from './campaign.service';
import { CreateCampaignHandler } from './commands/create-campaign.command';
import { GetCampaignHandler } from './queries/get-campaign.query';

export const handlers = [CreateCampaignHandler, GetCampaignHandler];

@Module({
  imports: [TypeOrmModule.forFeature([CampaignRepository])],
  providers: [CampaignService, ...handlers],
  controllers: [CampaignController],
})
export class CampaignModule {}
