import { IsString, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { normalizeSpaces } from '../../common/trim.transformer';

export class StartParticipationDto {
  @IsString()
  @Transform(normalizeSpaces)
  @MinLength(1)
  @MaxLength(80)
  alias!: string;
}
