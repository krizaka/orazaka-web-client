import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { EngineScreen } from "@/console/features/engine/components/EngineScreen";
import { groupOf, groupSettings, parseDraft } from "@/console/features/engine/utils/engine";
import { engineCopy } from "@/console/core/copy/engine";
import type { RuntimeSetting } from "@/console/services/runtime-config.admin.api";

const en = engineCopy.en;
const button = (label: string, name: string) => within(screen.getByLabelText(label).closest("[role=group]")!).getByRole("button", { name });
const setting = (over: Partial<RuntimeSetting> & { key: string }): RuntimeSetting => ({
  value: 1, type: "int", description: "A knob", default: 1, bounds: {}, ...over,
});

const SETTINGS = [
  { key: "run.max_parallel", value: 4, type: "int", description: "Parallel runs", default: 2, bounds: { minimum: 1, maximum: 10 } },
  { key: "run.cache_enabled", value: true, type: "boolean", description: "Cache on", default: false, bounds: {} },
  { key: "webhook.hosts", value: ["a.example"], type: "list", description: "Allowed hosts", default: [], bounds: { maxItems: 3 } },
  { key: "retention.days", value: 30, type: "int", description: "Days kept", default: 30, bounds: { minimum: 1 } },
];

function mockFetch(handler: (url: string, init?: RequestInit) => { status?: number; body: unknown }) {
  const fn = jest.fn(async (url: string, init?: RequestInit) => {
    const { status = 200, body } = handler(url, init);
    return { ok: status < 400, status, statusText: "", json: async () => body } as Response;
  });
  global.fetch = fn as unknown as typeof fetch;
  return fn;
}

describe("engine utils", () => {
  it("groups by key prefix, routing and unknown prefixes falling to other", () => {
    expect(groupOf("run.x")).toBe("run");
    expect(groupOf("marketplace.y")).toBe("marketplace");
    expect(groupOf("routing.z")).toBe("other");
    expect(groupSettings([setting({ key: "retention.b" }), setting({ key: "run.a" })]).map((g) => g.group)).toEqual(["run", "retention"]);
  });

  it("validates an int against its bounds", () => {
    const s = setting({ key: "run.x", bounds: { minimum: 1, maximum: 5 } });
    expect(parseDraft(s, "3", en)).toEqual({ ok: true, value: 3 });
    expect(parseDraft(s, "9", en).ok).toBe(false);
    expect(parseDraft(s, "1.5", en).ok).toBe(false);
  });

  it("validates a list: empty item, duplicate, max items", () => {
    const s = setting({ key: "webhook.h", type: "list", value: [], default: [], bounds: { maxItems: 2 } });
    expect(parseDraft(s, "a\nb", en)).toEqual({ ok: true, value: ["a", "b"] });
    expect(parseDraft(s, "", en)).toEqual({ ok: true, value: [] });
    expect(parseDraft(s, "a\n\nb", en).ok).toBe(false);
    expect(parseDraft(s, "a\na", en).ok).toBe(false);
    expect(parseDraft(s, "a\nb\nc", en).ok).toBe(false);
  });
});

describe("EngineScreen", () => {
  it("lists the settings by group with description, value, default and bounds", async () => {
    mockFetch(() => ({ body: SETTINGS }));
    render(<EngineScreen locale="en" />);
    expect(await screen.findByText("Parallel runs")).toBeTruthy();
    expect(screen.getByRole("heading", { name: en.groups.run })).toBeTruthy();
    expect(screen.getByRole("heading", { name: en.groups.webhook })).toBeTruthy();
    expect(screen.getByRole("heading", { name: en.groups.retention })).toBeTruthy();
    expect(screen.getByText("min 1 · max 10")).toBeTruthy();
    expect(screen.getByText(en.lead)).toBeTruthy();
  });

  it("speaks French", async () => {
    mockFetch(() => ({ body: SETTINGS }));
    render(<EngineScreen locale="fr" />);
    expect(await screen.findByRole("heading", { name: engineCopy.fr.groups.webhook })).toBeTruthy();
  });

  it("saves a valid value with a typed PUT and says it applies on the next read", async () => {
    const fetchMock = mockFetch((url, init) =>
      init?.method === "PUT" ? { body: { ...SETTINGS[0], value: 6 } } : { body: SETTINGS },
    );
    render(<EngineScreen locale="en" />);
    const input = await screen.findByLabelText("run.max_parallel");
    fireEvent.change(input, { target: { value: "6" } });
    fireEvent.click(button("run.max_parallel", en.save));
    expect(await screen.findByText(en.saved)).toBeTruthy();
    const put = fetchMock.mock.calls.find(([, init]) => init?.method === "PUT")!;
    expect(put[0]).toBe("/api/v1/studios/admin/runtime-config/run.max_parallel");
    expect(JSON.parse(put[1]!.body as string)).toEqual({ value: 6 });
  });

  it("does not call the API for an out-of-bounds value and shows the server's message for a refusal", async () => {
    const fetchMock = mockFetch((url, init) =>
      init?.method === "PUT" ? { status: 400, body: { status: "invalid_request", message: "value must be at most 10" } } : { body: SETTINGS },
    );
    render(<EngineScreen locale="en" />);
    const input = await screen.findByLabelText("run.max_parallel");
    fireEvent.change(input, { target: { value: "99" } });
    fireEvent.click(button("run.max_parallel", en.save));
    expect(await screen.findByText("Must be between 1 and 10.")).toBeTruthy();
    expect(fetchMock.mock.calls.some(([, init]) => init?.method === "PUT")).toBe(false);

    const retention = screen.getByLabelText("retention.days");
    fireEvent.change(retention, { target: { value: "40" } });
    fireEvent.click(button("retention.days", en.save));
    await waitFor(() => expect(fetchMock.mock.calls.some(([, init]) => init?.method === "PUT")).toBe(true));
  });

  it("shows the change history with actor ids", async () => {
    const fetchMock = mockFetch((url) =>
      url.includes("/audit") ? { body: [{ at: "2026-10-01T10:00:00Z", actorId: "actor-42", key: "run.max_parallel", before: 2, after: 4 }] } : { body: SETTINGS },
    );
    render(<EngineScreen locale="en" />);
    await screen.findByText("Parallel runs");
    fireEvent.click(button("run.max_parallel", en.history));
    expect(await screen.findByText("actor-42")).toBeTruthy();
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("/audit?key=run.max_parallel&limit="), expect.anything());
  });

  it("offers a retry when the settings cannot be read", async () => {
    mockFetch(() => ({ status: 500, body: {} }));
    render(<EngineScreen locale="en" />);
    expect(await screen.findByText(en.error)).toBeTruthy();
  });
});
