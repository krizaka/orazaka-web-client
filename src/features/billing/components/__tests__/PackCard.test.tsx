import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import type { PackSummary } from "@krizaka/orazaka-shared";
import { PackCard } from "@/features/billing/components/PackCard";

jest.mock("@/core/context/LocaleContext", () => ({
  useTranslation: () => ({
    t: {
      packs: {
        owned: "Owned",
        included: "Included",
        subscribe: "Add to my account",
        subscribing: "Adding…",
        remove: "Remove",
        includedCredits: "credits included",
        free: "Free",
        priceUnavailable: "—",
      },
    },
    locale: "en",
  }),
}));

jest.mock("@krizaka/orazaka-design-system", () => ({
  Icon: () => <span />,
}));

function pack(kind: PackSummary["kind"], access: PackSummary["access"]): PackSummary {
  return {
    packKey: "media-toolkit",
    categoryKey: "business",
    label: "Media",
    tagline: null,
    iconKey: "image",
    heroAssetId: null,
    regulatoryClass: "STANDARD",
    kind,
    access,
    studioKeys: ["image-generation"],
    priceCents: 0,
    includedCredits: null,
  };
}

function renderCard(
  kind: PackSummary["kind"],
  access: PackSummary["access"],
  isOwned = false,
) {
  render(
    <PackCard
      pack={pack(kind, access)}
      isOwned={isOwned}
      isPending={false}
      onSubscribe={jest.fn()}
      onRemove={jest.fn()}
    />,
  );
}

describe("PackCard — the band is the server's verdict (ADR-061, ADR-066)", () => {
  it("reads 'Included' for a pack the actor's entitlement grants, and offers no action", () => {
    renderCard("TOOLKIT", "INCLUDED");

    expect(screen.getByText("Included")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("offers the purchase for a TOOLKIT the actor is NOT entitled to", () => {
    // The defect: this card read `kind === "TOOLKIT"` and said "Included" to someone who
    // had nothing, with no way to get it.
    renderCard("TOOLKIT", "BUYABLE");

    expect(screen.queryByText("Included")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add to my account" })).toBeInTheDocument();
  });

  it("offers no purchase when billing named no price", () => {
    renderCard("VERTICAL", "UNAVAILABLE");

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByText("Included")).not.toBeInTheDocument();
  });

  it("offers the purchase for a VERTICAL the actor does not own", () => {
    renderCard("VERTICAL", "BUYABLE");

    expect(screen.getByRole("button", { name: "Add to my account" })).toBeInTheDocument();
    expect(screen.queryByText("Included")).not.toBeInTheDocument();
  });

  it("offers removal, never 'Included', for a VERTICAL the actor owns", () => {
    renderCard("VERTICAL", "BUYABLE", true);

    expect(screen.getByText("Owned")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Remove" })).toBeInTheDocument();
  });
});
