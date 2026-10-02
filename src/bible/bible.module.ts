import { Module } from '@nestjs/common';
import { TranslationsController } from './controllers/translations.controller';
import { TranslationsService } from './services/translations.service';
import { BibleApiModule } from '../bible-api/bible-api.module';
import { BooksController } from './controllers/books.controller';
import { BooksService } from './services/books.service';
import { ChaptersController } from './controller/chapters.controller';
import { ChaptersService } from './services/chapters.service';

@Module({
    imports: [BibleApiModule],
    controllers: [TranslationsController, BooksController, ChaptersController],
    providers: [TranslationsService, BooksService, ChaptersService],
})
export class BibleModule {}
