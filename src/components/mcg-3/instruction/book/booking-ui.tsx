"use client";

import { useState, type FC, type ReactNode } from "react";
import { ArrowLeft, CheckCircle, ChevronDown, Lock01, Tag01, Ticket02 } from "@untitledui/icons";
import {
    Button as AriaButton,
    Radio as AriaRadio,
    RadioGroup as AriaRadioGroup,
    ToggleButton as AriaToggleButton,
    ToggleButtonGroup as AriaToggleButtonGroup,
    type Key,
} from "react-aria-components";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { RadioButtonBase } from "@/components/base/radio-buttons/radio-buttons";
import { TextArea } from "@/components/base/textarea/textarea";
import { McgShell } from "@/components/mcg-3/mcg-chrome";
import { useSession } from "@/components/mcg-3/session";
import { cx } from "@/utils/cx";
import { ageOn, ageRangeLabel, money, PROMOS, USER, type CustomQuestion, type EligibilityResult, type RegistrationRules } from "../data";
import { caps, focusRing, StepRail, type RailStep } from "../kit";
import { InstructionLink } from "../nav";
import { Notice, Panel } from "./booking-parts";
import { DEFAULT_CARD, paymentById, SAVED_PAYMENTS } from "./saved-payments";

export { DEFAULT_CARD };

/* ------------------------------------------------------------------ */
/* Page layout: header, rail, main column + summary aside, mobile bar  */
/* ------------------------------------------------------------------ */

export interface BookingLayoutProps {
    back: { href: string; label: string };
    eyebrow: string;
    title: ReactNode;
    subtitle?: ReactNode;
    rail?: { steps: RailStep[]; current: number; onStep?: (id: string) => void };
    children: ReactNode;
    /** The summary panel (desktop: sticky aside; mobile/tablet: collapsible at the top). */
    summary: ReactNode;
    /** Summary title and one-liner for the collapsed mobile panel. */
    summaryTitle: string;
    summaryLine: ReactNode;
    /** Price shown in the collapsed mobile summary and the sticky bar. */
    price: ReactNode;
    /** Under the price in the sticky bar ("Due today", "Held for you"). */
    priceNote?: ReactNode;
    /** Primary action: in the aside on desktop, pinned to the bottom on mobile/tablet. */
    action?: ReactNode;
    /** Small print under the desktop action. */
    actionNote?: ReactNode;
}

/** Page header in Fox type: back link, eyebrow, title, subtitle. */
export const BookingHeader = ({ back, eyebrow, title, subtitle }: { back?: ReactNode; eyebrow?: ReactNode; title: ReactNode; subtitle?: ReactNode }) => (
    <div className="flex flex-col gap-1">
        {back && <div className="mb-3">{back}</div>}
        {eyebrow && <div className={cx(caps, "text-brand-secondary")}>{eyebrow}</div>}
        <h1 className="text-display-xs font-semibold text-primary md:text-display-sm">{title}</h1>
        {subtitle && <p className="mt-1 max-w-3xl text-md text-tertiary">{subtitle}</p>}
    </div>
);

/** A back link: arrow + label, brand green. */
export const BackLink = ({ href, label }: { href: string; label: string }) => (
    <InstructionLink href={href} className={cx("inline-flex items-center gap-1.5 rounded text-sm font-semibold text-brand-secondary hover:underline", focusRing)}>
        <ArrowLeft className="size-4" aria-hidden="true" /> {label}
    </InstructionLink>
);

/**
 * The tee-time checkout layout, for a lesson or a program: page header with a back link, the step
 * rail, the step's content on the left and a sticky "Lesson summary" on the right (desktop). Under
 * 1024 the summary collapses into a panel at the top and the action pins to the bottom with the
 * total — the tee-time checkout's mobile pattern.
 */
