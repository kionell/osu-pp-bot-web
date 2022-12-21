import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';

import {
  APIClient,
  APIFactory,
  IHasBeatmaps,
  IHasLeaderboard,
  IHasRecent,
  IHasScores,
  IHasTop,
  IHasUsers,
  IBeatmapRequestOptions,
  ILeaderboardRequestOptions,
  IScoreListRequestOptions,
  IScoreRequestOptions,
  IUserRequestOptions,
  Server,
  URLGenerator,
  URLScanner,
} from '@kionell/osu-api';

@Injectable()
export class ApiService implements OnModuleInit {
  /**
   * Adds API credentials to all clients.
   */
  onModuleInit(): void {
    APIFactory.addCredentials('Bancho',
      process.env.OSU_CLIENT_ID as string,
      process.env.OSU_CLIENT_SECRET as string,
    );
  }

  /**
   * Creates a new instance of URL generator for a specific server.
   * @param server Server name.
   * @returns URL generator.
   */
  createURLGenerator(server?: keyof typeof Server): URLGenerator {
    return APIFactory.createURLGenerator(server);
  }

  /**
   * Creates a new instance of URL scanner for a specific server.
   * @param server Server name.
   * @returns URL scanner.
   */
  createURLScanner(server?: keyof typeof Server): URLScanner {
    return APIFactory.createURLScanner(server);
  }

  /**
   * Performs a request to the API to get a beatmap information.
   * @param server Server name.
   * @param options Beatmap request options.
   * @returns Beatmap information or null.
   */
  async getBeatmap(server?: keyof typeof Server, options?: IBeatmapRequestOptions): ReturnType<typeof api.getBeatmap> {
    const api = APIFactory.getAPIClient(server) as APIClient & IHasBeatmaps;

    if (!api.getBeatmap) {
      throw new BadRequestException('This server does not provide any API for getting beatmaps!');
    }

    return api.getBeatmap(options);
  }

  /**
   * Performs a request to the API to get scores on a beatmap.
   * If user was specified then returns all user's scores on the beatmap.
   * Otherwise will return beatmap leaderboard scores.
   * @param server Server name.
   * @param options Beatmap score request options.
   * @returns The list of scores on the beatmap.
   */
  getLeaderboard(server?: keyof typeof Server, options?: ILeaderboardRequestOptions): ReturnType<typeof api.getLeaderboard> {
    const api = APIFactory.getAPIClient(server) as APIClient & IHasLeaderboard;

    if (!api.getLeaderboard) {
      throw new BadRequestException('This server does not provide any API for getting beatmap scores!');
    }

    return api.getLeaderboard(options);
  }

  /**
   * Performs a request to the API to get user recent scores.
   * @param server Server name.
   * @param options Score request options.
   * @returns The list of user's recent scores.
   */
  getUserRecent(server?: keyof typeof Server, options?: IScoreListRequestOptions): ReturnType<typeof api.getUserRecent> {
    const api = APIFactory.getAPIClient(server) as APIClient & IHasRecent;

    if (!api.getUserRecent) {
      throw new BadRequestException('This server does not provide any API for getting user recent scores!');
    }

    return api.getUserRecent(options);
  }

  /**
   * Performs a request to the API to get a score information.
   * @param server Server name.
   * @param options Score request options.
   * @returns Score information or null.
   */
  getScore(server?: keyof typeof Server, options?: IScoreRequestOptions): ReturnType<typeof api.getScore> {
    const api = APIFactory.getAPIClient(server) as APIClient & IHasScores;

    if (!api.getScore) {
      throw new BadRequestException('This server does not provide any API for getting scores!');
    }

    return api.getScore(options);
  }

  /**
   * Performs a request to the API to get user's best scores.
   * @param server Server name.
   * @param options Score request options.
   * @returns The list of user's best scores.
   */
  getUserBest(server?: keyof typeof Server, options?: IScoreListRequestOptions): ReturnType<typeof api.getUserBest> {
    const api = APIFactory.getAPIClient(server) as APIClient & IHasTop;

    if (!api.getUserBest) {
      throw new BadRequestException('This server does not provide any API for getting user best scores!');
    }

    return api.getUserBest(options);
  }

  /**
   * Performs a request to the API to get user info.
   * @param server Server name.
   * @param options User request options.
   * @returns User information or null.
   */
  getUser(server?: keyof typeof Server, options?: IUserRequestOptions): ReturnType<typeof api.getUser> {
    const api = APIFactory.getAPIClient(server) as APIClient & IHasUsers;

    if (!api.getUser) {
      throw new BadRequestException('This server does not provide any API for getting users!');
    }

    return api.getUser(options);
  }
}
