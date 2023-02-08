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
import { CreateSummaryDto } from 'src/summaries/dtos/CreateSummary.dto';
import { UpdateSummaryDto } from 'src/summaries/dtos/UpdateSummary.dto';
import { SummariesService } from 'src/summaries/services/summaries/summaries.service';

@Controller('summaries')
export class SummariesController {
  constructor(private readonly summaryService: SummariesService) { }

  @Post('create')
  @UsePipes(ValidationPipe)
  createSummaries(@Body() createSummaryDto: CreateSummaryDto) {
    return this.summaryService.createSummary(createSummaryDto);
  }

  @Get()
  getSummaries() {
    return this.summaryService.getSummaries();
  }

  @Get('sid/:sid')
  @UsePipes(ValidationPipe)
  findSummaryByName(@Param('sid', ParseIntPipe) sid: number) {
    return this.summaryService.findSummaryById(sid);
  }

  @Delete('delete/:sid')
  @UsePipes(ValidationPipe)
  deleteSummary(@Param('sid', ParseIntPipe) sid: number) {
    return this.summaryService.deleteSummary(sid);
  }

  @Post('update/:sid')
  @UsePipes(ValidationPipe)
  updateSummary(@Param('sid', ParseIntPipe) sid: number, @Body() updateSummaryDto: UpdateSummaryDto) {
    return this.summaryService.updateSummary(sid, updateSummaryDto);
  }

}
