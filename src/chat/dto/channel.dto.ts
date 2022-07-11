import { ServerDto } from './server.dto';

/**
 * Channel data.
 */
export class ChannelDto {
  /**
   * Channel ID.
   */
  id: string | number;

  /**
   * Last saved beatmap ID.
   */
  beatmapId: number;

  /**
   * Nested server data.
   */
  server?: ServerDto | null;
}
