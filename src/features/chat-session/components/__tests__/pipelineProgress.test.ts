import { pipelineProgress } from "@/features/chat-session/components/ThinkingPipeline";

describe("pipelineProgress", () => {
  it("has nothing to show without a pipeline", () => {
    expect(pipelineProgress(undefined, new Set())).toEqual({
      steps: [],
      total: 0,
      doneCount: 0,
      allDone: true,
      current: null,
    });
  });
});