export const BookingLayout = ({ back, eyebrow, title, subtitle, rail, children, summary, summaryTitle, summaryLine, price, priceNote, action, actionNote }: BookingLayoutProps) => {
    const [open, setOpen] = useState(false);
    return (
        <McgShell>
            <div className={cx("mx-auto w-full max-w-7xl px-6 py-8 sm:px-8", action ? "pb-28 lg:pb-16" : undefined)}>
                <BookingHeader back={<BackLink {...back} />} eyebrow={eyebrow} title={title} subtitle={subtitle} />
                {rail && (
                    <div className="mt-6">
                        <StepRail {...rail} />
                    </div>
                )}
                <div className="mt-6 grid grid-cols-1 gap-6 lg:mt-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8">
                    <div className="flex min-w-0 flex-col gap-5">
                        <div className="lg:hidden">
                            <Panel>
                                <AriaButton aria-expanded={open} onPress={() => setOpen((o) => !o)} className={cx("flex w-full cursor-pointer items-center gap-3 px-5 py-4 text-left", focusRing)}>
                                    <span className="min-w-0 flex-1">
                                        <span className="block text-md font-semibold text-primary">{summaryTitle}</span>
                                        <span className="block truncate text-sm text-tertiary">{summaryLine}</span>
                                    </span>
                                    <span className="text-md font-semibold text-brand-secondary tabular-nums">{price}</span>
                                    <ChevronDown className={cx("size-5 text-fg-quaternary transition duration-100 ease-linear", open && "rotate-180")} aria-hidden="true" />
                                </AriaButton>
                                {open && <div className="border-t border-secondary">{summary}</div>}
                            </Panel>
                        </div>
                        {children}
                    </div>
                    <aside className="hidden flex-col gap-4 lg:sticky lg:top-6 lg:flex lg:self-start">
                        <Panel title={summaryTitle}>{summary}</Panel>
                        {action}
                        {actionNote && <div className="text-sm text-tertiary">{actionNote}</div>}
                    </aside>
                </div>
            </div>
            {action && (
                <div className="sticky bottom-0 z-20 border-t border-secondary bg-primary px-4 py-3 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] md:px-8 lg:hidden">
                    <div className="mx-auto flex max-w-7xl items-center gap-4">
                        <div className="min-w-0 flex-1">
                            <p className="text-lg font-semibold text-primary tabular-nums">{price}</p>
                            {priceNote && <p className="truncate text-sm text-tertiary">{priceNote}</p>}
                        </div>
                        <div className="flex-1 md:flex-none">{action}</div>
                    </div>
                </div>
            )}
        </McgShell>
    );
};

/** One block of the summary panel: a leading visual + lines + optional edit link. */
export const SummaryBlock = ({ lead, title, lines, edit }: { lead: ReactNode; title: ReactNode; lines?: ReactNode[]; edit?: { label: string; onPress: () => void } }) => (
    <div className="flex items-start gap-3 border-b border-secondary px-5 py-4 last:border-b-0">
        {lead}
        <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-md font-semibold text-primary">{title}</span>
            {lines?.filter(Boolean).map((l, i) => (
                <span key={i} className="text-sm text-tertiary">
                    {l}
                </span>
            ))}
        </div>
        {edit && (
            <AriaButton onPress={edit.onPress} aria-label={edit.label} className={cx("shrink-0 cursor-pointer rounded text-sm font-semibold text-brand-secondary hover:underline", focusRing)}>
                Change
            </AriaButton>
        )}
    </div>
);

/** A square icon tile for a summary block. */
export const IconTile = ({ icon: Icon }: { icon: FC<{ className?: string }> }) => (
    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
        <Icon className="size-5 text-fg-secondary" />
    </span>
);

/** Money rows at the foot of the summary. */
export const MoneyRow = ({ label, value, strong, tone }: { label: ReactNode; value: ReactNode; strong?: boolean; tone?: "success" | "muted" }) => (
    <div className={cx("flex items-start justify-between gap-4", strong ? "text-md" : "text-sm")}>
        <span className={cx("min-w-0", strong ? "font-semibold text-primary" : "text-tertiary")}>{label}</span>
        <span
            className={cx(
                "shrink-0 text-right tabular-nums",
                strong ? "font-semibold text-primary" : tone === "success" ? "font-medium text-success-primary" : tone === "muted" ? "text-quaternary" : "text-secondary",
            )}
        >
            {value}
        </span>
    </div>
);

