import {
  BeforeCreate,
  BeforeUpdate,
  Cascade,
  Collection,
  Entity,
  OneToMany,
  Property,
  Unique,
} from '@mikro-orm/core';
import { ObjectType } from '@nestjs/graphql';
import { hash } from 'bcryptjs';
import dayjs from 'dayjs';
import { PaginatedApplications } from 'src/applications/dto/paginated-applications.obj.dto';
import { Application } from 'src/applications/entities/application.entity';
import { BaseEntity } from 'src/common/base-entity.entity';
import { Field } from 'src/common/field.decorator';
import { PaginatedMemberships } from 'src/memberships/dto/paginated-memberships.obj.dto';
import { Membership } from 'src/memberships/entities/membership.entity';
import { Quota } from 'src/mikro/mikro-quota/quota.decorator';
import { PaginatedRooms } from 'src/rooms/dto/paginated-rooms.obj.dto';
import { Room } from 'src/rooms/entities/room.entity';
import { Gender } from 'src/users/entities/gender.enum';

@ObjectType()
@Unique<User>({ properties: ['username', 'deletedAt'] })
@Entity()
export class User extends BaseEntity<User> {
  @Field(() => String, { orderable: true, filterable: true })
  @Property()
  username: string;

  @Field(() => String, { nullable: true, orderable: true, filterable: true })
  @Property({ nullable: true })
  nickname?: string;

  @Property()
  password: string;

  @Field(() => Gender, { orderable: true, filterable: true })
  @Property()
  gender: Gender = Gender.Unknown;

  @Quota(20)
  @Field(() => PaginatedRooms)
  @OneToMany({
    entity: () => Room,
    mappedBy: (room) => room.creator,
    cascade: [Cascade.ALL],
  })
  rooms = new Collection<Room>(this);

  @Field(() => PaginatedApplications)
  @OneToMany({
    entity: () => Application,
    mappedBy: (application) => application.owner,
    cascade: [Cascade.ALL],
  })
  applications = new Collection<Application>(this);

  @Field(() => PaginatedMemberships)
  @OneToMany({
    entity: () => Membership,
    mappedBy: (memberships) => memberships.owner,
    cascade: [Cascade.ALL],
  })
  memberships = new Collection<Membership>(this);

  get isUpdatedRecently() {
    return dayjs(this.updatedAt).isAfter(dayjs().subtract(5, 'minute'));
  }

  @BeforeCreate()
  @BeforeUpdate()
  async hashPassword() {
    const HASHED_LENGTH = 60;
    if (this.password.length == HASHED_LENGTH) return;
    this.password = await hash(this.password, 10);
  }
}
