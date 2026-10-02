import type { ApiTranslation } from 'free-use-bible-api';
import { TranslationDto } from '../dto/translations.dto';

export function toTranslationDto(
  translation: ApiTranslation,
  isDefault: boolean,
): TranslationDto {
  return {
    id: translation.id,
    name: translation.name,
    shortName: translation.shortName,
    language: translation.language,
    languageName: translation.languageName,
    direction: translation.textDirection,
    totalBooks: translation.numberOfBooks,
    license: { url: translation.licenseUrl, website: translation.website },
    isDefault,
  };
}
