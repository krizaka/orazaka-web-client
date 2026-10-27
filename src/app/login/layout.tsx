import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sign in — Orazaka" };

export default function LoginLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
