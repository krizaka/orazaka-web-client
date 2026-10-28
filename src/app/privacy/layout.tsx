import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy policy — Orazaka" };

export default function PrivacyLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
