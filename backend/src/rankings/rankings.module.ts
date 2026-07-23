import { Module } from '@nestjs/common';
import { ScoringModule } from '../scoring/scoring.module';
import { RankingsService } from './rankings.service';

@Module({
  imports: [ScoringModule],
  providers: [RankingsService],
  exports: [RankingsService],
})
export class RankingsModule {}
