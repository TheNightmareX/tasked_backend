import { Module } from '@nestjs/common';
import { CrudModule } from 'src/crud/crud.module';
import { SharedModule } from 'src/shared/shared.module';

import { Membership } from './entities/membership.entity';
import { MembershipsResolver } from './memberships.resolver';
import { MembershipsService } from './memberships.service';
import { MembershipsFieldsResolver } from './memberships-fields.resolver';

@Module({
  imports: [SharedModule, CrudModule.forFeature(Membership)],
  providers: [
    MembershipsResolver,
    MembershipsFieldsResolver,
    MembershipsService,
  ],
  exports: [MembershipsService],
})
export class MembershipsModule {}
