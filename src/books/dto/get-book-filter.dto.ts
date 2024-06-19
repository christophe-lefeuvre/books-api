import { Language } from '../entities/books.entity';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class GetBookFilterDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  author?: string;

  @IsDateString()
  @IsOptional()
  publication_date?: string;

  @IsEnum(Language)
  @IsOptional()
  language?: Language;
}
