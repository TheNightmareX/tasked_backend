import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateSheduleItemDto {
  @IsInt()
  classroom: number;

  @IsString()
  @Length(1, 50)
  name: string;

  @IsDateString()
  time: string;

  @IsOptional()
  @IsString()
  @Length(1, 200)
  remark?: string;
}
