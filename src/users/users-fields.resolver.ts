import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { ApplicationsService } from 'src/applications/applications.service';
import { QueryApplicationsArgs } from 'src/applications/dto/query-applications.args.dto';
import { AssignmentsService } from 'src/assignments/assignments.service';
import { PaginatedAssignments } from 'src/assignments/dto/paginated-assignments.obj.dto';
import { QueryAssignmentsArgs } from 'src/assignments/dto/query-assignments.args.dto';
import { QueryMembershipsArgs } from 'src/memberships/dto/query-memberships.args.dto';
import { MembershipsService } from 'src/memberships/memberships.service';
import { QueryRoomsArgs } from 'src/rooms/dto/query-rooms.args.dto';
import { RoomsService } from 'src/rooms/rooms.service';
import { PaginatedTasks } from 'src/tasks/dto/paginated-tasks.obj.dto';
import { QueryTasksArgs } from 'src/tasks/dto/query-tasks.args.dto';
import { TasksService } from 'src/tasks/tasks.service';

import { User } from './entities/user.entity';

@Resolver(() => User)
export class UsersFieldsResolver {
  constructor(
    private roomsService: RoomsService,
    private applicationsService: ApplicationsService,
    private membershipsService: MembershipsService,
    private tasksService: TasksService,
    private assignmentsService: AssignmentsService,
  ) {}

  @ResolveField()
  async rooms(@Args() args: QueryRoomsArgs, @Parent() entity: User) {
    return this.roomsService.queryMany(args, { creator: entity });
  }

  @ResolveField()
  async applications(
    @Args() args: QueryApplicationsArgs,
    @Parent() entity: User,
  ) {
    return this.applicationsService.queryMany(args, { owner: entity });
  }

  @ResolveField()
  async memberships(
    @Args() args: QueryMembershipsArgs,
    @Parent() entity: User,
  ) {
    return this.membershipsService.queryMany(args, { owner: entity });
  }

  @ResolveField(() => PaginatedTasks)
  async tasks(@Args() args: QueryTasksArgs, @Parent() entity: User) {
    return this.tasksService.queryMany(args, { creator: { owner: entity } });
  }

  @ResolveField(() => PaginatedAssignments)
  async assignments(
    @Args() args: QueryAssignmentsArgs,
    @Parent() entity: User,
  ) {
    return this.assignmentsService.queryMany(args, {
      recipient: { owner: entity },
    });
  }
}
