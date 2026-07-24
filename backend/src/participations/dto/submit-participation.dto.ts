import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsUUID, ValidateNested } from 'class-validator';

export class AnswerInputDto {
  @IsUUID()
  questionId!: string;

  @IsUUID()
  optionId!: string;
}

export class SubmitParticipationDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AnswerInputDto)
  answers!: AnswerInputDto[];
}
