/**
 * Registration rules — who can sign up for a clinic or lesson, what they're asked, and
 * the buy-several discount.
 *
 * Fox's Instructions & Clinics tool already lets a course set all four on a clinic
 * (fox.tenfore.golf/dunes/clinics): an age range, a gender limit, custom questions at
 * sign-up, and "Buy 3 get 50% off". The MCG prototype had none of them — a clinic was a
 * quantity stepper and a lesson only asked juniors for an age. This module is the one
 * definition both clinics (`events-catalog.ts`) and lessons (`instruction-catalog.ts`)
 * hang their rules on, so the two sign-up paths can't drift apart.
 *
 * Pure data and pure functions: no React, no imports. The UI lives in
 * `registration/registration-ui.tsx`.
 */

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type Gender = "female" | "male" | "non-binary";

export const GENDER_LABEL: Record<Gender, string> = {
    female: "Female",
    male: "Male",
    "non-binary": "Non-binary",
};

export interface AgeRange {
    min?: number;
    max?: number;
}

export type QuestionType = "text" | "choice" | "yes-no";

export interface CustomQuestion {
    id: string;
    label: string;
    type: QuestionType;
    /** For `choice`. */
    options?: string[];
    required: boolean;
    hint?: string;
    /**
     * `golfer` asks it once for every person signed up (shirt size); `booking` asks it
     * once for the whole registration (how did you hear about us).
     */
    per: "golfer" | "booking";
}

/**
 * "Buy 3, get 50% off". Applies to sessions of the **same** clinic: once a golfer has
 * `buy` or more sessions selected, every selected session is `percentOff` off.
 */
export interface MultiBuyDiscount {
    buy: number;
    percentOff: number;
}

export interface RegistrationRules {
    /** Checked against date of birth, as of the first session. */
    age?: AgeRange;
    /** Who may register. Omit for anyone. */
    genders?: Gender[];
    /** Display name for the gender limit, e.g. "Girls", "Women". */
    genderLabel?: string;
    questions?: CustomQuestion[];
    /** Fox's "Equipment Provided" flag. */
    equipmentProvided?: boolean;
    multiBuy?: MultiBuyDiscount;
}

/** What a registration collects about one golfer, beyond name and contact. */
export interface EligibilityAnswers {
    /** ISO yyyy-mm-dd. */
    birthDate?: string;
    gender?: Gender | "";
    /** Custom question answers, keyed by question id. */
    answers?: Record<string, string>;
}

/* ------------------------------------------------------------------ */
/* Labels                                                              */
/* ------------------------------------------------------------------ */

/** "Ages 7–16", "Ages 55+", "Under 18", or null for no limit. */
export const ageRangeLabel = (age?: AgeRange): string | null => {
    if (!age || (age.min === undefined && age.max === undefined)) return null;
    if (age.min !== undefined && age.max !== undefined) return `Ages ${age.min}–${age.max}`;
    if (age.min !== undefined) return `Ages ${age.min}+`;
    return `Ages ${age.max} and under`;
};

export const genderLimitLabel = (rules: RegistrationRules): string | null => {
    if (!rules.genders?.length) return null;
    return rules.genderLabel ?? rules.genders.map((g) => GENDER_LABEL[g]).join(" or ");
};

export const multiBuyLabel = (rule: MultiBuyDiscount) => `Buy ${rule.buy}, get ${rule.percentOff}% off`;

export const multiBuyDetail = (rule: MultiBuyDiscount) => `${rule.percentOff}% off every session once you choose ${rule.buy} or more`;

/** True when the rules ask anything beyond name and contact. */
export const collectsEligibility = (rules?: RegistrationRules) => Boolean(rules?.age || rules?.genders?.length);

/* ------------------------------------------------------------------ */
/* Eligibility                                                         */
/* ------------------------------------------------------------------ */

const parseIso = (iso: string) => {
    const [y, m, d] = iso.split("-").map(Number);
    return { y, m, d };
};

/** Whole years old on `asOfIso`. */
export const ageOn = (birthIso: string, asOfIso: string): number => {
    const b = parseIso(birthIso);
    const a = parseIso(asOfIso);
    let years = a.y - b.y;
    if (a.m < b.m || (a.m === b.m && a.d < b.d)) years -= 1;
    return years;
};

export interface EligibilityResult {
    ok: boolean;
    /** Something required hasn't been filled in yet — not a rejection. */
    incomplete: boolean;
    /** Plain-English reasons this golfer can't register. */
    problems: string[];
}

/**
 * Can this golfer register?
 *
 * Out-of-range ages and genders are **blocked**, not warned: the Academy can't take the
 * booking, so letting it through only moves the problem to a refund phone call.
 */
