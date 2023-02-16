import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChapterSummary } from 'src/typeorm/chapter_summary.entity';
import { Repository } from 'typeorm';
import { CreateChapterSummaryDto } from 'src/chapter_summaries/dtos/CreateChapterSummary.dto';
import { UpdateChapterSummaryDto } from 'src/chapter_summaries/dtos/UpdateChapterSummary.dto';

@Injectable()
export class ChapterSummariesService {
  constructor(
    @InjectRepository(ChapterSummary) private readonly chapter_summaryRepository: Repository<ChapterSummary>,
  ) { }

  // CREATE
  createChapterSummary(createChapterSummaryDto: CreateChapterSummaryDto) {
    const newChapterSummary = this.chapter_summaryRepository.create(createChapterSummaryDto);
    return this.chapter_summaryRepository.save(newChapterSummary);
  }

  // READ
  getChapterSummaries() {
    return this.chapter_summaryRepository.find();
  }

  findChapterSummaryById(csid: number) {
    return this.chapter_summaryRepository.findOne({ where: { id: csid } });
  }

  findChapterSummariesByTypeAndIsbn(isbn_ten: string, summary_type: string) {
    return this.chapter_summaryRepository.find({ where: { isbn_ten: isbn_ten, summary_type: summary_type }, order: { sequence_index: 'ASC' } });
  }

  async findChapterSummaryTypes(isbn_ten: string) {
    //return this.chapter_summaryRepository.find({ where: { isbn_ten: isbn_ten }, select: ['summary_type'] });
    return await this.chapter_summaryRepository.createQueryBuilder('entity')
      .select('summary_type')
      .where('isbn_ten = :isbn_ten', { isbn_ten: isbn_ten })
      .distinct(true)
      .getRawMany()
      .then((result) => result.map((item) => item.summary_type))
      .then((result) => result.sort());
  }

  // UPDATE
  updateChapterSummary(csid: string, updateChapterSummaryDto: UpdateChapterSummaryDto) {
    return this.chapter_summaryRepository.update(csid, updateChapterSummaryDto);
  }

  // DELETE
  async deleteChapterSummary(csid: string): Promise<void> {
    await this.chapter_summaryRepository.delete(csid);
  }
}
