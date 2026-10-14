"use client";

import { EyeIcon, EyeOffIcon } from "@krizaka/icons";
import { IconButton } from "@krizaka/ui/button";
import * as React from "react";
import Link from "next/link";
import { Input } from "@krizaka/orazaka-design-system";
import { Button } from "@krizaka/orazaka-design-system";
import { useTranslation } from "@/core/context/LocaleContext";
import { AuthLayout } from "@/features/auth/components/AuthLayout";

import { Card } from "@krizaka/ui/card";
import { cn } from "@krizaka/ui/cn";

// ─── Reusable field wrapper ─────────────────────────────────────────────────
const fieldLabelClass =
  "text-sm font-medium leading-none text-fg-secondary peer-disabled:cursor-not-allowed peer-disabled:opacity-70";

// ─── Components ────────────────────────────────────────────────────────────
interface LoginCardProps {
  /** Closed site: the real screen, every field and button disabled, nothing wired to the backend. */
  preview?: boolean;
  /** A calm banner above the form (the preview's). */
  notice?: React.ReactNode;
  error?: string;
  shakeError?: boolean;
  isLoading?: boolean;
  onSubmit?: (email: string, password: string) => void;
  onGithub?: () => void;
  onGoogle?: () => void;
}

/**
 * The sign-in screen itself — split layout with marketing hero (left) and credentials form (right). Pure view: the
 * connected `LoginForm` wires it to next-auth, `LoginPreview` shows it disabled while sign-in is closed.
 */
export function LoginCard({ preview = false, notice, error = "", shakeError = false, isLoading = false, onSubmit, onGithub, onGoogle }: Readonly<LoginCardProps>) {
  const { t } = useTranslation();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const off = preview;

  const handleLogin = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!off) onSubmit?.(email, password);
  };

  return (
    <AuthLayout>
      <Card.Root
        className={cn("w-full max-w-sm p-0 glass-card", shakeError ? "animate-shake" : "")}
      >
        <Card.Body padding="lg" className="gap-1.5 space-y-1 text-center pb-2">
          <Card.Title className="line-clamp-none group-hover:text-fg text-2xl font-bold tracking-tight">
            {t.auth.loginTitle}
          </Card.Title>
          <Card.Description className="line-clamp-none text-sm text-fg-secondary">
            {t.auth.loginSubtitle}
          </Card.Description>
        </Card.Body>

        <Card.Body padding="lg" className="block pt-0 space-y-4">
          {notice}
          {error && (
            <div
              role="alert"
              className="rounded-lg bg-danger/5 border border-danger/10 px-3 py-2 text-sm text-danger"
            >
              {error}
            </div>
          )}

          <form id="form-login" onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="login-email" className={fieldLabelClass}>
                {t.auth.emailLabel}
              </label>
              <Input
                id="login-email"
                type="email"
                placeholder="you@orazaka.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={off}
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="login-password" className={fieldLabelClass}>
                {t.auth.passwordLabel}
              </label>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={off}
                  autoComplete="current-password"
                  className="pr-10"
                />
                <IconButton
                  id="btn-toggle-password"
                  variant="ghost"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-0 top-1/2 -translate-y-1/2"
                  label={showPassword ? t.a11y.hidePassword : t.a11y.showPassword}
                  tabIndex={-1}
                  disabled={off}
                >
                  {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                </IconButton>
              </div>
              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-xs text-fg-muted hover:text-accent transition-colors duration-150"
                >
                  {t.auth.forgotPasswordLink || "Forgot password?"}
                </Link>
              </div>
            </div>
            <Button
              id="btn-login-submit"
              type="submit"
              className="w-full gap-2"
              disabled={off || isLoading}
            >
              {isLoading && !off && (
                <svg
                  className="h-4 w-4 animate-spin-slow"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              {isLoading ? t.auth.signingInBtn : t.auth.signInBtn}
            </Button>
          </form>

          {/* ── OAuth divider ──────────────────────────────────── */}
          <div
            className="relative"
            role="separator"
            aria-orientation="horizontal"
          >
            <hr className="border-t border-border-subtle" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface-1 px-2 text-xs uppercase text-fg-muted">
              {t.auth.orContinueWith}
            </span>
          </div>

          <nav
            className="grid grid-cols-2 gap-4"
            aria-label={t.a11y.socialLogin}
          >
            <Button
              id="btn-github"
              variant="outline"
              onClick={onGithub}
              disabled={off}
              className="gap-2"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </Button>
            <Button
              id="btn-google"
              variant="outline"
              onClick={onGoogle}
              disabled={off}
              className="gap-2"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>
          </nav>
        </Card.Body>

        <Card.Footer className="px-6 text-sm justify-center pb-4">
          <p className="text-xs text-fg-muted">
            {t.auth.noAccount}{" "}
            <Link
              href="/register"
              className="font-medium text-fg underline underline-offset-2 hover:text-accent transition-colors duration-150"
            >
              {t.auth.registerLink}
            </Link>
          </p>
        </Card.Footer>
      </Card.Root>
    </AuthLayout>
  );
}
