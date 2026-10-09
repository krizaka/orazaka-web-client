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
import { Input } from "@krizaka/orazaka-design-system";
import { useTranslation } from "@/core/context/LocaleContext";
import { useVerifyEmail } from "@/features/auth/hooks/useVerifyEmail";
import { Card } from "@krizaka/ui/card";

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
        <Card.Root>
          <Card.Body
            padding="lg"
            className="flex flex-col items-center justify-center pt-12 pb-12 space-y-4">
            <Icon name="loader" className="w-12 h-12 animate-spin text-success" />
            <p className="text-fg-secondary font-medium">
              {t.verify.loadingMessage}
            </p>
          </Card.Body>
        </Card.Root>
      )}

      {status === "success" && (
        <Card.Root className="border-success/25 bg-success/20 shadow-2xl backdrop-blur-xl">
          <Card.Body padding="lg" className="gap-1.5 text-center">
            <Icon name="checkCircle" className="w-12 h-12 text-success mx-auto mb-4" />
            <Card.Title className="line-clamp-none group-hover:text-success text-2xl font-bold tracking-tight text-success">
              {t.verify.successTitle}
            </Card.Title>
            <Card.Description className="line-clamp-none text-sm text-fg-secondary">
              {t.verify.successDescription}
            </Card.Description>
          </Card.Body>
          <Card.Footer className="px-6 pb-6 text-sm">
            <Button
              onClick={() => router.push("/login")}
              className="w-full bg-success hover:bg-success text-on-accent flex items-center justify-center space-x-2"
            >
              <span>{t.verify.goToLogin}</span>
              <Icon name="arrowRight" className="w-4 h-4" />
            </Button>
          </Card.Footer>
        </Card.Root>
      )}

      {status === "error" && (
        <Card.Root className="border-danger/25 bg-danger/20 shadow-2xl backdrop-blur-xl">
          <Card.Body padding="lg" className="gap-1.5 text-center">
            <Icon name="error" className="w-12 h-12 text-danger mx-auto mb-4" />
            <Card.Title className="line-clamp-none group-hover:text-danger text-2xl font-bold tracking-tight text-danger">
              {t.verify.errorTitle}
            </Card.Title>
            <Card.Description className="line-clamp-none text-sm text-fg-secondary">
              {errorMsg}
            </Card.Description>
          </Card.Body>
          <Card.Body padding="lg" className="block pt-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-fg-secondary">
                  {t.verify.enterTokenManually}
                </label>
                <Input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder={t.verify.tokenPlaceholder}
                  className="w-full bg-surface-1/50 backdrop-blur-sm"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-surface-2 text-fg hover:bg-surface-3"
              >
                {t.verify.retryVerification}
              </Button>
            </form>
          </Card.Body>
        </Card.Root>
      )}

      {status === "idle" && (
        <Card.Root>
          <Card.Body padding="lg" className="gap-1.5 text-center">
            <Card.Title className="line-clamp-none group-hover:text-fg text-2xl font-bold tracking-tight text-fg">
              {t.verify.idleTitle}
            </Card.Title>
            <Card.Description className="line-clamp-none text-sm text-fg-secondary">
              {t.verify.idleDescription}
            </Card.Description>
          </Card.Body>
          <Card.Body padding="lg" className="block pt-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-fg-secondary">
                  {t.verify.tokenLabel}
                </label>
                <Input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder={t.verify.tokenPlaceholder}
                  className="w-full bg-surface-1/50 backdrop-blur-sm"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-success hover:bg-success text-on-accent"
              >
                {t.verify.activateAccount}
              </Button>
            </form>
          </Card.Body>
        </Card.Root>
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
        <div className="flex min-h-screen items-center justify-center bg-surface-0">
          <Icon name="loader" className="w-8 h-8 animate-spin text-success" />
        </div>
      }
    >
      <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-tr from-surface-0 via-surface-1 to-surface-0 transition-colors duration-300">
        <VerifyPageContent />
      </main>
    </Suspense>
  );
}
