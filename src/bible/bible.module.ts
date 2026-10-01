import { Module } from '@nestjs/common';
import { TranslationsController } from './controllers/translations.controller';
import { TranslationsService } from './services/translations.service';
import { BibleApiModule } from '../bible-api/bible-api.module';
import { BooksController } from './controllers/books.controller';
import { BooksService } from './services/books.service';

@Module({
    imports: [BibleApiModule],
    controllers: [TranslationsController, BooksController],
    providers: [TranslationsService, BooksService],
})
export class BibleModule {}
