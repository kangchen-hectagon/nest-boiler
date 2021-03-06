import { define } from 'typeorm-seeding';

import { RoleType } from '../../constants';
import { UserEntity } from '../../modules/user/user.entity';

define(UserEntity, (faker) => {
  const gender = faker.random.number(1);
  const firstName = faker.name.firstName(gender);
  const lastName = faker.name.lastName(gender);
  const email = faker.internet.email(firstName, lastName);

  const user = new UserEntity();
  user.name = firstName;
  user.email = email;
  user.role = RoleType.USER;
  user.password = '111111';

  return user;
});
