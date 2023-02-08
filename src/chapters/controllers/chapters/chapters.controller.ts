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

  @Get('name/:name')
  findChapterByName(@Param('name') name: string) {
    return this.chapterService.findChapterByName(name);
  }

  @Delete('delete/:cid')
  @UsePipes(ValidationPipe)
  deleteChapter(@Param('cid', ParseIntPipe) cid: number) {
    return this.chapterService.deleteChapter(cid);
  }

}
