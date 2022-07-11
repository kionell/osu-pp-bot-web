/**
 * URL config data that will be used for channel or server.
 * Channel configs have more priority over server configs.
 */
export class URLConfigDto {
  /**
   * Should beatmap URLs be parsed or not?
   */
  parseBeatmap?: boolean | null;

  /**
   * Should score URLs be parsed or not?
   */
  parseScore?: boolean | null;

  /**
   * Should user URLs be parsed or not?
   */
  parseUser?: boolean | null;
}
