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

  //GET
  @Get()
  getBooks() {
    return this.bookService.getBooks();
  }
  
  @Get('isbn_ten/:isbn_ten')
  findBookByIsbnTen(@Param('isbn_ten') isbn_ten: string) {
    return this.bookService.findBookByIsbnTen(isbn_ten);
  }

  @Get('title/:title')
  findBooksByTitle(@Param('title') title: string) {
    return this.bookService.findBookByTitle(title);
  }

  @Get('search/query/:query')
  findBooksByQuery(@Param('query') query: string) {
    return this.bookService.findBooksByQuery(query);
  }

  @Get('books_with_contents')
  findBooksWithContents() {
    return this.bookService.findBooksWithContents();
  }

  //DELETE
  @Delete('delete/:isbn_ten')
  @UsePipes(ValidationPipe)
  deleteBook(@Param('isbn_ten') isbn_ten: string) {
    return this.bookService.deleteBook(isbn_ten);
  }

  //POST
  @Post('create')
  @UsePipes(ValidationPipe)
  createBooks(@Body() createBookDto: CreateBookDto) {
    return this.bookService.createBook(createBookDto);
  }

  //Update
  @Post('update/:isbn_ten')
  @UsePipes(ValidationPipe)
  updateBook(@Param('isbn_ten') isbn_ten: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.updateBook(isbn_ten, updateBookDto);
  }

}
