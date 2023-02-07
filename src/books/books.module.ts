import { Module } from '@nestjs/common';
import { BooksController } from './controllers/books/books.controller';
import { BooksService } from './services/books/books.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Books } from 'src/typeorm';


@Module({
  imports: [TypeOrmModule.forFeature([Books])],
  controllers: [BooksController],
  providers: [BooksService]
})
export class BooksModule { }
