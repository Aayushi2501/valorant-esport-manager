import { Module } from '@nestjs/common';
import { PlayerStatsController } from './player-stats.controller';
import { PlayerStatsService } from './player-stats.service';
import { BedrockService } from 'src/shared/bedrock-integartion/bedrock-integration';
import { PlayerStatsCoreModule } from 'src/core/player-stats-core/player-stats-core.module';


@Module({
  imports: [
    PlayerStatsCoreModule
  ],
  controllers: [PlayerStatsController],
  providers: [PlayerStatsService, BedrockService],
  exports: [PlayerStatsService],
})
export class PlayerStatsModule {}