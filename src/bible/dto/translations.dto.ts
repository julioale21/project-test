export interface TranslationDto {
    id: string;
    name: string;
    shortName?: string;
    language: string;
    languageName?: string;
    direction: 'ltr' | 'rtl';
    totalBooks: number;
    license: { url: string; website: string };
    isDefault: boolean;
}
