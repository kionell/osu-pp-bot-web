/**
 * URL config data that will be used for channel or server.
 * Channel configs have more priority over server configs.
 */
export class IURLConfigResponse {
  /**
   * Should beatmap URLs be parsed or not?
   */
  parseBeatmap: boolean;

  /**
   * Should score URLs be parsed or not?
   */
  parseScore: boolean;

  /**
   * Should user URLs be parsed or not?
   */
  parseUser: boolean;
}
