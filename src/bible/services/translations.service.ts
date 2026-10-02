import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { ApiTranslation } from 'free-use-bible-api';
import { BibleApiClient } from '../../bible-api/bible-api.client';
import type { TranslationDto } from '../dto/translations.dto';
import { toTranslationDto } from '../mapper/translation.mapper';

@Injectable()
export class TranslationsService {
  private readonly supportedLanguages: string[];
  private readonly defaultTranslations: Record<string, string>;

  constructor(
    private readonly bibleApi: BibleApiClient,
    config: ConfigService,
  ) {
    this.supportedLanguages = config
      .getOrThrow<string>('SUPPORTED_LANGUAGES')
      .split(',')
      .map((lang) => lang.trim());

    this.defaultTranslations = Object.fromEntries(
      config
        .getOrThrow<string>('DEFAULT_TRANSLATIONS')
        .split(',')
        .map((pair) => pair.split(':').map((part) => part.trim())),
    );
  }

  isSupported(language: string): boolean {
    return this.supportedLanguages.includes(language);
  }

  async findAll(lang?: string): Promise<TranslationDto[]> {
    if (lang && !this.isSupported(lang)) {
      throw new BadRequestException(`Language ${lang} is not supported`);
    }

    const languages = lang ? [lang] : this.supportedLanguages;
    const { translations } = await this.bibleApi.getTranslations();

    return translations
      .filter((translation) => languages.includes(translation.language))
      .map((translation) =>
        toTranslationDto(translation, this.isDefault(translation)),
      );
  }

  async findOne(id: string): Promise<TranslationDto> {
    const { translations } = await this.bibleApi.getTranslations();
    const translation = translations.find((t) => t.id === id);
    if (!translation || !this.isSupported(translation.language)) {
      throw new NotFoundException(`Translation with id ${id} not found`);
    }
    return toTranslationDto(translation, this.isDefault(translation));
  }

  private isDefault(translation: ApiTranslation): boolean {
    return this.defaultTranslations[translation.language] === translation.id;
  }
}
