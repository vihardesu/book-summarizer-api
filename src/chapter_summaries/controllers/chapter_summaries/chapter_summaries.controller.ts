import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateChapterSummaryDto } from 'src/chapter_summaries/dtos/CreateChapterSummary.dto';
import { UpdateChapterSummaryDto } from 'src/chapter_summaries/dtos/UpdateChapterSummary.dto';
import { ChapterSummariesService } from 'src/chapter_summaries/services/chapter_summaries/chapter_summaries.service';

@Controller('chapter_summaries')
export class ChapterSummariesController {
  constructor(private readonly chapter_summaryService: ChapterSummariesService) { }

  @Post('create')
  @UsePipes(ValidationPipe)
  createChapterSummaries(@Body() createChapterSummaryDto: CreateChapterSummaryDto) {
    return this.chapter_summaryService.createChapterSummary(createChapterSummaryDto);
  }

  @Get()
  getChapterSummaries() {
    return this.chapter_summaryService.getChapterSummaries();
  }

  @Get('csid/:csid')
  findChapterSummariesById(@Param('csid') csid: number) {
    return this.chapter_summaryService.findChapterSummaryById(csid);
  }

  @Get('isbn_ten/:isbn_ten/summary_type/:summary_type')
  findChapterSummariesByTypeAndIsbn(@Param('isbn_ten') isbn_ten: string, @Param('summary_type') summary_type: string) {
    return this.chapter_summaryService.findChapterSummariesByTypeAndIsbn(isbn_ten, summary_type);
  }

  @Delete('delete/:csid')
  @UsePipes(ValidationPipe)
  deleteChapterSummary(@Param('csid') csid: string) {
    return this.chapter_summaryService.deleteChapterSummary(csid);
  }

  @Post('update/:csid')
  @UsePipes(ValidationPipe)
  updateChapterSummary(@Param('csid') csid: string, @Body() updateChapterSummaryDto: UpdateChapterSummaryDto) {
    return this.chapter_summaryService.updateChapterSummary(csid, updateChapterSummaryDto);
  }

}
