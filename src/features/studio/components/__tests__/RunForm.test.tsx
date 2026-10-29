import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { RunForm } from "@/features/studio/components/RunForm";
import { MediaApi } from "@/services/media.api";

jest.mock("@/core/context/LocaleContext", () => {
  const { translations } = jest.requireActual("@/core/context/translations");
  return { useTranslation: () => ({ t: translations.en, locale: "en" }) };
});
jest.mock("@/services/media.api", () => ({ MediaApi: { uploadMedia: jest.fn() } }));

const upload = MediaApi.uploadMedia as jest.Mock;

const schema = JSON.stringify({
  type: "object",
  required: ["prompt"],
  properties: {
    prompt: { type: "string", title: "Ce qui doit se passer à l'écran" },
    image: {
      type: "string",
      format: "asset:image",
      maxLength: 120,
      title: "Image d'amorce (facultatif)",
      description: "Choisissez…",
    },
  },
});

const setup = () => {
  const onSubmit = jest.fn();
  const view = render(
    <RunForm
      studioKey="video-generation"
      inputSchema={schema}
      estimatedCredits={3}
      isSubmitting={false}
      onSubmit={onSubmit}
    />,
  );
  return { onSubmit, ...view };
};
const photo = () => new File(["x"], "me.png", { type: "image/png" });
const pick = (container: HTMLElement, file: File) =>
  fireEvent.change(container.querySelector('input[type="file"]') as HTMLInputElement, { target: { files: [file] } });

beforeAll(() => {
  URL.createObjectURL = jest.fn(() => "blob:preview");
  URL.revokeObjectURL = jest.fn();
});
beforeEach(() => upload.mockReset());

describe("RunForm — an image input is a picker", () => {
  it("shows the field in English and a file picker, never a text field for the asset id", () => {
    const { container } = setup();
    expect(screen.getByText("Starting image (optional)")).toBeInTheDocument();
    expect(screen.getByText("What should happen on screen *")).toBeInTheDocument();
    expect(container.querySelector('input[type="file"]')).not.toBeNull();
    expect(container.querySelectorAll('input[type="text"]')).toHaveLength(1); // the prompt only
    expect(screen.getByRole("button", { name: "Choose a photo" })).toBeInTheDocument();
  });

  it("uploads the chosen photo and submits the asset id it gets back", async () => {
    upload.mockResolvedValue({ assetId: "asset-42" });
    const { container, onSubmit } = setup();
    fireEvent.change(screen.getByLabelText(/What should happen/), { target: { value: "a fox" } });
    pick(container, photo());
    await waitFor(() => expect(container.querySelector("[data-asset-id='asset-42']")).not.toBeNull());
    expect(upload).toHaveBeenCalledWith(expect.objectContaining({ name: "me.png" }));
    expect(screen.getByText("me.png")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Run" }));
    expect(onSubmit).toHaveBeenCalledWith({ prompt: "a fox", image: "asset-42" });
  });

  it("holds the run while the photo is being sent", async () => {
    let finish: (v: { assetId: string }) => void = () => {};
    upload.mockReturnValue(new Promise((resolve) => (finish = resolve)));
    const { container } = setup();
    fireEvent.change(screen.getByLabelText(/What should happen/), { target: { value: "a fox" } });
    pick(container, photo());
    await waitFor(() => expect(screen.getByRole("button", { name: "Run" })).toBeDisabled());
    finish({ assetId: "asset-1" });
    await waitFor(() => expect(screen.getByRole("button", { name: "Run" })).toBeEnabled());
  });

  it("removes the photo and submits without it", async () => {
    upload.mockResolvedValue({ assetId: "asset-42" });
    const { container, onSubmit } = setup();
    fireEvent.change(screen.getByLabelText(/What should happen/), { target: { value: "a fox" } });
    pick(container, photo());
    await waitFor(() => expect(container.querySelector("[data-asset-id='asset-42']")).not.toBeNull());
    fireEvent.click(screen.getByRole("button", { name: "Remove me.png" }));
    expect(container.querySelector('input[type="file"]')).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Run" }));
    expect(onSubmit).toHaveBeenCalledWith({ prompt: "a fox" });
  });

  it("says so when the upload fails, and sends nothing", async () => {
    upload.mockRejectedValue(new Error("boom"));
    const { container, onSubmit } = setup();
    fireEvent.change(screen.getByLabelText(/What should happen/), { target: { value: "a fox" } });
    pick(container, photo());
    await waitFor(() => expect(screen.getByText("The upload failed. Try again.")).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: "Run" }));
    expect(onSubmit).toHaveBeenCalledWith({ prompt: "a fox" });
  });

  it("refuses a file that is not an image", () => {
    const { container } = setup();
    pick(container, new File(["x"], "doc.pdf", { type: "application/pdf" }));
    expect(screen.getByRole("alert")).toHaveTextContent("doc.pdf is not a supported file type.");
    expect(upload).not.toHaveBeenCalled();
  });
});

