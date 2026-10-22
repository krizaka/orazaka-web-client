/** The vocabulary of the documentation's sections, shared by the site's words (translations) and its pages (features/docs). */

/** The reading path is `start` then `guides`; the `reference` is generated from the code and folded out of it. */
export const JOURNEY_IDS = ["start", "guides", "reference"] as const;
export type JourneyId = (typeof JOURNEY_IDS)[number];
export const FOLDED_JOURNEY: JourneyId = "reference";

export const GROUP_IDS = ["integrate", "platform", "policies"] as const;
export type GroupId = (typeof GROUP_IDS)[number];
