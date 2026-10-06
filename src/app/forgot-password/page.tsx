"use client";

import * as React from "react";
import Link from "next/link";
import { Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle, Icon } from "@krizaka/orazaka-design-system";
import { Button } from "@krizaka/orazaka-design-system";
import { useAuth } from "@/core/hooks/useAuth";
import { useTranslation } from "@/core/context/LocaleContext";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/features/auth/components/AuthLayout";

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
        <Card className="w-full max-w-md p-0 glass-card">
          <CardHeader className="space-y-1 text-center pb-2">
            <CardTitle className="text-2xl font-bold tracking-tight">
              {t.auth.forgotTitle || "Reset Your Password"}
            </CardTitle>
            <CardDescription className="text-[var(--text-secondary)]">
              {t.auth.forgotSubtitle ||
                "Enter your email and we'll send you a reset link."}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <div
                role="alert"
                className="rounded-lg bg-status-error/5 border border-status-error/10 px-3 py-2 text-sm text-status-error"
              >
                {error}
              </div>
            )}

            {success ? (
              <output
                className="block rounded-lg bg-status-success/5 border border-status-success/10 px-4 py-4 space-y-2"
              >
                <p className="text-sm font-medium text-status-success">
                  {t.auth.forgotSuccess ||
                    "Check your email for a password reset link."}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">
                  {t.auth.forgotSuccessDetail ||
                    "If you don't see it, check your spam folder."}
                </p>
              </output>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="forgot-email"
                    className="text-sm font-medium text-[var(--text-primary)]"
                  >
                    {t.auth.emailLabel || "Email"}
                  </label>
                  <div className="relative">
                    <Icon name="mail" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                    <input
                      id="forgot-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-[var(--radius-md)] bg-[var(--surface-2)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] transition-all duration-200"
                    />
                  </div>
                </div>
                <Button
                  id="btn-forgot-submit"
                  type="submit"
                  disabled={isSubmitting || !email.trim()}
                  className="w-full h-10 rounded-[var(--radius-md)] font-medium text-sm bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Icon name="loader" className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  {t.auth.forgotSubmit || "Send Reset Link"}
                </Button>
              </form>
            )}
          </CardContent>

          <CardFooter className="justify-center pb-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-150"
            >
              <Icon name="arrowLeft" className="h-3 w-3" />
              {t.auth.backToLogin || "Back to Login"}
            </Link>
          </CardFooter>
        </Card>
    </AuthLayout>
  );
}
