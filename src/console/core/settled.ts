/** Helpers over `Promise.allSettled` results: the fulfilled value (or a fallback), and whether one was rejected. */
export const valueOr = <T, F>(result: PromiseSettledResult<T>, fallback: F): T | F => ("value" in result ? result.value : fallback);
export const rejected = (result: PromiseSettledResult<unknown>): boolean => "reason" in result;