export const MoneyBlock = ({ children }: { children: ReactNode }) => <div className="flex flex-col gap-2 px-5 py-4">{children}</div>;

/** A step's main panel: title row + body. */
export const StepPanel = ({ title, sub, right, children, id }: { title: ReactNode; sub?: ReactNode; right?: ReactNode; children?: ReactNode; id?: string }) => (
    <Panel bodyClassName="flex flex-col gap-4 px-5 py-5 md:px-6 md:py-6">
        <div id={id} className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 flex-col gap-1">
                <h2 className="text-lg font-semibold text-primary">{title}</h2>
                {sub && <p className="text-sm text-tertiary">{sub}</p>}
            </div>
            {right}
        </div>
        {children}
    </Panel>
);

/** Full-width primary action. */
export const PrimaryAction = ({
    children,
    onPress,
    isDisabled,
    isLoading,
    icon,
}: {
    children: ReactNode;
    onPress: () => void;
    isDisabled?: boolean;
    isLoading?: boolean;
    icon?: FC<{ className?: string }>;
}) => (
    <Button size="xl" onClick={onPress} isDisabled={isDisabled} isLoading={isLoading} showTextWhileLoading iconTrailing={icon} className="w-full">
        {children}
    </Button>
);

/** A quiet "Change" button for a review panel's header. */
export const EditLink = ({ children, onPress }: { children: string; onPress: () => void }) => (
    <Button size="sm" color="link-color" onClick={onPress}>
        {children}
    </Button>
);

/* ------------------------------------------------------------------ */
/* Form bits                                                           */
/* ------------------------------------------------------------------ */

export const WebTextArea = ({
    label,
    value,
    onChange,
    placeholder,
    hint,
    rows = 3,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    hint?: string;
    rows?: number;
}) => <TextArea label={label} value={value} onChange={onChange} placeholder={placeholder} hint={hint} rows={rows} />;

const pill = cx(
    "flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-primary px-3.5 text-sm font-medium whitespace-nowrap text-secondary ring-1 ring-secondary transition duration-100 ease-linear ring-inset hover:bg-primary_hover",
    focusRing,
);

/** Single-choice pills (questions, golfer count). Empty `value` = nothing chosen yet. */
export const Pills = ({
    label,
    options,
    value,
    onChange,
    hideLabel,
}: {
    label: string;
    options: { id: string; label: ReactNode }[];
    value: string;
    onChange: (id: string) => void;
    hideLabel?: boolean;
}) => (
    <div className="flex flex-col gap-2">
        {!hideLabel && <span className="text-sm font-medium text-secondary">{label}</span>}
        <AriaToggleButtonGroup
            aria-label={label}
            selectionMode="single"
            selectedKeys={value ? [value] : []}
            onSelectionChange={(keys: Set<Key>) => {
                const [k] = keys;
                if (k != null) onChange(String(k));
            }}
            className="flex flex-wrap gap-2"
        >
            {options.map((o) => (
                <AriaToggleButton
                    key={o.id}
                    id={o.id}
                    className={cx(pill, "data-[selected]:bg-brand-primary_alt data-[selected]:text-brand-secondary data-[selected]:ring-brand")}
                >
                    {o.label}
                </AriaToggleButton>
            ))}
        </AriaToggleButtonGroup>
    </div>
);

/** Multi-select pills (waitlist days / dayparts). */
export const MultiPills = ({ label, options, value, onChange }: { label: string; options: { id: string; label: ReactNode }[]; value: string[]; onChange: (ids: string[]) => void }) => (
    <AriaToggleButtonGroup
        aria-label={label}
        selectionMode="multiple"
        selectedKeys={value}
        onSelectionChange={(keys: Set<Key>) => onChange([...keys].map(String))}
        className="flex flex-wrap gap-2"
    >
        {options.map((o) => (
            <AriaToggleButton
                key={o.id}
                id={o.id}
                className={cx(pill, "min-w-12 justify-center font-semibold data-[selected]:bg-brand-solid data-[selected]:text-white data-[selected]:ring-transparent")}
            >
                {o.label}
            </AriaToggleButton>
        ))}
    </AriaToggleButtonGroup>
);

