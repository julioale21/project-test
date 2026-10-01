import { Injectable } from '@nestjs/common';
import { BibleApiClient } from './bible-api/bible-api.client';

@Injectable()
export class AppService {
  constructor(private readonly bibleApi: BibleApiClient) {}

  getHello(): string {
    return 'Hello World from my local machine!';
  }
}