export const checkEligibility = (rules: RegistrationRules | undefined, who: EligibilityAnswers, asOfIso: string, name = "This golfer"): EligibilityResult => {
    const problems: string[] = [];
    let incomplete = false;
    if (!rules) return { ok: true, incomplete, problems };

    if (rules.age) {
        if (!who.birthDate) {
            incomplete = true;
        } else {
            const age = ageOn(who.birthDate, asOfIso);
            const { min, max } = rules.age;
            if ((min !== undefined && age < min) || (max !== undefined && age > max)) {
                problems.push(`${name} will be ${age} at the first session. This is for ${ageRangeLabel(rules.age)?.toLowerCase()}.`);
            }
        }
    }

    if (rules.genders?.length) {
        if (!who.gender) {
            incomplete = true;
        } else if (!rules.genders.includes(who.gender)) {
            problems.push(`This is limited to ${genderLimitLabel(rules)?.toLowerCase()} golfers.`);
        }
    }

    for (const q of rules.questions ?? []) {
        if (q.per === "golfer" && q.required && !who.answers?.[q.id]?.trim()) incomplete = true;
    }

    return { ok: problems.length === 0 && !incomplete, incomplete, problems };
};

/** Required booking-level questions still unanswered. */
export const missingBookingAnswers = (rules: RegistrationRules | undefined, answers: Record<string, string>): CustomQuestion[] =>
    (rules?.questions ?? []).filter((q) => q.per === "booking" && q.required && !answers[q.id]?.trim());

/* ------------------------------------------------------------------ */
/* Multi-buy                                                           */
/* ------------------------------------------------------------------ */

export interface MultiBuyQuote {
    subtotal: number;
    discount: number;
    total: number;
    qualifies: boolean;
    /** Sessions still to choose before the discount applies (0 once it does). */
    remaining: number;
}

/** Price `count` sessions at `unit` each under a multi-buy rule. */
export const quoteMultiBuy = (unit: number, count: number, rule?: MultiBuyDiscount): MultiBuyQuote => {
    const subtotal = unit * count;
    if (!rule || count === 0) return { subtotal, discount: 0, total: subtotal, qualifies: false, remaining: rule ? rule.buy : 0 };
    const qualifies = count >= rule.buy;
    const discount = qualifies ? Math.round(subtotal * rule.percentOff) / 100 : 0;
    return { subtotal, discount, total: subtotal - discount, qualifies, remaining: Math.max(0, rule.buy - count) };
};

/**
 * The nudge line Fox shows under the session table: "Select 3 more clinics to earn
 * your discount". Null once the discount applies.
 */
export const multiBuyNudge = (quote: MultiBuyQuote, rule: MultiBuyDiscount): string | null =>
    quote.qualifies ? null : `Choose ${quote.remaining} more ${quote.remaining === 1 ? "session" : "sessions"} to get ${rule.percentOff}% off`;

/** The minimum shape of a cart line the multi-buy total needs. */
export interface MultiBuyLine {
    unitPrice: number;
    qty: number;
    multiBuy?: MultiBuyDiscount & { groupId: string; groupName: string };
}

export interface MultiBuyGroup {
    groupId: string;
    groupName: string;
    rule: MultiBuyDiscount;
    quote: MultiBuyQuote;
}

/**
 * Every multi-buy group in a cart, with what it currently earns.
 *
 * Each session is its own cart line, and the rule counts **sessions** — so a line
 * counts once however many places it holds. Two places on one Saturday is still one
 * session toward "buy 3".
 */
export const cartMultiBuyGroups = (lines: MultiBuyLine[]): MultiBuyGroup[] => {
    const groups = new Map<string, { name: string; rule: MultiBuyDiscount; count: number; subtotal: number }>();
    for (const line of lines) {
        if (!line.multiBuy) continue;
        const g = groups.get(line.multiBuy.groupId) ?? { name: line.multiBuy.groupName, rule: line.multiBuy, count: 0, subtotal: 0 };
        g.count += 1;
        g.subtotal += line.unitPrice * line.qty;
        groups.set(line.multiBuy.groupId, g);
    }
    return [...groups.entries()].map(([groupId, g]) => {
        const qualifies = g.count >= g.rule.buy;
        const discount = qualifies ? Math.round(g.subtotal * g.rule.percentOff) / 100 : 0;
        return {
            groupId,
            groupName: g.name,
            rule: { buy: g.rule.buy, percentOff: g.rule.percentOff },
            quote: { subtotal: g.subtotal, discount, total: g.subtotal - discount, qualifies, remaining: Math.max(0, g.rule.buy - g.count) },
        };
    });
};

/** Total multi-buy savings across a cart. */
export const cartMultiBuySavings = (lines: MultiBuyLine[]): number => cartMultiBuyGroups(lines).reduce((n, g) => n + g.quote.discount, 0);
