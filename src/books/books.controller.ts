import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from 'src/books/dto/create-book.dto';
import { UpdateBookDto } from 'src/books/dto/update-book.dto';
import { GetBookFilterDto } from 'src/books/dto/get-book-filter.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Role } from 'src/auth/entities/user.entity';
import { AccessControlGuard } from 'src/guards/access-control.guard';
import { Roles } from '../decorator/roles.decorator';

@UseGuards(AuthGuard, AccessControlGuard)
@Controller('books')
export class BooksController {
  private readonly logger = new Logger(BooksController.name);

  constructor(private readonly bookService: BooksService) {}

  @Get()
  findAll(@Query() filterDto: GetBookFilterDto) {
    this.logger.log(
      `Fetching all books with filters: ${JSON.stringify(filterDto)}`,
    );
    return this.bookService.findBooks(filterDto);
  }

  @Post()
  @Roles(Role.Admin)
  create(@Body() body: CreateBookDto) {
    this.logger.log(`Creating a new book: ${JSON.stringify(body)}`);
    return this.bookService.createBook(body);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(`Fetching book with ID: ${id}`);
    return this.bookService.findBookById(id);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  update(@Param('id') id: number, @Body() body: UpdateBookDto) {
    this.logger.log(`Updating book with ID: ${id}`);
    const book = this.bookService.updateBook(+id, body);
    return book;
  }

  @Delete(':id')
  @Roles(Role.Admin)
  delete(@Param('id') id: string) {
    this.logger.log(`Deleting book with ID: ${id}`);
    return this.bookService.deleteBook(+id);
  }
}
