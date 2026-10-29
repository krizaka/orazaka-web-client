import { NextResponse } from "next/server";
import { readDownloads } from "@/core/config/downloads";
import { loadDesktopRelease } from "@/features/landing/utils/release";

export const dynamic = "force-dynamic";

const notFound = () => new NextResponse(null, { status: 404, headers: { "Cache-Control": "no-store" } });

/** `/desktop/download` — the one address of the Mac file. 404 while `APP_DOWNLOADS_MAC_ENABLED` is off; otherwise a redirect to the release's .dmg. */
export async function GET() {
  if (!readDownloads().macEnabled) {
    return notFound();
  }
  const release = await loadDesktopRelease();
  if (!release) {
    return notFound();
  }
  return NextResponse.redirect(release.dmg.url, 307);
}
