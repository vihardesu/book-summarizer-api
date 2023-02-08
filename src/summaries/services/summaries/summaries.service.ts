import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Summary } from 'src/typeorm/summary.entity';
import { Repository } from 'typeorm';
import { CreateSummaryDto } from 'src/summaries/dtos/CreateSummary.dto';
import { UpdateSummaryDto } from 'src/summaries/dtos/UpdateSummary.dto';

@Injectable()
export class SummariesService {
  constructor(
    @InjectRepository(Summary) private readonly summaryRepository: Repository<Summary>,
  ) { }

  // CREATE
  createSummary(createSummaryDto: CreateSummaryDto) {
    const newSummary = this.summaryRepository.create(createSummaryDto);
    return this.summaryRepository.save(newSummary);
  }

  // READ
  getSummaries() {
    return this.summaryRepository.find();
  }

  findSummaryById(sid: number) {
    return this.summaryRepository.findOne({ where: { id: sid } })
  }

  // UPDATE
  updateSummary(sid: number, updateSummaryDto: UpdateSummaryDto) {
    return this.summaryRepository.update(sid, updateSummaryDto);
  }

  // DELETE
  async deleteSummary(sid: number): Promise<void> {
    await this.summaryRepository.delete(sid);
  }
}
