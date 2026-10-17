import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { PackMarketplace } from "@/features/billing/components/PackMarketplace";
import { usePacks } from "@/features/billing/hooks/usePacks";

jest.mock("@/core/context/LocaleContext", () => ({
  useTranslation: () => ({
    t: {
      packs: {
        title: "Packs", subtitle: "s", retry: "Retry", holdingsUnavailable: "h", includedTitle: "Included", includedSubtitle: "i",
        loadError: "e", owned: "Owned", included: "Included", subscribe: "Add", subscribing: "…", remove: "Remove",
        includedCredits: "credits", free: "Free", priceUnavailable: "—",
      },
      showcase: { packs: { studiosIncluded: "Studios" } },
    },
    locale: "en",
  }),
}));
jest.mock("@/features/billing/hooks/usePacks");

const base = { ownedKeys: new Set<string>(), holdingsUnavailable: false, isLoading: false, error: null, pendingKey: null, reload: jest.fn(), subscribe: jest.fn(), remove: jest.fn() };
const pack = (packKey: string, categoryKey: string) => ({ packKey, categoryKey, label: packKey, tagline: null, iconKey: "studio", heroAssetId: null, regulatoryClass: "STANDARD", kind: "VERTICAL", access: "UNAVAILABLE", studioKeys: [], priceCents: 0, includedCredits: null });

describe("PackMarketplace", () => {
  it("groups the packs by category and leaves out a shelf with no pack", () => {
    jest.mocked(usePacks).mockReturnValue({
      ...base,
      packs: [pack("document-validation", "business-compliance"), pack("bien-etre", "wellbeing")],
      categories: [
        { categoryKey: "business", label: "Business" },
        { categoryKey: "business-compliance", label: "Business & compliance" },
        { categoryKey: "wellbeing", label: "Wellbeing" },
        { categoryKey: "data-analytics", label: "Data & Analytics" },
      ],
    } as never);
    render(<PackMarketplace studios={new Map()} />);
    expect(screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent)).toEqual(["Business & compliance", "Wellbeing"]);
  });
});
