import { Module } from '@nestjs/common';
import { RequestsController } from './controllers/requests/requests.controller';
import { RequestsService } from './services/requests/requests.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Request } from 'src/typeorm/request.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Request])],
  controllers: [RequestsController],
  providers: [RequestsService]
})
export class RequestsModule { }
