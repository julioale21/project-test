import { ApiTranslationBook } from "free-use-bible-api";
import { BookDto, Testament } from "../dto/book.dto";

const LAST_OLD_TESTAMENT_BOOK_ORDER = 39;

export function toTestament(order: number): Testament {
    return order <= LAST_OLD_TESTAMENT_BOOK_ORDER ? 'old' : 'new';
}

export function toBookDto(book: ApiTranslationBook): BookDto {
    return {
        id: book.id,
        name: book.name,
        order: book.order,
        chapters: book.numberOfChapters,
        testament: toTestament(book.order),
    };
}
