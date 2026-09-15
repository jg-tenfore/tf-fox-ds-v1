"use client";

/**
 * Registration UI — the sign-up pieces clinics and lessons share.
 *
 *  - `RequirementsPanel` — Fox's "Clinic Details" block: age range, gender, equipment,
 *    discounts, stated before anyone starts filling in a form.
 *  - `EligibilityFields` — date of birth, gender and per-golfer questions for one
 *    person, with the block message inline the moment an answer rules them out.
 *  - `BookingQuestions` — questions asked once per registration.
 *  - `MultiBuyBanner` — "Buy 3, get 50% off" and how close the golfer is to it.
 *
 * Rules and checks come from `registration-rules.ts`; nothing here decides eligibility.
 */
import type { FC, ReactNode } from "react";
import { AlertCircle, CheckCircle, Package, Tag01, User01, Users01 } from "@untitledui/icons";
import { Input } from "@/components/base/input/input";
import { NativeSelect } from "@/components/base/select/select-native";
import { cx } from "@/utils/cx";
import {
    type CustomQuestion,
    type EligibilityAnswers,
    type EligibilityResult,
    GENDER_LABEL,
    type Gender,
    type MultiBuyDiscount,
    type MultiBuyQuote,
    type RegistrationRules,
    ageRangeLabel,
    genderLimitLabel,
    multiBuyDetail,
    multiBuyLabel,
    multiBuyNudge,
} from "../registration-rules";

const money = (n: number) => `$${n.toFixed(2)}`;

/* ------------------------------------------------------------------ */
/* Requirements                                                        */
/* ------------------------------------------------------------------ */

const Row = ({ icon: Icon, label, children }: { icon: FC<{ className?: string }>; label: string; children: ReactNode }) => (
    <div className="flex items-start gap-3 py-3">
        <Icon className="mt-0.5 size-5 shrink-0 text-fg-quaternary" aria-hidden="true" />
        <span className="w-32 shrink-0 text-sm font-medium text-tertiary">{label}</span>
        <span className="min-w-0 flex-1 text-sm font-semibold text-primary">{children}</span>
    </div>
);

/**
 * Who can sign up, stated up front. Renders nothing for a program with no limits, so a
 * clinic open to everyone doesn't grow an empty table.
 */
export const RequirementsPanel = ({ rules, title = "Registration details" }: { rules?: RegistrationRules; title?: string }) => {
    if (!rules) return null;
    const age = ageRangeLabel(rules.age);
    const gender = genderLimitLabel(rules);
    const hasQuestions = Boolean(rules.questions?.length);
    if (!age && !gender && rules.equipmentProvided === undefined && !rules.multiBuy && !hasQuestions) return null;

    return (
        <div className="flex flex-col">
            <h3 className="text-md font-semibold text-primary">{title}</h3>
            <div className="mt-2 divide-y divide-secondary">
                {age && (
                    <Row icon={User01} label="Age range">
                        {age}
                        <span className="block text-xs font-normal text-tertiary">Age on the first session. Checked at registration.</span>
                    </Row>
                )}
                {gender && (
                    <Row icon={Users01} label="Gender">
                        {gender}
                    </Row>
                )}
                {rules.equipmentProvided !== undefined && (
                    <Row icon={Package} label="Equipment">
                        {rules.equipmentProvided ? "Provided" : "Bring your own"}
                    </Row>
                )}
                {rules.multiBuy && (
                    <Row icon={Tag01} label="Discounts">
                        {multiBuyLabel(rules.multiBuy)}
                        <span className="block text-xs font-normal text-tertiary">{multiBuyDetail(rules.multiBuy)}</span>
                    </Row>
                )}
                {hasQuestions && (
                    <Row icon={CheckCircle} label="At sign-up">
                        {rules.questions!.length} {rules.questions!.length === 1 ? "question" : "questions"}
                        <span className="block text-xs font-normal text-tertiary">{rules.questions!.map((q) => q.label).join(" · ")}</span>
                    </Row>
                )}
            </div>
        </div>
    );
};

/* ------------------------------------------------------------------ */
/* Questions                                                           */
/* ------------------------------------------------------------------ */

export const QuestionField = ({ question, value, onChange }: { question: CustomQuestion; value: string; onChange: (v: string) => void }) => {
    const label = question.required ? question.label : `${question.label} (optional)`;

    if (question.type === "text") {
        return <Input label={label} value={value} onChange={onChange} hint={question.hint} isRequired={question.required} />;
    }

    const options = question.type === "yes-no" ? ["Yes", "No"] : (question.options ?? []);
    return (
        <NativeSelect
            label={label}
            hint={question.hint}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            options={[{ label: "Choose…", value: "" }, ...options.map((o) => ({ label: o, value: o }))]}
        />
    );
};

