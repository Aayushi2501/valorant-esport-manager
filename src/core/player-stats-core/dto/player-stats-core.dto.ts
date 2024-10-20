import { ApiProperty } from '@nestjs/swagger';
import { PlayerStats } from '@prisma/client';
import { IsArray } from 'class-validator';
import { CorePaginateDto } from 'src/core/base-query-core/dto/base-query-core.dto';

export class PlayerStatsCorePaginateDto extends CorePaginateDto {
  @ApiProperty({ required: true })
  @IsArray()
  list?: PlayerStats[];

}