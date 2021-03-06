import { BaseEntity as Base, PrimaryKey, Property } from '@mikro-orm/core';
import { ID, ObjectType } from '@nestjs/graphql';
import { SoftDeletable } from 'mikro-orm-soft-delete';

import { Field } from './field.decorator';

@ObjectType()
@SoftDeletable(() => BaseEntity, 'deletedAt', () => new Date())
export class BaseEntity<T extends BaseEntity<T>> extends Base<T, 'id'> {
  @Field(() => ID, { orderable: true, filterable: true })
  @PrimaryKey()
  readonly id: number;

  @Field(() => Date, { orderable: true, filterable: true })
  @Property({ onCreate: () => new Date() })
  readonly createdAt: Date;

  @Field(() => Date, { orderable: true, filterable: true })
  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  readonly updatedAt: Date;

  @Property({ nullable: true })
  readonly deletedAt?: Date;
}