const imageSchema = JSON.stringify({
  type: "object",
  required: ["prompt"],
  properties: {
    prompt: { type: "string", title: "Ce que vous voulez voir" },
    size: { type: "string", enum: ["1024x1024", "512x512"], default: "1024x1024", title: "Format" },
    negativePrompt: { type: "string", title: "À éviter", "x-advanced": true },
    seed: { type: "string", title: "Graine", "x-control": "seed", "x-advanced": true },
    model: {
      type: "string",
      title: "Modèle",
      "x-advanced": true,
      "x-options": { source: "models", category: "image" },
      default: "sd-hosted",
      oneOf: [
        {
          const: "sd-hosted",
          title: "Stable Diffusion 3.5 Large",
          description: "Hosted by a provider.",
          "x-meta": { runsOn: "cloud", speed: "fast", typicalSeconds: 8, priceCents: 8, available: true },
        },
        {
          const: "flux",
          title: "FLUX.2 [klein] 4B",
          "x-meta": {
            runsOn: "local",
            speed: "balanced",
            typicalSeconds: 62,
            available: false,
            unavailableReason: "FLUX.2 is not running",
          },
        },
        {
          const: "z-image",
          title: "Z-Image Turbo",
          "x-meta": { runsOn: "local", speed: "slow", typicalSeconds: 157, available: true },
        },
      ],
    },
  },
});

const setupImage = (schemaText = imageSchema) => {
  const onSubmit = jest.fn();
  const view = render(
    <RunForm
      studioKey="image-generation"
      inputSchema={schemaText}
      estimatedCredits={3}
      isSubmitting={false}
      onSubmit={onSubmit}
    />,
  );
  return { onSubmit, ...view };
};
const openMore = () => fireEvent.click(screen.getByText("More options"));

