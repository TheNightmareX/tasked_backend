import { InputType } from '@nestjs/graphql';
import { Length, MaxLength } from 'class-validator';
import { Field } from 'src/common/field.decorator';

@InputType()
export class RoomCreateInput {
  @Field(() => String)
  @Length(1, 15)
  name: string;

  @Field(() => String, { nullable: true })
  @MaxLength(100)
  description?: string;
}
