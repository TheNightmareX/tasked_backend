import { Entity, Filter, ManyToOne, Property } from '@mikro-orm/core';
import { ObjectType } from '@nestjs/graphql';
import { Classroom } from 'src/classrooms/entities/classroom.entity';
import { BaseEntity } from 'src/common/base-entity.entity';
import { Field } from 'src/common/utilities/field.decorator';
import { User } from 'src/users/entities/user.entity';

import { Role } from './role.enum';

@ObjectType()
@Filter<Membership>({
  name: 'visible',
  cond: ({ user }: { user: User }) => ({
    classroom: { memberships: { owner: user } },
  }),
})
@Entity()
export class Membership extends BaseEntity<Membership> {
  @ManyToOne({
    entity: () => User,
  })
  owner: User;

  @ManyToOne({
    entity: () => Classroom,
  })
  classroom: Classroom;

  @Field(() => String, { nullable: true })
  @Property({
    nullable: true,
  })
  displayName?: string;

  @Field(() => Role)
  @Property()
  role: Role;

  async getWeight() {
    await this.classroom.init();
    if (this.owner == this.classroom.creator) return 3;
    if (this.role == Role.Teacher) return 2;
    return 1;
  }
}
