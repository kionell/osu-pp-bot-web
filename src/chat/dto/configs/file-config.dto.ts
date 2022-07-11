/**
 * File config data that will be used for channel or server.
 * Channel configs have more priority over server configs.
 */
export class FileConfigDto {
  /**
   * Should beatmap URLs be parsed or not?
   */
  parseBeatmap?: boolean | null;

  /**
   * Should score URLs be parsed or not?
   */
  parseReplay?: boolean | null;
}