/** Questions asked once for the whole registration. */
export const BookingQuestions = ({
    rules,
    answers,
    onChange,
}: {
    rules?: RegistrationRules;
    answers: Record<string, string>;
    onChange: (id: string, value: string) => void;
}) => {
    const questions = (rules?.questions ?? []).filter((q) => q.per === "booking");
    if (!questions.length) return null;
    return (
        <div className="flex flex-col gap-3">
            {questions.map((q) => (
                <QuestionField key={q.id} question={q} value={answers[q.id] ?? ""} onChange={(v) => onChange(q.id, v)} />
            ))}
        </div>
    );
};

/* ------------------------------------------------------------------ */
/* Eligibility                                                         */
/* ------------------------------------------------------------------ */

/** The message under a golfer who can't register. */
export const EligibilityProblems = ({ result }: { result: EligibilityResult }) => {
    if (!result.problems.length) return null;
    return (
        <div role="alert" className="flex items-start gap-2.5 rounded-lg bg-error-primary p-3 ring-1 ring-error_subtle ring-inset">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-fg-error-primary" aria-hidden="true" />
            <div className="flex flex-col gap-0.5">
                {result.problems.map((p) => (
                    <p key={p} className="text-sm font-medium text-error-primary">
                        {p}
                    </p>
                ))}
                <p className="text-xs text-tertiary">They can&rsquo;t be registered for this one — remove them or choose a different program.</p>
            </div>
        </div>
    );
};

/**
 * Date of birth, gender and per-golfer questions — only the ones the rules ask for.
 * Returns nothing for a program with no eligibility rules and no per-golfer questions.
 */
export const EligibilityFields = ({
    rules,
    value,
    onChange,
    result,
}: {
    rules?: RegistrationRules;
    value: EligibilityAnswers;
    onChange: (patch: EligibilityAnswers) => void;
    result?: EligibilityResult;
}) => {
    if (!rules) return null;
    const perGolfer = (rules.questions ?? []).filter((q) => q.per === "golfer");
    const genders: Gender[] = ["female", "male", "non-binary"];
    if (!rules.age && !rules.genders?.length && !perGolfer.length) return null;

    return (
        <div className="flex flex-col gap-3">
            {(rules.age || rules.genders?.length) && (
                <div className="grid gap-3 sm:grid-cols-2">
                    {rules.age && (
                        <Input
                            label="Date of birth"
                            type="date"
                            value={value.birthDate ?? ""}
                            onChange={(v) => onChange({ birthDate: v })}
                            hint={ageRangeLabel(rules.age) ?? undefined}
                            isRequired
                        />
                    )}
                    {rules.genders?.length ? (
                        <NativeSelect
                            label="Gender"
                            value={value.gender ?? ""}
                            onChange={(e) => onChange({ gender: e.target.value as Gender | "" })}
                            hint={genderLimitLabel(rules) ? `Open to ${genderLimitLabel(rules)?.toLowerCase()}` : undefined}
                            options={[{ label: "Choose…", value: "" }, ...genders.map((g) => ({ label: GENDER_LABEL[g], value: g }))]}
                        />
                    ) : null}
                </div>
            )}
            {perGolfer.map((q) => (
                <QuestionField
                    key={q.id}
                    question={q}
                    value={value.answers?.[q.id] ?? ""}
                    onChange={(v) => onChange({ answers: { ...value.answers, [q.id]: v } })}
                />
            ))}
            {result && <EligibilityProblems result={result} />}
        </div>
    );
};

/* ------------------------------------------------------------------ */
/* Multi-buy                                                           */
/* ------------------------------------------------------------------ */

/** The discount, and how far the golfer is from it — Fox's line under the session table. */
export const MultiBuyBanner = ({ rule, quote, className }: { rule: MultiBuyDiscount; quote: MultiBuyQuote; className?: string }) => {
    const nudge = multiBuyNudge(quote, rule);
    return (
        <div
            className={cx(
                "flex items-start gap-3 rounded-xl p-4 ring-1 ring-inset",
                quote.qualifies ? "bg-success-primary ring-secondary" : "bg-brand-primary ring-brand",
                className,
            )}
        >
            <Tag01 className={cx("mt-0.5 size-5 shrink-0", quote.qualifies ? "text-fg-success-primary" : "text-fg-brand-primary")} aria-hidden="true" />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <p className="text-sm font-semibold text-primary">{quote.qualifies ? `${multiBuyLabel(rule)} — applied` : multiBuyLabel(rule)}</p>
                <p className="text-sm text-tertiary">{quote.qualifies ? `You're saving ${money(quote.discount)} on these sessions.` : nudge}</p>
            </div>
            {!quote.qualifies && (
                <div className="flex shrink-0 items-center gap-1 pt-1" aria-hidden="true">
                    {Array.from({ length: rule.buy }, (_, i) => (
                        <span key={i} className={cx("h-1.5 w-5 rounded-full", i < rule.buy - quote.remaining ? "bg-brand-solid" : "bg-quaternary")} />
                    ))}
                </div>
            )}
        </div>
    );
};