describe("RunForm — closed sets are chosen from a list, never typed", () => {
  it("keeps the model, the seed and the things to avoid behind « More options »", () => {
    setupImage();
    expect(screen.getByRole("combobox", { name: /Modèle|Model/, hidden: true })).not.toBeVisible();
    openMore();
    expect(screen.getByRole("combobox", { name: /Modèle|Model/ })).toBeVisible();
  });

  it("lists the catalogue's models with what a person needs to choose: place, speed, time, price", () => {
    setupImage();
    openMore();
    fireEvent.click(screen.getByRole("combobox", { name: /Modèle|Model/ }));
    // The option says what it is in a line; the facts are chips, for the model in view only.
    expect(screen.getByRole("option", { name: /Stable Diffusion 3.5 Large/ })).toHaveTextContent(
      "Hosted by a provider.",
    );
    expect(screen.getByRole("list", { name: /About this model/ })).not.toHaveTextContent("Free"); // the model in view: cloud, priced
  });

  it("shows a model whose engine is off, but does not let it be chosen, and says why", () => {
    setupImage();
    openMore();
    fireEvent.click(screen.getByRole("combobox", { name: /Modèle|Model/ }));
    const off = screen.getByRole("option", { name: /FLUX.2/ });
    expect(off).toHaveAttribute("aria-disabled", "true");
    expect(off).toHaveTextContent("FLUX.2 is not running");
  });

  it("starts on « Automatic » naming the model that will run, and sends no model", () => {
    const { onSubmit } = setupImage();
    openMore();
    expect(screen.getByRole("combobox", { name: /Modèle|Model/ })).toHaveAttribute(
      "placeholder",
      "Automatic · Stable Diffusion 3.5 Large",
    );
    fireEvent.change(screen.getByLabelText(/What you want to see/), { target: { value: "a fox" } });
    fireEvent.click(screen.getByRole("button", { name: "Run" }));
    expect(onSubmit).toHaveBeenCalledWith({ prompt: "a fox", size: "1024x1024" });
  });

  it("sends the id of the model that was picked from the list", () => {
    const { onSubmit } = setupImage();
    openMore();
    fireEvent.click(screen.getByRole("combobox", { name: /Modèle|Model/ }));
    fireEvent.click(screen.getByRole("option", { name: /Z-Image Turbo/ }));
    fireEvent.change(screen.getByLabelText(/What you want to see/), { target: { value: "a fox" } });
    fireEvent.click(screen.getByRole("button", { name: "Run" }));
    expect(onSubmit).toHaveBeenCalledWith({ prompt: "a fox", size: "1024x1024", model: "z-image" });
  });

  it("offers the format as a list with readable names, not raw values", () => {
    setupImage();
    const size = screen.getByLabelText("Format") as HTMLSelectElement;
    expect([...size.options].map((o) => o.textContent)).toEqual(["Square · 1024×1024", "Quick preview · 512×512"]);
  });

  it("has a seed that is random by default and sends nothing", () => {
    const { onSubmit } = setupImage();
    openMore();
    expect(screen.getByRole("switch", { name: "Random" })).toBeChecked();
    expect(screen.queryByPlaceholderText("Seed number")).toBeNull();
    fireEvent.change(screen.getByLabelText(/What you want to see/), { target: { value: "a fox" } });
    fireEvent.click(screen.getByRole("button", { name: "Run" }));
    expect(onSubmit).toHaveBeenCalledWith({ prompt: "a fox", size: "1024x1024" });
  });

  it("sends the seed as digits once random is turned off", () => {
    const { onSubmit } = setupImage();
    openMore();
    fireEvent.click(screen.getByRole("switch", { name: "Random" }));
    fireEvent.change(screen.getByPlaceholderText("Seed number"), { target: { value: "42x7" } });
    expect(screen.getByPlaceholderText("Seed number")).toHaveValue("427");
    fireEvent.change(screen.getByLabelText(/What you want to see/), { target: { value: "a fox" } });
    fireEvent.click(screen.getByRole("button", { name: "Run" }));
    expect(onSubmit).toHaveBeenCalledWith({ prompt: "a fox", size: "1024x1024", seed: "427" });
  });

  it("when the list could not be loaded, the model says so out loud — never a blank select or a text box", () => {
    const unloaded = JSON.stringify({
      type: "object",
      properties: {
        prompt: { type: "string" },
        model: {
          type: "string",
          title: "Modèle",
          "x-advanced": true,
          "x-options": { source: "models", category: "image" },
        },
      },
    });
    const error = jest.spyOn(console, "error").mockImplementation(() => undefined);
    const { container } = setupImage(unloaded);
    openMore();
    expect(screen.getByRole("alert")).toHaveTextContent("No model available: contact the administrator.");
    expect(screen.getByRole("alert")).toHaveTextContent("The list could not be loaded");
    expect(error).toHaveBeenCalledWith(expect.stringContaining("« model »"));
    expect(container.querySelector("select")).toBeNull();
    expect(container.querySelectorAll('input[type="text"]')).toHaveLength(1); // the prompt only
    error.mockRestore();
  });

  it("an empty catalogue list is the same visible error, and is logged", () => {
    const empty = JSON.stringify({
      type: "object",
      properties: {
        prompt: { type: "string" },
        model: { type: "string", title: "Model", "x-options": { source: "models", category: "chat" }, oneOf: [] },
      },
    });
    const error = jest.spyOn(console, "error").mockImplementation(() => undefined);
    setupImage(empty);
    expect(screen.getByRole("alert")).toHaveTextContent("No model available: contact the administrator.");
    expect(screen.queryByRole("combobox")).toBeNull();
    expect(error).toHaveBeenCalled();
    error.mockRestore();
  });
});
