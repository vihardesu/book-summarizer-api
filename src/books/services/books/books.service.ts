import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Books } from 'src/typeorm';
import { Repository } from 'typeorm';
import { CreateBookDto } from 'src/books/dtos/CreateBook.dto';
import { UpdateBookDto } from 'src/books/dtos/UpdateBook.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Books) private readonly bookRepository: Repository<Books>,
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

  findBooksByName(name: string) {
    return this.bookRepository.findOne({ where: { name: name } });
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
