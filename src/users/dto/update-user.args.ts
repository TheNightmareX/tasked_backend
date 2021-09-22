import { ArgsType, IntersectionType } from '@nestjs/graphql';
import { HasDataArgs } from 'src/common/dto/has-data.args';
import { TargetedArgs } from 'src/common/dto/targeted.args';

import { UserUpdateInput } from './user-update.input';

@ArgsType()
export class UpdateUserArgs extends IntersectionType(
  TargetedArgs,
  HasDataArgs.for(UserUpdateInput),
) {}
