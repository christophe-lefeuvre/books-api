import { Injectable, NotFoundException } from '@nestjs/common';
import { Book, Language } from './entities/books.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { GetBookFilterDto } from './dto/get-book-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import PostgreSQLErrorCode from 'src/postgresql-error-codes';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BooksService {
    constructor(
        @InjectRepository(Book) private bookRepository: Repository<Book>,
        configService: ConfigService,
    ) {
        console.log(configService.get('MY_SECRET'),'====> LOAD MY_SECRET')
    }

    async createBook(createBookDto: CreateBookDto) {
        const book = this.bookRepository.create({
            ...createBookDto,
            author: {
                id: createBookDto.authorId
            }
        })
        try {
            return await this.bookRepository.save(book)
        } catch (error) {
            if (error.code === PostgreSQLErrorCode.ForeignKeyViolation) {
                throw new NotFoundException(`Author with id ${createBookDto.authorId} doesn't exist`)
            }
            throw error
        }
    }

    async updateBook(bookId: number, updatedBook: UpdateBookDto) {
        try{
            const book = await this.bookRepository.preload({
                id: bookId,
                ...updatedBook,
                ...(updatedBook.authorId ? { author: {id: updatedBook.authorId}} : {})
            })
            if (!book) {
                throw new NotFoundException(`Book with id ${bookId} not found`)
            }
            return this.bookRepository.save(book);
        } catch (error) {
            if (error.code === PostgreSQLErrorCode.ForeignKeyViolation) {
                throw new NotFoundException(`Author with id ${updatedBook.authorId} doesn't exist`)
            }
            throw error
        }
    }

    async findBookById(bookId: number) {
        const book = await this.bookRepository.findOneBy({id: bookId})
        if (!book) {
            throw new NotFoundException(`Book with id ${bookId} not found`)
        }
        return book;
    }

    async findBooks(filterDto: GetBookFilterDto) {
        const {
            author,
            language,
            publication_date,
            search,
        } = filterDto;
        const query = this.bookRepository.createQueryBuilder('book').leftJoinAndSelect('book.author', 'author');

        if(author) {
            query.andWhere('book.author iLIKE :author', {author: `%${author}%`});
        }

        if (search) {
            query.andWhere('(book.title iLIKE :search OR book.author iLIKE :search)', {search: `%${search}%`});
        }

        if(publication_date) {
            query.andWhere('book.publicationDate = :publication_date', {publication_date});
        }

        if(language) {
            query.andWhere('book.language = :language', {language});
        }
        const books = await query.getMany()

        return books;
    }

    async deleteBook(bookId: number) {
        const book = await this.bookRepository.findOneBy({id: bookId});
        if (!book) {
            throw new NotFoundException(`Book with id ${bookId} not found`)
        }
        return this.bookRepository.remove(book);
    }
}
