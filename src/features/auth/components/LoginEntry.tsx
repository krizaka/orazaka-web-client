"use client";

import * as React from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthFlags } from "@/core/context/AuthFlagsContext";
import { useTranslation } from "@/core/context/LocaleContext";
import { useAuth } from "@/core/hooks/useAuth";
import { LoginCard } from "@/features/auth/components/LoginForm";

/** The connected sign-in: next-auth credentials and OAuth. Mounted only while `AUTH_LOGIN_ENABLED` is on. */
export function LoginForm() {
  const router = useRouter();
  const { isAuthenticated, loginWithGithub, loginWithGoogle } = useAuth();
  const { t } = useTranslation();
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [shakeError, setShakeError] = React.useState(false);

  React.useEffect(() => {
    if (isAuthenticated) router.push("/");
  }, [isAuthenticated, router]);

  const fail = (message: string) => {
    setError(message);
    setShakeError(true);
    setTimeout(() => setShakeError(false), 500);
  };

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await signIn("credentials", { email, password, redirect: false });
      if (res?.error) fail(t.auth.invalidCredentials);
      else if (res?.ok) router.push("/");
    } catch {
      fail(t.auth.unexpectedError);
    } finally {
      setIsLoading(false);
    }
  };

  return <LoginCard error={error} shakeError={shakeError} isLoading={isLoading} onSubmit={handleLogin} onGithub={loginWithGithub} onGoogle={loginWithGoogle} />;
}

/**
 * Sign-in while it is closed (`AUTH_LOGIN_ENABLED` off): the real screen of the app, disabled, under a calm banner that
 * says when it opens and points at the demo. Nothing here touches the session or the backend.
 */
export function LoginPreview() {
  const { t } = useTranslation();
  const c = t.landing.closed;
  return (
    <LoginCard
      preview
      notice={
        <div role="status" className="flex flex-col gap-2 rounded-lg border border-border-default bg-surface-2/70 px-3 py-3 text-sm text-fg-secondary">
          <p>{c.signInBanner}</p>
          <Link href="/#demo" className="font-medium text-fg underline underline-offset-2 hover:text-accent">
            {c.heroSecondary}
          </Link>
        </div>
      }
    />
  );
}

/** The open sign-in when `AUTH_LOGIN_ENABLED` is on, the disabled preview of the same screen otherwise. */
export function LoginEntry() {
  const flags = useAuthFlags();
  return flags.login ? <LoginForm /> : <LoginPreview />;
}
