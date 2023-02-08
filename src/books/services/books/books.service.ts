import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/typeorm/book.entity';
import { Repository } from 'typeorm';
import { CreateBookDto } from 'src/books/dtos/CreateBook.dto';
import { UpdateBookDto } from 'src/books/dtos/UpdateBook.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
  ) { }

  // CREATE
  createBook(createBookDto: CreateBookDto) {
    const newBook = this.bookRepository.create(createBookDto);
    return this.bookRepository.save(newBook);
  }

  // READ
  getBooks() {
    return this.bookRepository.find();
  }

  findBooksByTitle(title: string) {
    return this.bookRepository.findOne({ where: { title: title } });
  }

  // UPDATE
  updateBook(bid: number, updateBookDto: UpdateBookDto) {
    return this.bookRepository.update(bid, updateBookDto);
  }

  // DELETE
  async deleteBook(bid: number): Promise<void> {
    await this.bookRepository.delete(bid);
  }
}
