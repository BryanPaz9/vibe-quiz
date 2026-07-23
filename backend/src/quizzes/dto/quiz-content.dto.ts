import { Type } from 'class-transformer';
import { Transform } from 'class-transformer';
import { trimString } from '../../common/trim.transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class OptionInputDto {
  @IsString()
  @Transform(trimString)
  @MinLength(1)
  @MaxLength(500)
  text!: string;

  @IsInt()
  @Min(1)
  position!: number;

  @IsBoolean()
  isCorrect!: boolean;
}

export class QuestionInputDto {
  @IsString()
  @Transform(trimString)
  @MinLength(1)
  @MaxLength(1000)
  text!: string;

  @IsInt()
  @Min(1)
  position!: number;

  @IsArray()
  @ArrayMinSize(2)
  @ValidateNested({ each: true })
  @Type(() => OptionInputDto)
  options!: OptionInputDto[];
}

export class QuizContentDto {
  @IsString()
  @Transform(trimString)
  @MinLength(1)
  @MaxLength(160)
  title!: string;

  @IsOptional()
  @IsString()
  @Transform(trimString)
  @MaxLength(1000)
  description?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => QuestionInputDto)
  questions!: QuestionInputDto[];
}
