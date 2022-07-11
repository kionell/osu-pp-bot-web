/**
 * Nested server object.
 */
export interface IServerResponse {
  /**
   * Server ID.
   */
  id: string;

  /**
   * Custom prefix that will be used on this server.
   */
  prefix: string | null;
}
