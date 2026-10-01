import { Injectable } from '@nestjs/common';
import { BibleApiClient } from '../../bible-api/bible-api.client';
import { ConfigService } from '@nestjs/config';
import { TranslationDto } from '../dto/translations.dto';
import { toTranslationDto } from '../mapper/translation.mapper';

@Injectable()
export class TranslationsService {
    private readonly supportedLanguages: string[];
    private readonly defaultTranslations: Record<string, string>;

    constructor(
        private readonly bibleApi: BibleApiClient,
        private readonly config: ConfigService,
    ) {

        this.supportedLanguages = config
            .getOrThrow<string>('SUPPORTED_LANGUAGES')
            .split(',')
            .map((lang) => lang.trim());

        this.defaultTranslations = Object.fromEntries(
            config.getOrThrow<string>('DEFAULT_TRANSLATIONS')
                .split(',')
                .map((pair) => pair.split(':').map((part) => part.trim())),
        );

    }

    async findAll(lang?: string): Promise<TranslationDto[]> {
        if (lang && !this.supportedLanguages.includes(lang)) {
            throw new Error(`Language ${lang} is not supported`);
        }

        const languages = lang ? [lang] : this.supportedLanguages;
        const { translations } = await this.bibleApi.getTranslations();

        return translations
            .filter((translation) => languages.includes(translation.language))
            .map((translation) => (
                toTranslationDto(
                    translation,
                    this.defaultTranslations[translation.language] === translation.id
                )
            ));
    }

    async findOne(id: string): Promise<TranslationDto> {
        const { translations } = await this.bibleApi.getTranslations();
        const translation = translations.find((t) => t.id === id);
        if (!translation) {
            throw new Error(`Translation with id ${id} not found`);
        }
        return toTranslationDto(translation, this.defaultTranslations[translation.language] === translation.id);
    }
}
