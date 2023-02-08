import { Module } from '@nestjs/common';
import { SummariesController } from './controllers/summaries/summaries.controller';
import { SummariesService } from './services/summaries/summaries.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Summary } from 'src/typeorm/summary.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Summary])],
  controllers: [SummariesController],
  providers: [SummariesService]
})
export class SummariesModule { }
