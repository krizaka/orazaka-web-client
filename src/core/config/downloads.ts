/**
 * @file downloads.ts
 * @description Whether the Mac build is handed out (bounded context APP_): `APP_DOWNLOADS_MAC_ENABLED`, off unless it is
 * exactly `true`. Off, the Download page shows a disabled button and « In testing — not distributed yet », carries no link
 * to the file, and `/desktop/download` answers 404. The switch is an environment value read on the server; moving it to
 * the admin's settings (DB) is a follow-up once the public site can read a public setting.
 */
export interface DownloadSwitches {
  macEnabled: boolean;
}

export function readDownloads(vars: Record<string, string | undefined> = process.env): DownloadSwitches {
  return { macEnabled: (vars.APP_DOWNLOADS_MAC_ENABLED ?? "").trim().toLowerCase() === "true" };
}
