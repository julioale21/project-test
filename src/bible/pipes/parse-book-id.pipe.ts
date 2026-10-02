import { BadRequestException, PipeTransform } from '@nestjs/common';

// USFM book codes: 3 characters, starting with a letter or 1-4 (1SA, 2KI, 3JN...)
const BOOK_ID = /^[1-4A-Z][A-Z0-9]{2}$/;

export class ParseBookIdPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    const bookId = value.toUpperCase();
    if (!BOOK_ID.test(bookId)) {
      throw new BadRequestException(`Invalid book id: ${value}`);
    }
    return bookId;
  }
}
