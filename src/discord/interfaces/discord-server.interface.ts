/**
 * Nested discord server object.
 */
export interface IDiscordServer {
  /**
   * Discord server ID.
   */
  id: string;

  /**
   * Custom prefix that will be used on this server.
   */
  prefix: string | null;
}
