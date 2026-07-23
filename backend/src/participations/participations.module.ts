import { Module } from '@nestjs/common';
import { ScoringModule } from '../scoring/scoring.module';
import { ParticipationsController } from './participations.controller';
import { ParticipationsService } from './participations.service';

@Module({
  imports: [ScoringModule],
  controllers: [ParticipationsController],
  providers: [ParticipationsService],
})
export class ParticipationsModule {}
