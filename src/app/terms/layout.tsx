import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of service — Orazaka" };

export default function TermsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
