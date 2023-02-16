import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw } from 'typeorm';
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
    return this.bookRepository.insert(newBook);
  }

  // READ
  getBooks() {
    return this.bookRepository.find();
  }

  findBookByTitle(title: string) {
    return this.bookRepository.findOne({ where: { title: title } });
  }

  async findBooksByQuery(query: string) {
    return await this.bookRepository
      .find({
        where: [
          { title: Raw(title => `${title} ILIKE '%${query}%'`) },
          { authors: Raw(authors => `${authors} ILIKE '%${query}%'`) },
          { subtitle: Raw(subtitle => `${subtitle} ILIKE '%${query}%'`) },
        ],
      });
  }

  // UPDATE
  updateBook(isbn_ten: string, updateBookDto: UpdateBookDto) {
    return this.bookRepository.update(isbn_ten, updateBookDto);
  }

  // DELETE
  async deleteBook(isbn_ten: string): Promise<void> {
    await this.bookRepository.delete(isbn_ten);
  }
}