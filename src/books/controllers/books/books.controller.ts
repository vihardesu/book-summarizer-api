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
import { UpdateBookDto } from 'src/books/dtos/UpdateBook.dto';
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
    return this.bookService.findBookByTitle(title);
  }

  @Delete('delete/:isbn_ten')
  @UsePipes(ValidationPipe)
  deleteBook(@Param('isbn_ten') isbn_ten: string) {
    return this.bookService.deleteBook(isbn_ten);
  }

  @Post('update/:isbn_ten')
  @UsePipes(ValidationPipe)
  updateBook(@Param('isbn_ten') isbn_ten: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.updateBook(isbn_ten, updateBookDto);
  }

}
