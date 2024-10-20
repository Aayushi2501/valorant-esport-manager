import { Injectable } from '@nestjs/common';
import { PlayerStats, Prisma } from '@prisma/client';
import { PlayerStatsMessages } from 'src/shared/keys/player-stats.keys';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import { PlayerStatsCorePaginateDto } from './dto/player-stats-core.dto';
import { PrismaBaseRepository } from 'src/shared/libs/prisma-base.repository';

@Injectable()
export class PlayerStatsCoreService extends PrismaBaseRepository<
  PlayerStats,
  PlayerStatsCorePaginateDto,
  Prisma.PlayerStatsCreateArgs,
  Prisma.PlayerStatsUpdateArgs,
  Prisma.PlayerStatsUpdateManyArgs,
  Prisma.PlayerStatsFindUniqueArgs,
  Prisma.PlayerStatsFindFirstArgs,
  Prisma.PlayerStatsFindManyArgs,
  Prisma.PlayerStatsDeleteArgs,
  Prisma.PlayerStatsDeleteManyArgs,
  Prisma.PlayerStatsCountArgs
> {
  constructor(private prismaService: PrismaService) {
    super(prismaService.prisma.playerStats, {
      NOT_FOUND: PlayerStatsMessages.NOT_FOUND,
      DELETED: PlayerStatsMessages.DELETED,
    });
  }
}