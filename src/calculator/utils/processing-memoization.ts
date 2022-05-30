/**
 * Mapping for the files that are currently being processed.
 */
export class ProcessingMemoization extends Map<string, Promise<any>> {
  /**
   * Adds a new element to the cache. Removes it after a certain time if needed.
   * @param taskId The key that will be used to identify this response.
   * @param promise The response value.
   * @returns Reference to this cache.
   */
  set(taskId: string, promise: Promise<any>): this {
    super.set(taskId, promise);

    /**
     * Delete promise 30 seconds after resolve or reject.
     */
    Promise.resolve(promise)
      .then(() => {
        setTimeout(() => super.delete(taskId), 30000);
      })
      .catch(() => {
        setTimeout(() => super.delete(taskId), 30000);
      });

    return this;
  }
}
