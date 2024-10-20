import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { BedrockService } from 'src/shared/bedrock-integartion/bedrock-integration';
import { BuidTeamsWithIdsAndPrompts, PromptDto, PromptDtoWithId } from './dto/prompt.dto';
import { BaseQueryCoreDto } from 'src/core/base-query-core/dto/base-query-core.dto';
import { PlayerStatsCoreService } from 'src/core/player-stats-core/player-stats-core.service';

@Injectable()
export class PlayerStatsService {
    constructor(
        private bedrockService: BedrockService,
        private playerStatsCoreService: PlayerStatsCoreService
    ) { }



    async invokePrompWithModel(params: {
        promptDto: PromptDto;
    }) {
        const { promptDto } = params;

        const response = await this.bedrockService.invokeModelRunTimeCommand(promptDto.prompt);

        return response;

    }


    async getAllPlayerSatate(params: {
        baseQueryCoreDto: BaseQueryCoreDto,
    }) {

        const { baseQueryCoreDto } = params;

        return await this.playerStatsCoreService.findPaginate(baseQueryCoreDto)
    }


    async getPlayerByIdAndWithPrompt(params: {
        promptDtoWithId: PromptDtoWithId;
    }) {
        const { promptDtoWithId } = params;

        const playerData = await this.playerStatsCoreService.findUnique({
            where: {
                id: parseInt(promptDtoWithId.id)
            }
        });

        const cleanPlayerName = playerData.playerName.replace(/\s+/g, ' ').trim();

        const agentsArray: string[] = playerData.agents as string[];

        if (promptDtoWithId.prompt) {

            const prompt = `
        I have a player data record with the following details:
        - Player Name: ${cleanPlayerName}
        - Organization: ${playerData.org}
        - Agents Played: ${agentsArray.join(', ')}
        - Rounds Played: ${playerData.roundsPlayed}
        - Rating: ${playerData.rating}
        - Average Combat Score: ${playerData.averageCombatScore}
        - Kill/Death Ratio: ${playerData.killDeaths}
        - Kill/Assists/Survived/Traded: ${playerData.killAssistsSurvivedTraded}
        - Average Damage Per Round: ${playerData.averageDamagePerRound}
        - Kills Per Round: ${playerData.killsPerRound}
        - Assists Per Round: ${playerData.assistsPerRound}
        - First Kills Per Round: ${playerData.firstKillsPerRound}
        - First Deaths Per Round: ${playerData.firstDeathsPerRound}
        - Headshot Percentage: ${playerData.headshotPercentage}
        - Clutch Success Percentage: ${playerData.clutchSuccessPercentage}
        - Created At: ${new Date(playerData.createdAt).toLocaleString()}
        Please summarize this player's performance or provide insights based on these statistics.
        ${promptDtoWithId.prompt}`;


            const response = await this.bedrockService.invokeModelRunTimeCommand(prompt);

            return response;
        } else {

            return playerData;
        }

    }


    async buidingTeam(params: {
        buidTeamsWithIdsAndPrompts: BuidTeamsWithIdsAndPrompts;
    }
    ) {

        const { buidTeamsWithIdsAndPrompts } = params;

        const idsArray: number[] = buidTeamsWithIdsAndPrompts.ids.map(item => parseInt(item));

        const playerData = await this.playerStatsCoreService.findMany({
            where: {
                id: {
                    in: idsArray
                }
            }
        });

        const metrics = ['playerName', 'rating', 'killDeaths', 'agents', 'clutchSuccessPercentage']

        const summary = await this.summarizePlayers(playerData, metrics);

        const playerSummaries = summary.map(player => {
            return `${player.playerName} (rating: ${player.rating}, agents: ${player.agents.join(', ')}, killDeaths: ${player.killDeaths}, clutchSuccessPercentage:${player.clutchSuccessPercentage})`;
          }).join('\n');

        const prompt = `
        I have data on multiple players with details like rating, agents they play, kills per round, assists per round, and clutch success percentage.
        I want you to build best teams
        Here are some player summaries:
        ${playerSummaries}
        ${buidTeamsWithIdsAndPrompts.prompt}`;

        const response = await this.bedrockService.invokeModelRunTimeCommand(prompt);

        return response;
    }







    async cleanPlayerName(name: string): Promise<string> {
        return name.replace(/\s+/g, ' ').trim();
    };

    formatAgentsArray(agents: unknown): string[] {
        return Array.isArray(agents) ? (agents as string[]) : [];
    };

    async summarizePlayers(players: any[], metrics: any[]): Promise<any[]> {
        const summaries: any[] = []; // Array to hold all summaries

        for (const player of players) {
            const summary: any = {};

            for (const metric of metrics) {
                if (metric === 'playerName') {
                    summary[metric] = await this.cleanPlayerName(player.playerName);
                } else if (metric === 'agents') {
                    summary[metric] = await this.formatAgentsArray(player.agents);
                } else {
                    summary[metric] = player[metric];
                }
            }

            summaries.push(summary); // Add the summary for this player to the array
        }

        return summaries; // Return the array of summaries
    }

    //   async summarizePlayers (players: PlayerData[], metrics: SummaryMetric[]): Promise<any[]> {
    //     return players.map(player => {
    //       const summary: any = {};

    //       metrics.forEach(metric => {
    //         switch (metric) {
    //           case 'playerName':
    //             summary.playerName = this.cleanPlayerName(player.playerName);
    //             break;
    //           case 'rating':
    //             summary.rating = player.rating;
    //             break;
    //           case 'killDeaths':
    //             summary.killDeaths = player.killDeaths;
    //             break;
    //           case 'agents':
    //             summary.agents = this.formatAgentsArray(player.agents).join(', ');
    //             break;
    //           default:
    //             break;
    //         }
    //       });

    //       return summary;
    //     });
    //   };

}