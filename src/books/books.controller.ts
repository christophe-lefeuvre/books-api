import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { GetBookFilterDto } from './dto/get-book-filter.dto';
import { LanguageValidationPipe } from '../common/pipes/language-validation/language-validation.pipe';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../decorator/current-user.decorator';
import { Role } from '../auth/entities/user.entity';
import { Roles } from '../decorator/roles.decorator';
import { AccessControlGuard } from '../guards/access-control.guard';

@Controller('books')
@UseGuards(AuthGuard, AccessControlGuard)
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Delete(':id')
  @Roles(Role.Admin)
  deleteBook(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.deleteBook(id);
  }

  @Get()
  @Roles(Role.Admin, Role.Viewer)
  findAll(
    @Query() filterDto: GetBookFilterDto,
    @CurrentUser('email') userInfo,
  ) {
    return this.booksService.findBooks(filterDto);
  }

  @Get(':id')
  @Roles(Role.Admin, Role.Viewer)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.findBookById(id);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateBookDto) {
    return this.booksService.updateBook(id, body);
  }

  @Post()
  @UsePipes(LanguageValidationPipe)
  @Roles(Role.Admin)
  create(@Body() body: CreateBookDto) {
    return this.booksService.createBook(body);
  }
}
