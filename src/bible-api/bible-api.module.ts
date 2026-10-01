import { Module } from '@nestjs/common';
import { BibleApiClient } from './bible-api.client';

@Module({
  providers: [BibleApiClient],
  exports: [BibleApiClient],
})
export class BibleApiModule {}
