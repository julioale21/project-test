import { Controller, Get, Param, Query } from '@nestjs/common';
import { TranslationsService } from '../services/translations.service';
import { TranslationsQueryDto } from '../dto/translations-query.dto';
import { TranslationDto } from '../dto/translations.dto';
import { ParseTranslationIdPipe } from '../pipes/parse-translation-id.pipe';

@Controller('translations')
export class TranslationsController {
  constructor(private readonly translationsService: TranslationsService) {}

  @Get()
  async findAll(
    @Query() query: TranslationsQueryDto,
  ): Promise<TranslationDto[]> {
    return this.translationsService.findAll(query.lang);
  }

  @Get(':translationId')
  async findOne(
    @Param('translationId', ParseTranslationIdPipe) translationId: string,
  ): Promise<TranslationDto> {
    return this.translationsService.findOne(translationId);
  }
}
