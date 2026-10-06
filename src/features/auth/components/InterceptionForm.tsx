"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@krizaka/orazaka-design-system";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@krizaka/orazaka-design-system";
import { Icon } from "@krizaka/orazaka-design-system";
import { useTranslation } from "@/core/context/LocaleContext";
import { InterceptionFormField } from "./InterceptionFormField";
import {
  useInterceptionSchema,
  useResolveInterception,
} from "@/features/auth/hooks/useInterception";

interface InterceptionFormProps {
  schemaId: string;
  interceptionType?: string;
}

export function InterceptionForm({
  schemaId,
  interceptionType = schemaId,
}: Readonly<InterceptionFormProps>) {
  const router = useRouter();
  const { data: session, update } = useSession();
  const { locale, t } = useTranslation();
  const [formValues, setFormValues] = React.useState<Record<string, string>>(
    {},
  );
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const { schema, isLoading, error } = useInterceptionSchema(schemaId);

  React.useEffect(() => {
    if (schema?.fields) {
      const defaults: Record<string, string> = {};
      schema.fields.forEach((field) => {
        defaults[field.name] = field.defaultValue || "";
      });
      Promise.resolve().then(() => setFormValues(defaults));
    }
  }, [schema]);

  const { resolve, isPending } = useResolveInterception({
    interceptionType,
    schemaId,
    onSuccess: async () => {
      if (session?.user) {
        const updated = (session.user.activeInterceptions || []).filter(
          (id) => id !== schemaId,
        );
        await update({ activeInterceptions: updated });
        router.push("/");
        router.refresh();
      }
    },
    onError: (msg) => {
      setErrorMsg(msg);
    },
  });

  const handleInputChange = (fieldName: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    const missing = schema?.fields?.find(
      (f) => f.required && !formValues[f.name]?.trim(),
    );
    if (missing) {
      setErrorMsg(t.interception.fieldRequired(missing.label));
      return;
    }
    resolve(formValues);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
        <Icon name="loader" size={32} className="animate-spin text-status-success" />
        <p className="text-text-muted text-sm dark:text-text-secondary">
          {t.interception.loadingSchema}
        </p>
      </div>
    );
  }

  if (error || !schema) {
    return (
      <Card className="max-w-md mx-auto border-status-error/30 bg-status-error/5 backdrop-blur-md">
        <CardHeader>
          <div className="flex items-center space-x-2 text-status-error">
            <Icon name="error" size={24} />
            <CardTitle>{t.interception.loadingError}</CardTitle>
          </div>
          <CardDescription>{t.interception.loadingErrorDesc}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button
            variant="outline"
            onClick={() => globalThis.location.reload()}
            className="w-full"
          >
            {t.interception.retry}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="max-w-xl mx-auto border-border-subtle/80 bg-white/70 shadow-2xl dark:border-border-subtle/60 dark:bg-surface-0/60 backdrop-blur-xl transition-all duration-300">
      <form onSubmit={handleSubmit}>
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold tracking-tight bg-gradient-to-r from-surface-1 to-surface-3 dark:from-surface-1 dark:to-surface-3 bg-clip-text text-transparent">
            {schema.title}
          </CardTitle>
          <CardDescription className="text-text-muted dark:text-text-secondary">
            {schema.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {errorMsg && (
            <div className="flex items-start space-x-2 rounded-xl border border-status-error/20 bg-status-error/5 p-3.5 text-sm text-status-error animate-in fade-in slide-in-from-top-1">
              <Icon name="error" size={20} className="flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-4">
            {schema.fields.map((field) => (
              <InterceptionFormField
                key={field.name}
                field={field}
                value={formValues[field.name] || ""}
                onChange={(val) => handleInputChange(field.name, val)}
                disabled={isPending}
                locale={locale}
              />
            ))}
          </div>
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-status-success to-status-success hover:from-status-success hover:to-status-success text-white font-medium shadow-lg hover:shadow-status-success/10 transition-all duration-300"
          >
            {isPending ? (
              <>
                <Icon name="loader" size={16} className="animate-spin" />
                <span>{t.interception.resolving}</span>
              </>
            ) : (
              <span>{t.interception.submitPreferences}</span>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
