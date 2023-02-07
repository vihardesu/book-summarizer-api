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
import { CreateBookDto } from 'src/books/dtos/CreateBook.dto';
import { BooksService } from 'src/books/services/books/books.service';

@Controller('books')
export class BooksController {
  constructor(private readonly bookService: BooksService) { }

  @Post('create')
  @UsePipes(ValidationPipe)
  createBooks(@Body() createBookDto: CreateBookDto) {
    return this.bookService.createBook(createBookDto);
  }

  @Get()
  getBooks() {
    return this.bookService.getBooks();
  }

  @Get('title/:title')
  findBooksById(@Param('title') title: string) {
    return this.bookService.findBooksByTitle(title);
  }

  @Delete('delete/:bid')
  @UsePipes(ValidationPipe)
  deleteBook(@Param('bid', ParseIntPipe) bid: number) {
    return this.bookService.deleteBook(bid);
  }

}
