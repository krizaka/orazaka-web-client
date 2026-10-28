"use client";

import { LegalPage } from "@/features/landing/components/LegalPage";
import { TERMS_CONTENT } from "@/features/landing/legal-content";

export default function TermsPage() {
  return <LegalPage content={TERMS_CONTENT} />;
}
