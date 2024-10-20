import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseQueryCoreDto, CoreIncludesDto } from 'src/core/base-query-core/dto/base-query-core.dto';
import { PlayerStatsService } from './player-stats.service';
import { BuidTeamsWithIdsAndPrompts, PromptDto, PromptDtoWithId } from './dto/prompt.dto';



@ApiTags('Player-satsts')
@Controller('player')
export class PlayerStatsController {
  constructor(private readonly playerStatsService: PlayerStatsService) {}

  @Get()
  @ApiOperation({ summary: 'Add your prompt here' })
  getAllContent(
    @Query() promptDto:PromptDto,
  ) {
    return this.playerStatsService.invokePrompWithModel({promptDto});
  }

  @Get('state')
  @ApiOperation({ summary: 'Get all player state' })
  getAllPlayerState(
    @Query() baseQueryCoreDto: BaseQueryCoreDto,
  ) {
    return this.playerStatsService.getAllPlayerSatate({baseQueryCoreDto});
  }

  @Get('state-by-id')
  @ApiOperation({ summary: 'Get player state id and prompt' })
  getAllPlayerStateById(
    @Query() promptDtoWithId:PromptDtoWithId
  ) {
    return this.playerStatsService.getPlayerByIdAndWithPrompt({promptDtoWithId});
  }

  @Get('teams')
  @ApiOperation({ summary: 'Build best team' })
  buildingTeams(
    @Query() buidTeamsWithIdsAndPrompts:BuidTeamsWithIdsAndPrompts
  ) {
    return this.playerStatsService.buidingTeam({buidTeamsWithIdsAndPrompts});
  }
}