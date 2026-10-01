import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BibleApiModule } from './bible-api/bible-api.module';
import { BibleModule } from './bible/bible.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BibleApiModule,
    BibleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
