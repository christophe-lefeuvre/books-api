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
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { GetBookFilterDto } from './dto/get-book-filter.dto';
import { LanguageValidationPipe } from '../common/pipes/language-validation/language-validation.pipe';

@Controller('books')
// @UsePipes(ValidationPipe)
export class BooksController {
    constructor(private readonly booksService: BooksService) {}

    @Delete(':id')
    deleteBook(@Param('id', ParseIntPipe) id: number) {
        return this.booksService.deleteBook(id);
    }
    @Get()
    findAll(@Query() filterDto: GetBookFilterDto){
        return this.booksService.findBooks(filterDto);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.booksService.findBookById(id);
    }
    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateBookDto) {
        return this.booksService.updateBook(id, body);
    }
    @Post()
    @UsePipes(LanguageValidationPipe)
    create(@Body() body: CreateBookDto){
        return this.booksService.createBook(body)
    }
}
