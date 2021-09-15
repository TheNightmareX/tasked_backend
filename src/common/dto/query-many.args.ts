import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsOptional, Max, Min } from 'class-validator';

@ArgsType()
export class QueryManyArgs {
  @Field(() => Int, { nullable: true })
  @Max(100)
  @Min(1)
  @IsOptional()
  limit = 50;

  @Field(() => Int, { nullable: true })
  @Max(2000)
  @Min(1)
  @IsOptional()
  offset?: number;
}