import { EntityRepository, Repository } from 'typeorm';

import { CampaignEntity } from './campaign.entity';

@EntityRepository(CampaignEntity)
export class CampaignRepository extends Repository<CampaignEntity> {}
