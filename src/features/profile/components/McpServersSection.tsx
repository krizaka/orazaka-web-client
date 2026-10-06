"use client";

import * as React from "react";
import {
  Input,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Icon,
} from "@krizaka/orazaka-design-system";
import { useTranslation } from "@/core/context/LocaleContext";
import { useMcpServers } from "@/features/profile/hooks/useMcpServers";

const selectClass =
  "flex h-10 w-full rounded-md border border-card-border bg-card-bg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-card-border";
const inputClass = "bg-card-bg border-card-border text-foreground";
const labelClass = "text-sm font-medium text-foreground opacity-80";

interface McpServersSectionProps {
  fetchHeaders: () => Promise<Record<string, string>>;
}

/**
 * McpServersSection renders the MCP server registration UI (list + add/delete form). All data and
 * lifecycle logic live in {@link useMcpServers}; this component is purely presentational.
 *
 * @param props.fetchHeaders - Async function returning authorization headers.
 */
export function McpServersSection({ fetchHeaders }: Readonly<McpServersSectionProps>) {
  const { t } = useTranslation();
  const {
    isAdmin,
    servers,
    isLoadingServers,
    isSavingServer,
    serverMessage,
    serverLabel,
    setServerLabel,
    serverUrl,
    setServerUrl,
    serverAuthToken,
    setServerAuthToken,
    serverTransport,
    setServerTransport,
    serverCommand,
    setServerCommand,
    serverArgs,
    setServerArgs,
    handleSaveServer,
    handleDeleteServer,
  } = useMcpServers(fetchHeaders);

  return (
    <Card className="bg-[var(--surface-1)] shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-[var(--text-primary)]">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
              <Icon name="mcp" size={16} />
            </span>
            {t.settings.mcpServersTitle}
          </CardTitle>
          <CardDescription className="text-[var(--text-secondary)]">
            {t.settings.mcpServersDesc}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
      {serverMessage && (
        <div className="p-3 bg-status-success/20 border border-status-success/40 rounded-xl text-xs font-semibold text-status-success">
          {serverMessage}
        </div>
      )}
      <section className="space-y-2">
        {(() => {
          if (isLoadingServers) {
            return <p className="text-xs opacity-70">{t.settings.mcpLoading}</p>;
          }
          if (servers.length === 0) {
            return <p className="text-xs opacity-70">{t.settings.mcpNoServers}</p>;
          }
          return (
            <ul className="divide-y divide-card-border border border-card-border rounded-xl overflow-hidden bg-card-bg/50">
              {servers.map((srv) => (
                <li
                  key={srv.id}
                  className="flex items-center justify-between p-3 text-xs"
                >
                  <article className="space-y-1">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <span>{srv.label}</span>
                      {isAdmin && (
                        <span className="px-1.5 py-0.5 rounded bg-surface-3 dark:bg-surface-2 text-[10px]">
                          {srv.transportType}
                        </span>
                      )}
                    </h4>
                    <p className="opacity-70 font-mono">
                      {srv.url || srv.command}
                    </p>
                  </article>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleDeleteServer(srv.id)}
                    disabled={isSavingServer}
                    className="text-status-error border-status-error/20 hover:bg-status-error dark:hover:bg-status-error/20 px-2 py-1 h-7 text-[10px]"
                  >
                    {t.settings.mcpDelete}
                  </Button>
                </li>
              ))}
            </ul>
          );
        })()}
      </section>
      <form
        onSubmit={handleSaveServer}
        className="space-y-3 p-4 border border-card-border rounded-xl bg-card-bg/20"
      >
        <div className="space-y-2">
          <label className={labelClass}>{t.settings.mcpLabel}</label>
          <Input
            value={serverLabel}
            onChange={(e) => setServerLabel(e.target.value)}
            placeholder={t.settings.mcpLabelPlaceholder}
            className={inputClass}
            required
          />
        </div>
        <div className="space-y-2">
          <label className={labelClass}>{t.settings.mcpTransportType}</label>
          <select
            className={selectClass}
            value={serverTransport}
            onChange={(e) =>
              setServerTransport(e.target.value as "remote" | "local")
            }
            disabled={!isAdmin}
          >
            <option value="remote">{t.settings.mcpRemoteLabel}</option>
            {isAdmin && (
              <option value="local">{t.settings.mcpLocalLabel}</option>
            )}
          </select>
        </div>
        {serverTransport === "remote" ? (
          <>
            <div className="space-y-2">
              <label className={labelClass}>{t.settings.mcpUrl}</label>
              <Input
                value={serverUrl}
                onChange={(e) => setServerUrl(e.target.value)}
                placeholder={t.settings.mcpUrlPlaceholder}
                className={inputClass}
                required
              />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>{t.settings.mcpAuthToken}</label>
              <Input
                type="password"
                value={serverAuthToken}
                onChange={(e) => setServerAuthToken(e.target.value)}
                placeholder={t.settings.mcpAuthTokenPlaceholder}
                className={inputClass}
              />
            </div>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <label className={labelClass}>{t.settings.mcpCommand}</label>
              <Input
                value={serverCommand}
                onChange={(e) => setServerCommand(e.target.value)}
                placeholder={t.settings.mcpCommandPlaceholder}
                className={inputClass}
                required
              />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>{t.settings.mcpArgs}</label>
              <Input
                value={serverArgs}
                onChange={(e) => setServerArgs(e.target.value)}
                placeholder={t.settings.mcpArgsPlaceholder}
                className={inputClass}
              />
            </div>
          </>
        )}
        <Button
          type="submit"
          disabled={
            isSavingServer ||
            !serverLabel ||
            (serverTransport === "remote" ? !serverUrl : !serverCommand)
          }
          className="w-full mt-2"
        >
          {t.settings.mcpRegister}
        </Button>
      </form>
      </CardContent>
    </Card>
  );
}
