import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Language } from '../../../books/entities/books.entity';

@Injectable()
export class LanguageValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const languageValue = value.language;
    const supportedLangues = [Language.FRENCH, Language.ENGLISH, Language.ENGLISH];
    if(!supportedLangues.includes(languageValue)){
      throw new BadRequestException('Unsupported language')
    }
    return value;
  }
}
