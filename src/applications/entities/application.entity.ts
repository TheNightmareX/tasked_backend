import { Entity, Filter, ManyToOne, Property } from '@mikro-orm/core';
import { ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/common/base-entity.entity';
import { CommonFilter } from 'src/common/common-filter.enum';
import { Field } from 'src/common/field.decorator';
import { Context } from 'src/context/context.class';
import { Room } from 'src/rooms/entities/room.entity';
import { User } from 'src/users/entities/user.entity';

import { ApplicationStatus } from './application-status.enum';

@ObjectType()
@Filter<Application>({
  name: CommonFilter.Crud,
  cond: () => ({
    $or: [
      { owner: Context.current.user },
      { room: { creator: Context.current.user } },
    ],
  }),
})
@Entity()
export class Application extends BaseEntity<Application> {
  @Field(() => User)
  @ManyToOne({
    entity: () => User,
  })
  owner: User;

  @Field(() => Room)
  @ManyToOne({
    entity: () => Room,
  })
  room: Room;

  @Field(() => String, { nullable: true, orderable: true, filterable: true })
  @Property({ nullable: true })
  message?: string;

  @Field(() => ApplicationStatus, { orderable: true, filterable: true })
  @Property()
  status: ApplicationStatus;
}
