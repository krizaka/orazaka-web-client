"use client";

import * as React from "react";
import { getSession } from "next-auth/react";
import { ApiKeysSection } from "./ApiKeysSection";
import { AiProvidersSection } from "./AiProvidersSection";
import { McpServersSection } from "./McpServersSection";

/**
 * Integrations tab — provider API keys and MCP servers. Regular users manage
 * their own remote MCP servers; admins additionally see platform-wide and local
 * (STDIO) transports via {@link McpServersSection}.
 */
export function IntegrationsTab() {
  const fetchHeaders = React.useCallback(async (): Promise<
    Record<string, string>
  > => {
    const session = await getSession();
    return {
      "Content-Type": "application/json",
      ...(session?.user?.id ? { Authorization: `Bearer ${session.user.id}` } : {}),
    };
  }, []);

  return (
    <section className="space-y-6">
      <AiProvidersSection fetchHeaders={fetchHeaders} />
      <ApiKeysSection fetchHeaders={fetchHeaders} />
      <McpServersSection fetchHeaders={fetchHeaders} />
    </section>
  );
}
