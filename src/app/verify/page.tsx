"use client";

/**
 * @file verify/page.tsx
 * @description Account activation and verification page.
 * Processes the verification token via the BFF GraphQL proxy and renders corresponding status screens.
 */

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { Button, Icon } from "@krizaka/orazaka-design-system";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@krizaka/orazaka-design-system";
import { Input } from "@krizaka/orazaka-design-system";
import { useTranslation } from "@/core/context/LocaleContext";
import { useVerifyEmail } from "@/features/auth/hooks/useVerifyEmail";

function VerifyPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useTranslation();
  const tokenParam = searchParams.get("token");

  const [token, setToken] = React.useState("");
  const { verify, status, errorMsg } = useVerifyEmail();

  // If token parameter exists in URL, trigger verification automatically
  React.useEffect(() => {
    if (tokenParam) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setToken(tokenParam);
      verify(tokenParam);
    }
  }, [tokenParam, verify]);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (token.trim()) {
      verify(token);
    }
  };

  return (
    <div className="w-full max-w-md">
      {status === "loading" && (
        <Card className="">
          <CardContent className="flex flex-col items-center justify-center pt-12 pb-12 space-y-4">
            <Icon name="loader" className="w-12 h-12 animate-spin text-status-success" />
            <p className="text-text-muted dark:text-text-secondary font-medium">
              {t.verify.loadingMessage}
            </p>
          </CardContent>
        </Card>
      )}

      {status === "success" && (
        <Card className="border-status-success/20 bg-status-success/5 shadow-2xl dark:border-status-success/25 dark:bg-status-success/20 backdrop-blur-xl">
          <CardHeader className="text-center">
            <Icon name="checkCircle" className="w-12 h-12 text-status-success mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold tracking-tight text-status-success">
              {t.verify.successTitle}
            </CardTitle>
            <CardDescription className="text-text-muted dark:text-text-secondary">
              {t.verify.successDescription}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              onClick={() => router.push("/login")}
              className="w-full bg-status-success hover:bg-status-success text-white flex items-center justify-center space-x-2"
            >
              <span>{t.verify.goToLogin}</span>
              <Icon name="arrowRight" className="w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {status === "error" && (
        <Card className="border-status-error/20 bg-status-error/5 shadow-2xl dark:border-status-error/25 dark:bg-status-error/20 backdrop-blur-xl">
          <CardHeader className="text-center">
            <Icon name="error" className="w-12 h-12 text-status-error mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold tracking-tight text-status-error">
              {t.verify.errorTitle}
            </CardTitle>
            <CardDescription className="text-text-muted dark:text-text-secondary">
              {errorMsg}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">
                  {t.verify.enterTokenManually}
                </label>
                <Input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder={t.verify.tokenPlaceholder}
                  className="w-full bg-card-bg/50 backdrop-blur-sm"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-surface-1 text-text-primary dark:bg-surface-2 dark:text-text-primary dark:hover:bg-surface-3"
              >
                {t.verify.retryVerification}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {status === "idle" && (
        <Card className="">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold tracking-tight text-text-primary">
              {t.verify.idleTitle}
            </CardTitle>
            <CardDescription className="text-text-muted dark:text-text-secondary">
              {t.verify.idleDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">
                  {t.verify.tokenLabel}
                </label>
                <Input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder={t.verify.tokenPlaceholder}
                  className="w-full bg-card-bg/50 backdrop-blur-sm"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-status-success hover:bg-status-success text-white"
              >
                {t.verify.activateAccount}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/**
 * VerifyPage component that wraps VerifyPageContent in a Suspense boundary.
 *
 * @returns The Suspense wrapped account verification page.
 */
export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <Icon name="loader" className="w-8 h-8 animate-spin text-status-success" />
        </div>
      }
    >
      <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-tr from-surface-1 via-surface-2 to-surface-3 dark:from-surface-0 dark:via-surface-1 dark:to-surface-0 transition-colors duration-300">
        <VerifyPageContent />
      </main>
    </Suspense>
  );
}
