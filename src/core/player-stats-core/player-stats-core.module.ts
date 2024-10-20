import { Module } from '@nestjs/common';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import { PlayerStatsCoreService } from './player-stats-core.service';

@Module({
  providers: [PrismaService, PlayerStatsCoreService],
  exports: [PlayerStatsCoreService, PrismaService],
})
export class PlayerStatsCoreModule {}