import { Module } from '@nestjs/common';
import { ChaptersController } from './controllers/chapters/chapters.controller';
import { ChaptersService } from './services/chapters/chapters.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chapter } from 'src/typeorm/chapter.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Chapter])],
  controllers: [ChaptersController],
  providers: [ChaptersService]
})
export class ChaptersModule { }
