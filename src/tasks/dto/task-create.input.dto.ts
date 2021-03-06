import { ID, InputType } from '@nestjs/graphql';
import { Length, MaxLength } from 'class-validator';
import { CommonFilter } from 'src/common/common-filter.enum';
import { Field } from 'src/common/field.decorator';
import { Room } from 'src/rooms/entities/room.entity';
import { IsPrimaryKey } from 'src/validation/is-primary-key.decorator';

@InputType()
export class TaskCreateInput {
  @Field(() => String)
  @Length(1, 30)
  title: string;

  @Field(() => String, { nullable: true })
  @MaxLength(500)
  description?: string;

  @Field(() => ID)
  @IsPrimaryKey(() => Room, [CommonFilter.Crud])
  room: number;
}
