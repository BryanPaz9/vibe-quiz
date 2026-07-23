import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { RankingsService } from '../rankings/rankings.service';
import { QuizzesService } from './quizzes.service';

@Controller('public/quizzes')
export class PublicQuizzesController {
  constructor(
    private readonly quizzes: QuizzesService,
    private readonly rankings: RankingsService,
  ) {}

  @Get(':publicId')
  get(@Param('publicId', ParseUUIDPipe) publicId: string) {
    return this.quizzes.getPublic(publicId);
  }

  @Get(':publicId/ranking')
  ranking(@Param('publicId', ParseUUIDPipe) publicId: string) {
    return this.rankings.byPublicId(publicId);
  }
}
