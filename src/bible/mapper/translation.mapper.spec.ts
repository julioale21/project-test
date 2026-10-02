import { availableTranslations } from '../../../test/fixtures';
import { toTranslationDto } from './translation.mapper';

describe('toTranslationDto', () => {
  const r09 = availableTranslations().translations.find(
    (t) => t.id === 'spa_r09',
  )!;

  it('maps the API translation to the public DTO', () => {
    expect(toTranslationDto(r09, true)).toEqual({
      id: 'spa_r09',
      name: 'Santa Biblia — Reina Valera 1909',
      shortName: 'R09',
      language: 'spa',
      languageName: 'español',
      direction: 'ltr',
      totalBooks: 66,
      license: {
        url: 'https://ebible.org/Scriptures/details.php?id=spaRV1909',
        website: 'https://ebible.org/Scriptures/details.php?id=spaRV1909',
      },
      isDefault: true,
    });
  });

  it('passes isDefault through untouched', () => {
    expect(toTranslationDto(r09, false).isDefault).toBe(false);
  });

  it('does not leak API-only fields', () => {
    const dto = toTranslationDto(r09, false);

    expect(dto).not.toHaveProperty('sha256');
    expect(dto).not.toHaveProperty('listOfBooksApiLink');
    expect(dto).not.toHaveProperty('textDirection');
  });
});
