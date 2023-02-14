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
import { CreateChapterDto } from 'src/chapters/dtos/CreateChapter.dto';
import { UpdateChapterDto } from 'src/chapters/dtos/UpdateChapter.dto';
import { ChaptersService } from 'src/chapters/services/chapters/chapters.service';

@Controller('chapters')
export class ChaptersController {
  constructor(private readonly chapterService: ChaptersService) { }

  @Post('create')
  @UsePipes(ValidationPipe)
  createChapters(@Body() createChapterDto: CreateChapterDto) {
    return this.chapterService.createChapter(createChapterDto);
  }

  @Get()
  getChapters() {
    return this.chapterService.getChapters();
  }

  @Get('isbn_ten/:isbn_ten')
  getChaptersByIsbnTen(@Param('isbn_ten') isbn_ten: string) {
    return this.chapterService.getChaptersByIsbnTen(isbn_ten);
  }

  @Get('cid/:cid')
  @UsePipes(ValidationPipe)
  findChapterByName(@Param('cid', ParseIntPipe) cid: number) {
    return this.chapterService.findChapterById(cid);
  }

  @Delete('delete/:cid')
  @UsePipes(ValidationPipe)
  deleteChapter(@Param('cid', ParseIntPipe) cid: number) {
    return this.chapterService.deleteChapter(cid);
  }

  @Post('update/:cid')
  @UsePipes(ValidationPipe)
  updateChapter(@Param('cid', ParseIntPipe) cid: number, @Body() updateChapterDto: UpdateChapterDto) {
    return this.chapterService.updateChapter(cid, updateChapterDto);
  }

}
