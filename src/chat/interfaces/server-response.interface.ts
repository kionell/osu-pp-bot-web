import { IChatConfigResponse } from './chat-config-response.interface';

/**
 * Nested server object.
 */
export interface IServerResponse {
  /**
   * Server ID.
   */
  id: string;

  /**
   * Channel config.
   */
  config: IChatConfigResponse;
}
