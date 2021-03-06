import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { AssignmentsService } from 'src/assignments/assignments.service';
import { QueryAssignmentsArgs } from 'src/assignments/dto/query-assignments.args.dto';
import { MembershipRefLoader } from 'src/memberships/membership-ref.loader';

import { Task } from './entities/task.entity';

@Resolver(() => Task)
export class TasksFieldsResolver {
  constructor(
    private membershipRefLoader: MembershipRefLoader,
    private assignmentsService: AssignmentsService,
  ) {}

  @ResolveField()
  async creator(@Parent() entity: Task) {
    return this.membershipRefLoader.load(entity.creator);
  }

  @ResolveField()
  async assignments(
    @Args() args: QueryAssignmentsArgs,
    @Parent() entity: Task,
  ) {
    return this.assignmentsService.queryMany(args, { task: entity });
  }
}
