import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
import { AssignmentsModule } from 'src/assignments/assignments.module';
import { Assignment } from 'src/assignments/entities/assignment.entity';
import { RoomsModule } from 'src/rooms/rooms.module';
import { SharedModule } from 'src/shared/shared.module';
import { TasksModule } from 'src/tasks/tasks.module';
import { UsersModule } from 'src/users/users.module';

import { Membership } from './entities/membership.entity';
import { MembershipRefLoader } from './membership-ref.loader';
import { MembershipsResolver } from './memberships.resolver';
import { MembershipsService } from './memberships.service';
import { MembershipsFieldsResolver } from './memberships-fields.resolver';

@Module({
  imports: [
    SharedModule,
    MikroOrmModule.forFeature([Membership, Assignment]),
    forwardRef(() => UsersModule),
    forwardRef(() => RoomsModule),
    forwardRef(() => AssignmentsModule),
    forwardRef(() => TasksModule),
  ],
  providers: [
    MembershipsResolver,
    MembershipsFieldsResolver,
    MembershipsService,
    MembershipRefLoader,
  ],
  exports: [MembershipsService, MembershipRefLoader],
})
export class MembershipsModule {}
