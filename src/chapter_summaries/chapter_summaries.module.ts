import { Module } from '@nestjs/common';
import { ChapterSummariesController } from './controllers/chapter_summaries/chapter_summaries.controller';
import { ChapterSummariesService } from './services/chapter_summaries/chapter_summaries.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChapterSummary } from 'src/typeorm/chapter_summary.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChapterSummary])],
  controllers: [ChapterSummariesController],
  providers: [ChapterSummariesService]
})
export class ChapterSummariesModule { }
