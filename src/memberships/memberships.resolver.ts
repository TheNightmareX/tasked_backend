import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Parent, Query, Resolver } from '@nestjs/graphql';
import { UseAccessPolicies } from 'nest-access-policy';
import { AccessPolicyGuard } from 'src/common/access-policy/access-policy.guard';
import { CRUD_FILTERS } from 'src/common/crud-filters/crud-filters.token';
import { CrudFilters } from 'src/common/crud-filters/crud-filters.type';
import { FlushDb } from 'src/common/flush-db/flush-db.decorator';
import { ReqUser } from 'src/common/req-user.decorator';
import { ResolveField } from 'src/common/resolve-field.decorator';
import { User } from 'src/users/entities/user.entity';

import { DeleteMembershipArgs } from './dto/delete-membership.args';
import { PaginatedMemberships } from './dto/paginated-memberships.dto';
import { QueryMembershipArgs } from './dto/query-membership.args';
import { QueryMembershipsArgs } from './dto/query-memberships.args';
import { Membership } from './entities/membership.entity';
import { MembershipsAccessPolicy } from './memberships.access-policy';
import { MembershipsService } from './memberships.service';

@UseAccessPolicies(MembershipsAccessPolicy)
@UseGuards(AccessPolicyGuard)
@Resolver(() => Membership)
export class MembershipsResolver {
  @Inject()
  private readonly service: MembershipsService;

  @Inject(CRUD_FILTERS)
  private readonly filters: CrudFilters;

  @Query(() => PaginatedMemberships, {
    name: 'memberships',
  })
  async queryMany(
    @ReqUser() user: User,
    @Args() { limit, offset }: QueryMembershipsArgs,
  ) {
    return this.service.list(
      {},
      { limit, offset, filters: this.filters(user) },
    );
  }

  @Query(() => Membership, {
    name: 'membership',
  })
  async queryOne(@ReqUser() user: User, @Args() { id }: QueryMembershipArgs) {
    return this.service.retrieve(id, { filters: this.filters(user) });
  }

  @FlushDb()
  @Mutation(() => Membership, {
    name: 'deleteMembership',
  })
  async deleteOne(@ReqUser() user: User, @Args() { id }: DeleteMembershipArgs) {
    return this.service.destroy(id, { filters: this.filters(user) });
  }

  @ResolveField(() => Membership, 'owner')
  resolveOwner(@Parent() entity: Membership) {
    return entity.owner.init();
  }

  @ResolveField(() => Membership, 'classroom')
  resolveClassroom(@Parent() entity: Membership) {
    return entity.classroom.init();
  }
}
