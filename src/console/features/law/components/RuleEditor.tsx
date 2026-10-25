"use client";

import { z } from "zod";
import { createKrizakaForm } from "@krizaka/ui/form";
import { fill } from "@/core/context/fill";
import { LawAdminApi } from "@/console/services/law.admin.api";
import { CHECK_TYPES, RULE_METHODS, RULE_SEVERITIES, type RuleProposal } from "@/console/services/law.schemas";
import { asRefusal } from "@/console/features/law/hooks/useLawLoad";
import { useLawCopy } from "@/console/features/law/hooks/useLawCopy";
import { draftOf, hasText, isHttpsUrl, passedVet, ruleOf, type Notice } from "@/console/features/law/utils/law";

const required = z.string().refine(hasText, "law.required");

/** The fields of a rule a reviewer may change; its id and the law it cites stay as derived (the vet checks them again). */
const ruleForm = createKrizakaForm({
  schema: z.object({
    title: required,
    severity: z.enum(RULE_SEVERITIES),
    method: z.enum(RULE_METHODS),
    subject: z.string(),
    checkType: z.enum(["NONE", ...CHECK_TYPES]),
    pattern: z.string(),
    question: z.string(),
    citation: required,
    sourceUrl: z.string().refine(isHttpsUrl, "law.https"),
    onPass: z.string(),
    onFail: z.string(),
    fixturesPass: z.string(),
    fixturesFail: z.string(),
  }),
  defaultValues: {
    title: "",
    severity: "BLOCKING",
    method: "DETERMINISTIC",
    subject: "",
    checkType: "NONE",
    pattern: "",
    question: "",
    citation: "",
    sourceUrl: "",
    onPass: "",
    onFail: "",
    fixturesPass: "",
    fixturesFail: "",
  },
});

/** Edits a rule: saving is `PUT /proposals/{id}`, a new revision vetted again; the answer says how the vet judged it. */
export function RuleEditor({ proposal, onDone }: Readonly<{ proposal: RuleProposal; onDone: (notice: Notice) => void }>) {
  const { t, refusal } = useLawCopy();
  const e = t.editor;
  const words: Record<string, string> = { "law.required": e.required, "law.https": e.https };
  const form = ruleForm.useForm({
    defaultValues: draftOf(proposal.rule),
    i18n: { t: (key) => words[key] },
    onSubmit: async (draft) => {
      try {
        const revised = await LawAdminApi.revise(proposal.id, ruleOf(proposal.rule, draft));
        const passed = passedVet(revised);
        const values = { revision: revised.proposalRevision, ruleId: revised.ruleId };
        onDone({ tone: passed ? "success" : "warning", text: fill(passed ? t.actions.revisedPassed : t.actions.revisedFailed, values) });
      } catch (error) {
        onDone({ tone: "danger", text: refusal(asRefusal(error)) });
      }
    },
  });
  const options = <K extends string>(keys: readonly K[], names: Record<K, string>) => keys.map((value) => ({ value, label: names[value] }));
  return (
    <form.Form aria-label={fill(t.actions.editTitle, { ruleId: proposal.ruleId })} className="flex flex-col gap-3">
      <form.TextField name="title" label={e.title} autoComplete="off" />
      <section className="grid gap-3 sm:grid-cols-2">
        <form.Select name="severity" label={e.severity} options={options(RULE_SEVERITIES, t.severity)} />
        <form.Select name="method" label={e.method} options={options(RULE_METHODS, t.method)} />
      </section>
      <form.TextField name="subject" label={e.subject} autoComplete="off" />
      <section className="grid gap-3 sm:grid-cols-2">
        <form.Select name="checkType" label={e.checkType} options={options(["NONE", ...CHECK_TYPES] as const, t.checkType)} />
        <form.TextField name="pattern" label={e.pattern} autoComplete="off" />
      </section>
      <form.TextArea name="question" label={e.question} rows={2} />
      <form.TextField name="citation" label={e.citation} autoComplete="off" />
      <form.TextField name="sourceUrl" label={e.sourceUrl} type="url" autoComplete="off" />
      <section className="grid gap-3 sm:grid-cols-2">
        <form.TextArea name="onPass" label={e.onPass} rows={2} />
        <form.TextArea name="onFail" label={e.onFail} rows={2} />
        <form.TextArea name="fixturesPass" label={e.fixturesPass} rows={3} />
        <form.TextArea name="fixturesFail" label={e.fixturesFail} rows={3} />
      </section>
      <form.FormError />
      <form.Submit variant="primary">{t.actions.save}</form.Submit>
    </form.Form>
  );
}
