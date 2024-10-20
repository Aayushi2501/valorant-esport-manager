import { Module } from '@nestjs/common';
import { PlayerStatsModule } from './modules/player-stats/player-stats.module';
import { ConfigModule } from '@nestjs/config';
import configuration from 'config/configuration';
import { PrismaService } from './shared/modules/prisma/prisma.service';

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
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
