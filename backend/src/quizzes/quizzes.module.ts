import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { RankingsModule } from '../rankings/rankings.module';
import { AdminQuizzesController } from './admin-quizzes.controller';
import { PublicQuizzesController } from './public-quizzes.controller';
import { QuizzesService } from './quizzes.service';

@Module({
  imports: [AuthModule, RankingsModule],
  controllers: [AdminQuizzesController, PublicQuizzesController],
  providers: [QuizzesService],
  exports: [QuizzesService],
})
export class QuizzesModule {}
