import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RankingsService } from '../rankings/rankings.service';
import { ListQuizzesDto } from './dto/list-quizzes.dto';
import { PaginationDto } from './dto/pagination.dto';
import { QuizContentDto } from './dto/quiz-content.dto';
import { QuizzesService } from './quizzes.service';

@Controller('admin/quizzes')
@UseGuards(JwtAuthGuard)
@ApiTags('Admin quizzes')
@ApiBearerAuth()
export class AdminQuizzesController {
  constructor(
    private readonly quizzes: QuizzesService,
    private readonly rankings: RankingsService,
  ) {}

  @Get()
  list(@Query() query: ListQuizzesDto) {
    return this.quizzes.list(query);
  }

  @Post()
  create(@Body() dto: QuizContentDto) {
    return this.quizzes.create(dto);
  }

  @Get(':quizId')
  get(@Param('quizId', ParseUUIDPipe) quizId: string) {
    return this.quizzes.getAdmin(quizId);
  }

  @Put(':quizId')
  replace(
    @Param('quizId', ParseUUIDPipe) quizId: string,
    @Body() dto: QuizContentDto,
  ) {
    return this.quizzes.replace(quizId, dto);
  }

  @Delete(':quizId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('quizId', ParseUUIDPipe) quizId: string) {
    return this.quizzes.remove(quizId);
  }

  @Post(':quizId/publish')
  @HttpCode(HttpStatus.OK)
  publish(@Param('quizId', ParseUUIDPipe) quizId: string) {
    return this.quizzes.publish(quizId);
  }

  @Post(':quizId/close')
  @HttpCode(HttpStatus.OK)
  close(@Param('quizId', ParseUUIDPipe) quizId: string) {
    return this.quizzes.close(quizId);
  }

  @Get(':quizId/results')
  results(
    @Param('quizId', ParseUUIDPipe) quizId: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.quizzes.results(quizId, pagination.page, pagination.pageSize);
  }

  @Get(':quizId/ranking')
  ranking(@Param('quizId', ParseUUIDPipe) quizId: string) {
    return this.rankings.byQuizId(quizId);
  }
}
