import { DiscordServerDto } from './discord-server.dto';

/**
 * Discord channel data.
 */
export class DiscordChannelDto {
  /**
   * Discord channel ID.
   */
  id: string | number;

  /**
   * Last saved beatmap ID.
   */
  beatmapId: number;

  /**
   * Nested discord server data.
   */
  server?: DiscordServerDto | null;
}
