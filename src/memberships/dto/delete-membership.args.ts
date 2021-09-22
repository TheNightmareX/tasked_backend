import { ArgsType } from '@nestjs/graphql';
import { TargetedArgs } from 'src/common/dto/targeted.args';

@ArgsType()
export class DeleteMembershipArgs extends TargetedArgs {}
