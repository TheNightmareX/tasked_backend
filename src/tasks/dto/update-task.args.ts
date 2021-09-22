import { ArgsType, IntersectionType } from '@nestjs/graphql';
import { HasDataArgs } from 'src/common/dto/has-data.args';
import { TargetedArgs } from 'src/common/dto/targeted.args';

import { TaskUpdateInput } from './task-update.input';

@ArgsType()
export class UpdateTaskArgs extends IntersectionType(
  TargetedArgs,
  HasDataArgs.for(TaskUpdateInput),
) {}
