import { BadRequestException, Injectable } from '@nestjs/common';
import type { IFile } from 'interfaces';

import type { PageDto } from '../../common/dto/page.dto';
import { CampaignStatus } from '../../constants';
import { FileNotImageException } from '../../exceptions';
import { AwsS3Service } from '../../shared/services/aws-s3.service';
import { ValidatorService } from '../../shared/services/validator.service';
import type { CampaignEntity } from './campaign.entity';
import { CampaignRepository } from './campaign.repository';
import type { ApproveCampaignDto } from './dtos/approve-campaign.dto';
import type { CampaignDto } from './dtos/campaign.dto';
import type { CampaignPageOptionsDto } from './dtos/campaign-page-options.dto';
import type { CreateCampaignDto } from './dtos/create-campaign.dto';
import type { UpdateCampaignDto } from './dtos/update-campaign.dto';
import { CampaignNotFoundException } from './exceptions/campaign-not-found.exception';

@Injectable()
export class CampaignService {
  constructor(
    private campaignRepository: CampaignRepository,
    private validatorService: ValidatorService,
    private awsS3Service: AwsS3Service,
  ) {}

  async createCampaign(
    userId: number,
    createCampaignDto: CreateCampaignDto,
    files: {
      photo: IFile[];
      logo: IFile[];
    },
  ): Promise<CampaignEntity> {
    let logoUrl, photoUrl;

    if (files.photo && files.photo[0]) {
      if (!this.validatorService.isImage(files.photo[0].mimetype)) {
        throw new FileNotImageException('photo not image');
      } else {
        photoUrl = await this.awsS3Service.uploadImage(files.photo[0]);
      }
    }

    if (files.logo && files.logo[0]) {
      if (!this.validatorService.isImage(files.logo[0].mimetype)) {
        throw new FileNotImageException('photo not image');
      } else {
        logoUrl = await this.awsS3Service.uploadImage(files.logo[0]);
      }
    }

    const campaignEntity = this.campaignRepository.create(createCampaignDto);
    const merged = this.campaignRepository.merge(campaignEntity, {
      logo: logoUrl,
      photo: photoUrl,
      userId,
    });
    await this.campaignRepository.save(merged);

    return campaignEntity;
  }

  async getAllCampaign(
    campaignPageOptionsDto: CampaignPageOptionsDto,
  ): Promise<PageDto<CampaignDto>> {
    const queryBuilder = this.campaignRepository.createQueryBuilder('campaign');

    if (campaignPageOptionsDto.q) {
      console.info(campaignPageOptionsDto.q);
    }

    if (campaignPageOptionsDto.type) {
      queryBuilder.andWhere('campaign.type = :type', {
        type: campaignPageOptionsDto.type,
      });
    }

    if (campaignPageOptionsDto.status) {
      queryBuilder.andWhere('campaign.status = :status', {
        status: campaignPageOptionsDto.status,
      });
    }

    if (campaignPageOptionsDto.projectId) {
      queryBuilder.andWhere('campaign.projectId = :projectId', {
        projectId: campaignPageOptionsDto.projectId,
      });
    }

    if (campaignPageOptionsDto.startTime) {
      queryBuilder.andWhere('campaign.startTime >= :startTime', {
        startTime: campaignPageOptionsDto.startTime,
      });
    }

    if (campaignPageOptionsDto.endTime) {
      queryBuilder.andWhere('campaign.endTime <= :endTime', {
        endTime: campaignPageOptionsDto.endTime,
      });
    }

    const [items, pageMetaDto] = await queryBuilder.paginate(
      campaignPageOptionsDto,
    );

    return items.toPageDto(pageMetaDto);
  }

  async getSingleCampaign(id: number): Promise<CampaignEntity> {
    const queryBuilder = this.campaignRepository
      .createQueryBuilder('campaign')
      .where('campaign.id = :id', { id });

    const campaignEntity = await queryBuilder.getOne();

    if (!campaignEntity) {
      throw new CampaignNotFoundException();
    }

    return campaignEntity;
  }

  async updateCampaign(
    id: number,
    updateCampaignDto: UpdateCampaignDto,
    files: {
      photo: IFile[];
      logo: IFile[];
    },
  ): Promise<void> {
    const queryBuilder = this.campaignRepository
      .createQueryBuilder('campaign')
      .where('campaign.id = :id', { id });

    const campaignEntity = await queryBuilder.getOne();

    if (!campaignEntity) {
      throw new CampaignNotFoundException();
    }

    if (campaignEntity.status !== CampaignStatus.DRAFT) {
      throw new BadRequestException();
    }

    let logoUrl, photoUrl;

    if (files.photo && files.photo[0]) {
      if (!this.validatorService.isImage(files.photo[0].mimetype)) {
        throw new FileNotImageException('photo not image');
      } else {
        photoUrl = await this.awsS3Service.uploadImage(files.photo[0]);
      }
    }

    if (files.logo && files.logo[0]) {
      if (!this.validatorService.isImage(files.logo[0].mimetype)) {
        throw new FileNotImageException('photo not image');
      } else {
        logoUrl = await this.awsS3Service.uploadImage(files.logo[0]);
      }
    }

    const updatedCampaignEntity = this.campaignRepository.merge(
      campaignEntity,
      updateCampaignDto,
      {
        logo: logoUrl,
        photo: photoUrl,
      },
    );

    await this.campaignRepository.save(updatedCampaignEntity);
  }

  async deleteCampaign(id: number): Promise<void> {
    const queryBuilder = this.campaignRepository
      .createQueryBuilder('campaign')
      .where('campaign.id = :id', { id });

    const campaignEntity = await queryBuilder.getOne();

    if (!campaignEntity) {
      throw new CampaignNotFoundException();
    }

    if (campaignEntity.status !== CampaignStatus.DRAFT) {
      throw new BadRequestException();
    }

    await this.campaignRepository.remove(campaignEntity);
  }

  async aprroveOrRejectCampaign(
    id: number,
    isApprove = true,
    approveCampaignDto?: ApproveCampaignDto,
  ): Promise<void> {
    const queryBuilder = this.campaignRepository
      .createQueryBuilder('campaign')
      .where('campaign.id = :id', { id });

    const campaignEntity = await queryBuilder.getOne();

    if (!campaignEntity) {
      throw new CampaignNotFoundException();
    }

    if (campaignEntity.status !== CampaignStatus.PENDING) {
      throw new BadRequestException();
    }

    if (approveCampaignDto && approveCampaignDto.mappingId) {
      campaignEntity.mappingId = approveCampaignDto.mappingId;
    }

    campaignEntity.status = isApprove
      ? CampaignStatus.DOING
      : CampaignStatus.DRAFT;

    await this.campaignRepository.save(campaignEntity);
  }
}
