import {
  Collection,
  Entity,
  Filter,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { ObjectType } from '@nestjs/graphql';
import { Field } from 'src/common/field.decorator';
import { JoinApplication } from 'src/join-applications/entities/join-application.entity';
import { PaginatedMemberships } from 'src/memberships/dto/paginated-memberships.dto';
import { Membership } from 'src/memberships/entities/membership.entity';
import { BaseEntity } from 'src/mikro/base-entity.entity';
import { Quota } from 'src/mikro/quota.decorator';
import { CRUD_FILTER } from 'src/mikro-filters/crud-filter.constant';
import { CrudFilterArgs } from 'src/mikro-filters/crud-filter-args.interface';
import { QUOTA_FILTER } from 'src/mikro-filters/quota-filter.constant';
import { QuotaFilterArgs } from 'src/mikro-filters/quota-filter-args.interface';
import { PaginatedTasks } from 'src/tasks/dto/paginated-tasks.dto';
import { Task } from 'src/tasks/entities/task.entity';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
@Quota(20, [QUOTA_FILTER])
@Filter<Classroom>({
  name: QUOTA_FILTER,
  cond: ({ user }: QuotaFilterArgs) => ({
    creator: user,
  }),
})
@Filter<Classroom>({
  name: CRUD_FILTER,
  cond: ({ user }: CrudFilterArgs) => ({
    $or: [{ memberships: { owner: user } }, { isOpen: true }],
  }),
})
@Entity()
export class Classroom extends BaseEntity<Classroom> {
  @Field(() => String)
  @Property()
  name: string;

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  description?: string;

  @Field(() => Boolean)
  @Property()
  isOpen: boolean;

  @Field(() => User)
  @ManyToOne({
    entity: () => User,
  })
  creator: User;

  @OneToMany({
    entity: () => JoinApplication,
    mappedBy: (application) => application.classroom,
    orphanRemoval: true,
  })
  joinApplications = new Collection<JoinApplication>(this);

  @Field(() => PaginatedMemberships)
  @OneToMany({
    entity: () => Membership,
    mappedBy: (membership) => membership.classroom,
    orphanRemoval: true,
  })
  memberships = new Collection<Membership>(this);

  @Field(() => PaginatedTasks)
  @OneToMany({
    entity: () => Task,
    mappedBy: (task) => task.classroom,
    orphanRemoval: true,
  })
  tasks = new Collection<Task>(this);
}
