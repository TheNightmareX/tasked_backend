import {
  BeforeCreate,
  BeforeUpdate,
  Collection,
  Entity,
  OneToMany,
  Property,
  Unique,
} from '@mikro-orm/core';
import { hash } from 'bcryptjs';
import dayjs from 'dayjs';
import { BaseEntity } from 'src/base-entity.entity';
import { Classroom } from 'src/classrooms/entities/classroom.entity';
import { JoinApplication } from 'src/join-applications/entities/join-application.entity';
import { Membership } from 'src/memberships/entities/membership.entity';
import { Gender } from '../gender.enum';

@Entity()
export class User extends BaseEntity<User> {
  @Property()
  @Unique()
  username: string;

  @Property({
    nullable: true,
  })
  nickname: string | null;

  @Property({
    hidden: true,
  })
  password: string;

  @Property()
  gender: Gender = Gender.Unknown;

  @OneToMany({
    entity: () => Classroom,
    mappedBy: (classroom) => classroom.creator,
    hidden: true,
  })
  classrooms = new Collection<Classroom>(this);

  @OneToMany({
    entity: () => JoinApplication,
    mappedBy: (application) => application.owner,
    hidden: true,
  })
  joinApplications = new Collection<JoinApplication>(this);

  @OneToMany({
    entity: () => Membership,
    mappedBy: (memberships) => memberships.owner,
    hidden: true,
  })
  memberships = new Collection<Membership>(this);

  get isUpdatedRecently() {
    const DAYS = 3;
    return dayjs(this.updatedAt).isAfter(dayjs().subtract(DAYS, 'd'));
  }

  @BeforeCreate()
  @BeforeUpdate()
  async hashPassword() {
    const HASHED_LENGTH = 60;
    if (this.password.length == HASHED_LENGTH) return;
    this.password = await hash(this.password, 10);
  }
}

declare module 'express' {
  interface Request {
    user?: User;
  }
}
