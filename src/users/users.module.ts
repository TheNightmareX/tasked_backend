import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
import { ApplicationsModule } from 'src/applications/applications.module';
import { AssignmentsModule } from 'src/assignments/assignments.module';
import { MembershipsModule } from 'src/memberships/memberships.module';
import { RoomsModule } from 'src/rooms/rooms.module';
import { SharedModule } from 'src/shared/shared.module';
import { TasksModule } from 'src/tasks/tasks.module';

import { User } from './entities/user.entity';
import { UserRefLoader } from './user-ref.loader';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { UsersFieldsResolver } from './users-fields.resolver';

@Module({
  imports: [
    SharedModule,
    MikroOrmModule.forFeature([User]),
    forwardRef(() => RoomsModule),
    forwardRef(() => ApplicationsModule),
    forwardRef(() => MembershipsModule),
    forwardRef(() => TasksModule),
    forwardRef(() => AssignmentsModule),
  ],
  providers: [UsersResolver, UsersFieldsResolver, UsersService, UserRefLoader],
  exports: [UsersService, UserRefLoader],
})
export class UsersModule {}
