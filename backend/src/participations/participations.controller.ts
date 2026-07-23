import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { StartParticipationDto } from './dto/start-participation.dto';
import { SubmitParticipationDto } from './dto/submit-participation.dto';
import { ParticipationsService } from './participations.service';

@Controller()
@ApiTags('Participations')
export class ParticipationsController {
  constructor(private readonly participations: ParticipationsService) {}

  @Post('public/quizzes/:publicId/participations')
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  start(
    @Param('publicId', ParseUUIDPipe) publicId: string,
    @Body() dto: StartParticipationDto,
  ) {
    return this.participations.start(publicId, dto);
  }

  @Post('participations/:participationId/submissions')
  @ApiSecurity('participation-token')
  submit(
    @Param('participationId', ParseUUIDPipe) participationId: string,
    @Headers('authorization') authorization: string | undefined,
    @Body() dto: SubmitParticipationDto,
  ) {
    return this.participations.submit(participationId, authorization, dto);
  }

  @Get('participations/:participationId/result')
  @ApiSecurity('participation-token')
  result(
    @Param('participationId', ParseUUIDPipe) participationId: string,
    @Headers('authorization') authorization: string | undefined,
  ) {
    return this.participations.result(participationId, authorization);
  }
}
