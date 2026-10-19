/** The values the console compares statuses with (one place, never a literal at the comparison). */
export const VERSION_STATUS = { DRAFT: "DRAFT", PUBLISHED: "PUBLISHED" } as const;
export const STATE_ACTION = { suspend: "suspend", restore: "restore" } as const;
export const ROLE_ACTION = { grant: "grant", withdraw: "withdraw" } as const;
