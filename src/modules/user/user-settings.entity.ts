import { Column, Entity } from 'typeorm';

import type { IAbstractEntity } from '../../common/abstract.entity';
import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { UserDto } from './dtos/user.dto';
import type { IUserEntity } from './user.entity';

export interface IUserSettingsEntity extends IAbstractEntity<UserDto> {
  isEmailVerified?: boolean;

  isPhoneVerified?: boolean;

  user?: IUserEntity;
}

@Entity({ name: 'user_settings' })
@UseDto(UserDto)
export class UserSettingsEntity
  extends AbstractEntity<UserDto>
  implements IUserSettingsEntity
{
  @Column({ default: false })
  isEmailVerified?: boolean;

  @Column({ default: false })
  isPhoneVerified?: boolean;

  @Column({ type: 'uuid' })
  userId?: string;
}
