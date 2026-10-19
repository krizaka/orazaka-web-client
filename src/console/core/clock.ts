/** The console's clock: the wall time read from the performance timeline, passed to the pure functions as `now`. */
export const clockNow = (): Date => new Date(performance.timeOrigin + performance.now());
