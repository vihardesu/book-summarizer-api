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
import { CreateRequestDto } from 'src/requests/dtos/CreateRequest.dto';
import { RequestsService } from 'src/requests/services/requests/requests.service';

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestService: RequestsService) { }

  @Post('create')
  @UsePipes(ValidationPipe)
  createRequests(@Body() createRequestDto: CreateRequestDto) {
    return this.requestService.createRequest(createRequestDto);
  }

  @Get()
  getRequests() {
    return this.requestService.getRequests();
  }

  @Get('rid/:rid')
  @UsePipes(ValidationPipe)
  findRequestByName(@Param('rid', ParseIntPipe) rid: number) {
    return this.requestService.findRequestById(rid);
  }

  @Delete('delete/:rid')
  @UsePipes(ValidationPipe)
  deleteRequest(@Param('rid', ParseIntPipe) rid: number) {
    return this.requestService.deleteRequest(rid);
  }

}
