import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { asReport, ReportFindings } from "@/features/studio/components/ReportFindings";

const report = {
  source: "Loi n° 89-462",
  summary: { byVerdict: { PASS: 1, FAIL: 1 } },
  findings: [
    { ruleId: "R-1", title: "Parties identified", verdict: "PASS", explanation: "The landlord is named.", citation: "art. 3" },
    { ruleId: "R-5", title: "Deposit capped", verdict: "FAIL", explanation: "Two months.", evidenceSpan: { quote: "deposit of 1 960 €" }, citation: "art. 22" },
  ],
};

describe("ReportFindings", () => {
  it("reads a rules report and nothing else", () => {
    expect(asReport(JSON.stringify(report))).not.toBeNull();
    expect(asReport("plain text")).toBeNull();
    expect(asReport(JSON.stringify({ findings: [{ ruleId: "x" }] }))).toBeNull();
  });

  it("puts the failures first, with their passage and citation", () => {
    render(<ReportFindings report={report} />);
    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("Deposit capped");
    expect(items[0]).toHaveTextContent("« deposit of 1 960 € »");
    expect(items[0]).toHaveTextContent("art. 22");
    expect(screen.getByText("FAIL · 1")).toBeInTheDocument();
  });
});
