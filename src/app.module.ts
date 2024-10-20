import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayerStatsModule } from './modules/player-stats/player-stats.module';
import { ConfigModule } from '@nestjs/config';
import configuration from 'config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [configuration],
      cache: true,
      isGlobal: true,
    }),
    PlayerStatsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
