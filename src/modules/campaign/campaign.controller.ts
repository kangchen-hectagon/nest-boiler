import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
} from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { IFile } from 'interfaces';

import type { PageDto } from '../../common/dto/page.dto';
import { CampaignStatus, RoleType } from '../../constants';
import {
  ApiFileFields,
  ApiPageOkResponse,
  Auth,
  AuthUser,
} from '../../decorators';
import { UserEntity } from '../user/user.entity';
import { CampaignService } from './campaign.service';
import { ApproveCampaignDto } from './dtos/approve-campaign.dto';
import { CampaignDto } from './dtos/campaign.dto';
import { CampaignPageOptionsDto } from './dtos/campaign-page-options.dto';
import { CreateCampaignDto } from './dtos/create-campaign.dto';
import { UpdateCampaignDto } from './dtos/update-campaign.dto';

@Controller('campaigns')
@ApiTags('campaigns')
export class CampaignController {
  constructor(private campaignService: CampaignService) {}

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiCreatedResponse()
  @ApiFileFields([
    { name: 'photo', maxCount: 1 },
    { name: 'logo', maxCount: 1 },
  ])
  async createCampaign(
    @Body() createCampaignDto: CreateCampaignDto,
    @AuthUser() user: UserEntity,
    @UploadedFiles()
    files: {
      photo: IFile[];
      logo: IFile[];
    },
  ) {
    if (
      [CampaignStatus.DOING, CampaignStatus.FINISHED].includes(
        createCampaignDto.status,
      )
    ) {
      throw new BadRequestException('status not valid');
    }

    const campaignEntity = await this.campaignService.createCampaign(
      user.id,
      createCampaignDto,
      files,
    );

    return campaignEntity.toDto();
  }

  @Get()
  @Auth([])
  @ApiPageOkResponse({ type: CampaignDto })
  async getCampaigns(
    @Query() campaignsPageOptionsDto: CampaignPageOptionsDto,
  ): Promise<PageDto<CampaignDto>> {
    return this.campaignService.getAllCampaign(campaignsPageOptionsDto);
  }

  @Get(':id')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: CampaignDto })
  async getSingleCampaign(@Param('id') id: number): Promise<CampaignDto> {
    const entity = await this.campaignService.getSingleCampaign(id);

    return entity.toDto();
  }

  @Put(':id')
  @Auth([])
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse()
  @ApiFileFields([
    { name: 'photo', maxCount: 1 },
    { name: 'logo', maxCount: 1 },
  ])
  updateCampaign(
    @Param('id') id: number,
    @Body() updateCampaignDto: UpdateCampaignDto,
    @UploadedFiles()
    files: {
      photo: IFile[];
      logo: IFile[];
    },
  ): Promise<void> {

    if (
      updateCampaignDto.status &&
      updateCampaignDto.status !== CampaignStatus.PENDING
    ) {
      throw new BadRequestException();
    }

    return this.campaignService.updateCampaign(id, updateCampaignDto, files);
  }

  @Post(':id/approve')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse()
  aprroveCampaign(
    @Param('id') id: number,
    @Body() approveCampaignDto: ApproveCampaignDto,
  ): Promise<void> {
    return this.campaignService.aprroveOrRejectCampaign(
      id,
      true,
      approveCampaignDto,
    );
  }

  @Post(':id/reject')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse()
  rejectCampaign(@Param('id') id: number): Promise<void> {
    return this.campaignService.aprroveOrRejectCampaign(id, false);
  }

  @Delete(':id')
  @Auth([])
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse()
  async deleteCampaign(@Param('id') id: number): Promise<void> {
    await this.campaignService.deleteCampaign(id);
  }
}
