import { IDiscordServer } from './discord-server.interface';

/**
 * Discord channel response.
 */
export interface IDiscordChannelResponse {
  /**
   * Discord channel ID.
   */
  id: string;

  /**
   * Last saved beatmap ID.
   */
  beatmapId: number;

  /**
   * Nested discord server data.
   */
  server: IDiscordServer | null;
}