/** One custom registration question (`registration-rules.ts`). */
export const QuestionField = ({ question, value, onChange }: { question: CustomQuestion; value: string; onChange: (v: string) => void }) => {
    const label = `${question.label}${question.required ? "" : " (optional)"}`;
    if (question.type === "choice") return <Pills label={label} options={(question.options ?? []).map((o) => ({ id: o, label: o }))} value={value} onChange={onChange} />;
    if (question.type === "yes-no") return <Pills label={label} options={["Yes", "No"].map((o) => ({ id: o, label: o }))} value={value} onChange={onChange} />;
    return <Input label={question.label} value={value} onChange={onChange} hint={question.hint} isRequired={question.required} />;
};

/** Date of birth (when the rules have an age range) + per-golfer questions, with the eligibility verdict. */
export const EligibilityFields = ({
    rules,
    birthDate,
    answers,
    onBirthDate,
    onAnswer,
    asOf,
    result,
}: {
    rules?: RegistrationRules;
    birthDate?: string;
    answers?: Record<string, string>;
    onBirthDate: (v: string) => void;
    onAnswer: (id: string, v: string) => void;
    asOf: string;
    result?: EligibilityResult;
}) => {
    const per = (rules?.questions ?? []).filter((q) => q.per === "golfer");
    if (!rules?.age && per.length === 0) return null;
    return (
        <div className="flex flex-col gap-4">
            {rules?.age && (
                <Input
                    label="Date of birth"
                    type="date"
                    value={birthDate ?? ""}
                    onChange={onBirthDate}
                    isRequired
                    hint={birthDate ? `Age ${ageOn(birthDate, asOf)} on the day · ${ageRangeLabel(rules.age)}` : `${ageRangeLabel(rules.age)}, checked against the first session`}
                    className="max-w-xs"
                />
            )}
            {per.map((q) => (
                <QuestionField key={q.id} question={q} value={answers?.[q.id] ?? ""} onChange={(v) => onAnswer(q.id, v)} />
            ))}
            {result && result.problems.length > 0 && <Notice tone="error">{result.problems.join(" ")}</Notice>}
        </div>
    );
};

/* ------------------------------------------------------------------ */
/* Sign-in gate                                                        */
/* ------------------------------------------------------------------ */

/**
 * MCG: every booking is attached to an account, but browsing and choosing stay open — so the
 * account is settled here, inside the flow, and nothing chosen is lost. Signing in inline fills the
 * contact details through P3's prototype session (`useSession().signIn`); any credentials work.
 * (P3's full `/signin` page always lands on the account, so the gate doesn't send golfers there.)
 */
