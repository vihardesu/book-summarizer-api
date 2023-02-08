import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chapter } from 'src/typeorm/chapter.entity';
import { Repository } from 'typeorm';
import { CreateChapterDto } from 'src/chapters/dtos/CreateChapter.dto';
import { UpdateChapterDto } from 'src/chapters/dtos/UpdateChapter.dto';

@Injectable()
export class ChaptersService {
  constructor(
    @InjectRepository(Chapter) private readonly chapterRepository: Repository<Chapter>,
  ) { }

  // CREATE
  createChapter(createChapterDto: CreateChapterDto) {
    const newChapter = this.chapterRepository.create(createChapterDto);
    return this.chapterRepository.save(newChapter);
  }

  // READ
  getChapters() {
    return this.chapterRepository.find();
  }

  findChapterById(cid: number) {
    return this.chapterRepository.findOne({ where: { id: cid } })
  }

  // UPDATE
  updateChapter(cid: number, updateChapterDto: UpdateChapterDto) {
    return this.chapterRepository.update(cid, updateChapterDto);
  }

  // DELETE
  async deleteChapter(cid: number): Promise<void> {
    await this.chapterRepository.delete(cid);
  }
}
