import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'src/typeorm/request.entity';
import { Repository } from 'typeorm';
import { CreateRequestDto } from 'src/requests/dtos/CreateRequest.dto';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Request) private readonly requestRepository: Repository<Request>,
  ) { }

  // CREATE
  createRequest(createRequestDto: CreateRequestDto) {
    const newRequest = this.requestRepository.create(createRequestDto);
    return this.requestRepository.save(newRequest);
  }

  // READ
  getRequests() {
    return this.requestRepository.find();
  }

  findRequestById(rid: number) {
    return this.requestRepository.findOne({ where: { id: rid } })
  }

  // DELETE
  async deleteRequest(rid: number): Promise<void> {
    await this.requestRepository.delete(rid);
  }
}