export const SignInGate = ({ what = "booking", onSignedIn }: { what?: string; onSignedIn: () => void }) => {
    const { user, signIn } = useSession();
    const [mode, setMode] = useState<"signin" | "create">("signin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [first, setFirst] = useState("");
    const [last, setLast] = useState("");
    const [busy, setBusy] = useState(false);

    if (user) {
        return (
            <div className="flex items-center gap-3 rounded-xl bg-success-primary p-4">
                <CheckCircle className="size-5 shrink-0 text-fg-success-primary" aria-hidden="true" />
                <p className="text-sm text-secondary">
                    Signed in as <span className="font-semibold text-primary">{user.email}</span> — this {what} is saved to your MCG account.
                </p>
            </div>
        );
    }

    const go = () => {
        setBusy(true);
        setTimeout(() => {
            signIn(mode === "create" && first.trim() ? { first: first.trim(), last: last.trim() || USER.lastName, email: email.trim(), isNew: true } : undefined);
            setBusy(false);
            onSignedIn();
        }, 500);
    };
    const ready = email.trim() && password.trim() && (mode === "signin" || first.trim());

    return (
        <Panel bodyClassName="flex flex-col gap-5 px-5 py-5 md:px-6 md:py-6">
            <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-primary_alt">
                    <Lock01 className="size-5 text-fg-brand-primary" aria-hidden="true" />
                </span>
                <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-semibold text-primary">Sign in to finish this {what}</h2>
                    <p className="text-sm text-tertiary">
                        Every {what} is saved to an MCG account, so your instructor, credits and history stay together. Your place is held — nothing you&rsquo;ve chosen is lost.
                    </p>
                </div>
            </div>

            <AriaToggleButtonGroup
                aria-label="Account"
                selectionMode="single"
                disallowEmptySelection
                selectedKeys={[mode]}
                onSelectionChange={(keys: Set<Key>) => {
                    const [k] = keys;
                    if (k) setMode(k as "signin" | "create");
                }}
                className="grid grid-cols-2 gap-1 rounded-lg bg-secondary p-1 ring-1 ring-secondary ring-inset"
            >
                {(
                    [
                        ["signin", "I have an account"],
                        ["create", "Create an account"],
                    ] as const
                ).map(([id, label]) => (
                    <AriaToggleButton
                        key={id}
                        id={id}
                        className={cx(
                            "h-9 cursor-pointer rounded-md text-sm font-semibold text-tertiary transition duration-100 ease-linear hover:text-secondary data-[selected]:bg-primary data-[selected]:text-primary data-[selected]:shadow-sm",
                            focusRing,
                        )}
                    >
                        {label}
                    </AriaToggleButton>
                ))}
            </AriaToggleButtonGroup>

            <div className="flex flex-col gap-4">
                {mode === "create" && (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Input label="First name" value={first} onChange={setFirst} isRequired />
                        <Input label="Last name" value={last} onChange={setLast} />
                    </div>
                )}
                <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={setEmail} isRequired />
                <Input label="Password" type="password" value={password} onChange={setPassword} isRequired />
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <Button size="lg" onClick={go} isDisabled={!ready} isLoading={busy} showTextWhileLoading>
                    {mode === "signin" ? "Sign in and continue" : "Create account and continue"}
                </Button>
                <span className="text-sm text-tertiary">Any email and password work in this prototype.</span>
            </div>
            <p className="text-xs text-tertiary">Booking for someone else? Sign in as yourself — their details are on the booking, and it still lands in your account.</p>
        </Panel>
    );
};

/* ------------------------------------------------------------------ */
/* Payment                                                             */
/* ------------------------------------------------------------------ */

export interface CreditOption {
    remaining: number;
    total: number;
    coachName: string;
    expiresOn?: string;
    /** Why it can't be used for this booking (shown, disabled). */
    blockedReason?: string;
}

/** A selectable payment row: Fox radio + content, tinted when selected (as in P3's shop checkout). */
const PayRow = ({ value, isDisabled, children }: { value: string; isDisabled?: boolean; children: ReactNode }) => (
    <AriaRadio
        value={value}
        isDisabled={isDisabled}
        className={({ isSelected }) =>
            cx(
                "group flex cursor-pointer items-start gap-3 rounded-xl px-4 py-3.5 ring-inset transition duration-100 ease-linear",
                "data-[focus-visible]:ring-4 data-[focus-visible]:ring-brand-300/60",
                "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
                isSelected ? "bg-brand-secondary ring-2 ring-brand" : "bg-primary ring-1 ring-secondary hover:bg-primary_hover",
            )
        }
    >
        {({ isSelected, isFocusVisible, isDisabled: off }) => (
            <>
                <RadioButtonBase size="md" isSelected={isSelected} isFocusVisible={isFocusVisible} isDisabled={off} className="mt-0.5" />
                <div className="min-w-0 flex-1">{children}</div>
            </>
        )}
    </AriaRadio>
);

/**
 * Payment methods: a lesson credit (when the golfer holds one for this instructor and lesson), and
 * the saved cards. Golfers always pay when they book — never by invoice, and there's no golfer-facing
 * "pay at the lesson" (decided Nov 17). Pay-at-lesson is an admin setting in Buck that starts off and
 * requires a saved card.
 */
export const PaymentOptions = ({ value, onChange, credit }: { value: string; onChange: (v: string) => void; credit?: CreditOption }) => {
    const { user } = useSession();
    const who = user ? `${user.first} ${user.last}` : `${USER.firstName} ${USER.lastName}`;
    return (
        <AriaRadioGroup aria-label="Payment method" value={value} onChange={onChange} className="flex flex-col gap-3">
            {credit && (
                <PayRow value="credit" isDisabled={!!credit.blockedReason}>
                    <span className="flex flex-wrap items-center gap-2">
                        <Ticket02 className="size-5 text-fg-brand-primary" aria-hidden="true" />
                        <span className="text-sm font-semibold text-primary">Use a lesson credit</span>
                        <Badge color="success" size="sm" type="pill-color">
                            {credit.remaining} left
                        </Badge>
                    </span>
                    <span className="mt-0.5 block text-sm text-tertiary">
                        {credit.blockedReason ??
                            `From your ${credit.total}-lesson pack with ${credit.coachName} — covers the lesson${credit.expiresOn ? ` · good through ${credit.expiresOn}` : ""}. The facility fee and any extras go on your card on file.`}
                    </span>
                </PayRow>
            )}
            {SAVED_PAYMENTS.filter((p) => !p.expired).map((p) => (
                <PayRow key={p.id} value={p.id}>
                    <span className="flex items-center gap-3">
                        <img src={p.logo} alt="" className="h-6 w-auto shrink-0" />
                        <span className="min-w-0 flex-1">
                            <span className="block text-sm font-semibold text-primary">
                                {p.name} ···· {p.last4}
                            </span>
                            <span className="block text-xs text-tertiary tabular-nums">
                                Expires {p.exp} · charged when you confirm · {who}
                            </span>
                        </span>
                        {p.id === DEFAULT_CARD && (
                            <Badge color="gray" size="sm" type="modern">
                                Default
                            </Badge>
                        )}
                    </span>
                </PayRow>
            ))}
        </AriaRadioGroup>
    );
};

export const paymentName = (pay: string) => {
    if (pay === "credit") return "Lesson credit";
    const p = paymentById(pay);
    return p ? `${p.name} ···· ${p.last4}` : "Card on file";
};

/** The card's brand mark for a `pay` id, if it's a saved card. */
export const paymentLogo = (pay: string) => paymentById(pay)?.logo;

/** Promo code field, checked against the Academy's codes (MCGJUNIOR, WELCOME10, MCGVET). */
export const PromoBox = ({ applied, onApply, onRemove, disabledReason }: { applied: string | null; onApply: (code: string) => void; onRemove: () => void; disabledReason?: string }) => {
    const [code, setCode] = useState("");
    const [error, setError] = useState<string | null>(null);
    if (disabledReason) return <p className="text-sm text-tertiary">{disabledReason}</p>;
    if (applied) {
        return (
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-3 rounded-lg bg-success-primary px-3 py-2.5">
                    <span className="flex min-w-0 items-center gap-2 text-sm font-semibold text-success-primary">
                        <Tag01 className="size-4 shrink-0" aria-hidden="true" />
                        <span className="truncate">{applied} applied</span>
                    </span>
                    <AriaButton
                        onPress={onRemove}
                        aria-label={`Remove ${applied}`}
                        className={cx("cursor-pointer rounded text-sm font-semibold text-secondary underline underline-offset-2", focusRing)}
                    >
                        Remove
                    </AriaButton>
                </div>
                <p className="text-sm text-success-primary">{PROMOS[applied]?.label}</p>
            </div>
        );
    }
    const apply = () => {
        const c = code.trim().toUpperCase();
        if (!c) return;
        if (PROMOS[c]) {
            setError(null);
            setCode("");
            onApply(c);
        } else setError(`${c} isn't a valid MCG Academy code. Try MCGJUNIOR, WELCOME10 or MCGVET.`);
    };
    return (
        <div className="flex flex-col gap-2">
            <form
                className="flex items-start gap-2"
                onSubmit={(e) => {
                    e.preventDefault();
                    apply();
                }}
            >
                <Input aria-label="Promo code" placeholder="Promo code" value={code} onChange={setCode} className="min-w-0 flex-1" />
                <Button type="submit" size="md" color="secondary" isDisabled={!code.trim()}>
                    Apply
                </Button>
            </form>
            {error && (
                <p role="alert" className="text-sm text-error-primary">
                    {error}
                </p>
            )}
        </div>
    );
};

export const moneyOrFree = (n: number) => money(n);
