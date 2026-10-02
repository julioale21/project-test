import { IsOptional, IsString, Length } from 'class-validator';

export class TranslationsQueryDto {
  @IsOptional()
  @IsString()
  @Length(3, 3)
  lang?: string;
}
