"use client";

import * as React from "react";
import Link from "next/link";
import { Icon } from "@krizaka/orazaka-design-system";
import { Button } from "@krizaka/orazaka-design-system";
import { useAuth } from "@/core/hooks/useAuth";
import { useTranslation } from "@/core/context/LocaleContext";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/features/auth/components/AuthLayout";

import { Card } from "@krizaka/ui/card";

/**
 * ForgotPasswordPage — split layout with marketing hero (left) and
 * email reset form (right). Calls POST /api/v1/auth/forgot.
 */
export default function ForgotPasswordPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  const [email, setEmail] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState(false);

  React.useEffect(() => {
    if (isAuthenticated) router.push("/");
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/v1/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.text();
        setError(data || t.auth.forgotError || "Failed to send reset email.");
      }
    } catch {
      setError(t.auth.forgotError || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <Card.Root className="w-full max-w-md p-0 glass-card">
        <Card.Body padding="lg" className="gap-1.5 space-y-1 text-center pb-2">
          <Card.Title className="line-clamp-none group-hover:text-fg text-2xl font-bold tracking-tight">
            {t.auth.forgotTitle || "Reset Your Password"}
          </Card.Title>
          <Card.Description className="line-clamp-none text-sm text-fg-secondary">
            {t.auth.forgotSubtitle ||
              "Enter your email and we'll send you a reset link."}
          </Card.Description>
        </Card.Body>

        <Card.Body padding="lg" className="block pt-0 space-y-4">
          {error && (
            <div
              role="alert"
              className="rounded-lg bg-danger/5 border border-danger/10 px-3 py-2 text-sm text-danger"
            >
              {error}
            </div>
          )}

          {success ? (
            <output
              className="block rounded-lg bg-success/5 border border-success/10 px-4 py-4 space-y-2"
            >
              <p className="text-sm font-medium text-success">
                {t.auth.forgotSuccess ||
                  "Check your email for a password reset link."}
              </p>
              <p className="text-xs text-fg-secondary">
                {t.auth.forgotSuccessDetail ||
                  "If you don't see it, check your spam folder."}
              </p>
            </output>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="forgot-email"
                  className="text-sm font-medium text-fg"
                >
                  {t.auth.emailLabel || "Email"}
                </label>
                <div className="relative">
                  <Icon name="mail" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-muted" />
                  <input
                    id="forgot-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-md bg-surface-2 border border-border-default text-sm text-fg placeholder:text-fg-muted focus:border-accent focus:ring-2 focus:ring-accent-soft transition-all duration-200"
                  />
                </div>
              </div>
              <Button
                id="btn-forgot-submit"
                type="submit"
                disabled={isSubmitting || !email.trim()}
                className="w-full h-10 rounded-md font-medium text-sm bg-accent hover:bg-accent-hover text-on-accent transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Icon name="loader" className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {t.auth.forgotSubmit || "Send Reset Link"}
              </Button>
            </form>
          )}
        </Card.Body>

        <Card.Footer className="px-6 text-sm justify-center pb-4">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-fg-muted hover:text-accent transition-colors duration-150"
          >
            <Icon name="arrowLeft" className="h-3 w-3" />
            {t.auth.backToLogin || "Back to Login"}
          </Link>
        </Card.Footer>
      </Card.Root>
    </AuthLayout>
  );
}
