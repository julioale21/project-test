import { PipeTransform } from "@nestjs/common";

const TRANSLATION_ID = /^[A-Za-z0-9_-]{1,32}$/;

export class ParseTranslationIdPipe implements PipeTransform<string,string> {
    transform(value: string): string {
        if(!TRANSLATION_ID.test(value)) {
            throw new Error(`Invalid translation id: ${value}`);
        }
        return value;
    }
}
