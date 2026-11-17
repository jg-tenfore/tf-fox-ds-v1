"use client";

import type { ReactNode } from "react";
import { AlertTriangle, ArrowRight, Calendar, MarkerPin01, RefreshCcw01, Ticket02, Users01 } from "@untitledui/icons";
import { Radio as AriaRadio, RadioGroup as AriaRadioGroup } from "react-aria-components";
import { Badge } from "@/components/base/badges/badges";
import { Toggle } from "@/components/base/toggle/toggle";
import { McgPage, McgShell } from "@/components/mcg-3/mcg-chrome";
import { cx } from "@/utils/cx";
import {
    INSTRUCTION_TODAY,
    SUBSCRIPTIONS,
    addDays,
    courseName,
    creditsHref,
    dateOfIso,
    expiryIfBoughtToday,
    isoOf,
    money0,
    packagesHref,
    serviceById,
    servicePrice,
    subscriptionForCoach,
    type LessonPackage,
    type LessonSubscription,
} from "../data";
import { CourseChip, LinkButton, MetaLine, focusRing } from "../kit";
import { InstructionLink, useInstructionQuery } from "../nav";
import { CreditsExplainer } from "./credits-explainer";
import { ConceptBadge, planSaving } from "./monthly-plan-card";
import { PackBadge, packHref, packSaving } from "./pack-card";
import { plansHref } from "./packages-page";
import { BackLink, Fact, MicroLabel, PackCoachAvatar, Panel, PolicyList, SavingNote, coachFor, useByLabel } from "./packages-ui";

/* ---------- Shared layout: main column + sticky price aside (bottom bar on mobile) ---------- */

export const DetailLayout = ({ back, main, aside, bar }: { back: ReactNode; main: ReactNode; aside: ReactNode; bar?: ReactNode }) => (
    <McgShell>
        <McgPage width="6xl">
            <BackSlot>{back}</BackSlot>
            <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
                <div className="flex min-w-0 flex-col gap-6">{main}</div>
                <aside className="flex flex-col gap-4 lg:sticky lg:top-6 lg:self-start">{aside}</aside>
            </div>
            {bar && <div className="sticky bottom-0 z-20 -mx-6 mt-6 flex items-center gap-4 border-t border-secondary bg-primary px-6 pt-3 pb-4 sm:-mx-8 sm:px-8 lg:hidden">{bar}</div>}
        </McgPage>
    </McgShell>
);

const BackSlot = ({ children }: { children: ReactNode }) => <div className="flex">{children}</div>;

const Card = ({ children, className }: { children: ReactNode; className?: string }) => (
    <section className={cx("flex flex-col gap-5 rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset md:p-6", className)}>{children}</section>
);

const CoachHeader = ({ coachId, title, badge, subtitle }: { coachId: string; title: ReactNode; badge?: ReactNode; subtitle: ReactNode }) => {
    const coach = coachFor(coachId);
    return (
        <div className="flex items-start gap-4">
            <PackCoachAvatar coach={coach} size="lg" />
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                    <h1 className="text-display-xs font-semibold text-primary">{title}</h1>
                    {badge}
                </div>
                <p className="text-md text-tertiary">{subtitle}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                    {coach.courseSlugs.map((slug) => (
                        <CourseChip key={slug} slug={slug} className="h-8 text-xs" />
                    ))}
                </div>
            </div>
        </div>
    );
};

const PriceBlock = ({ label, price, list, suffix }: { label: string; price: number; list: number; suffix?: string }) => (
    <div className="flex items-end justify-between gap-3">
        <div className="flex flex-col">
            <MicroLabel>{label}</MicroLabel>
            <span className="text-display-sm font-semibold text-primary tabular-nums">
                {money0(price)}
                {suffix && <span className="text-md font-medium text-tertiary">{suffix}</span>}
            </span>
        </div>
        {list > price && <span className="pb-1.5 text-md text-quaternary line-through tabular-nums">{money0(list)}</span>}
    </div>
);

/* ---------- Pack detail ---------- */

/**
 * `/instruction/packages?pack=<id>` — a pack as a product ("Package details"): what's included,
 * how it works, restrictions, the fine print as fields, and the price with its saving.
 * Assigned packs (the Thrive import) show their terms but can't be bought.
 */
export const PackDetailPage = ({ pack }: { pack: LessonPackage }) => {
    const coach = coachFor(pack.coachId);
    const service = serviceById(pack.appliesToServiceId);
    const { single, pct } = packSaving(pack);
    const assigned = pack.availability === "assigned";
    const plan = subscriptionForCoach(pack.coachId);
    const where = coach.courseSlugs.length === 1 ? courseName(coach.courseSlugs[0]) : `${coach.courseSlugs.length} MCG courses`;

    return (
        <DetailLayout
            back={<BackLink href={assigned ? creditsHref() : packagesHref()}>{assigned ? "My lesson credits" : "All packages"}</BackLink>}
            main={
                <>
                    <Card>
                        <CoachHeader
                            coachId={pack.coachId}
                            title={pack.label}
                            badge={
                                assigned ? (
                                    <Badge color="gray" size="sm" type="pill-color">
                                        Assigned
                                    </Badge>
                                ) : (
                                    pack.badge && <PackBadge>{pack.badge}</PackBadge>
                                )
                            }
                            subtitle={
                                <>
                                    with {coach.name} · {coach.title}
                                </>
                            }
                        />
                        <div className="grid grid-cols-1 gap-3 border-t border-secondary pt-5 md:grid-cols-3">
                            <Fact label="Lessons" value={pack.credits} sub={service ? `${service.durationMin}-minute privates` : undefined} />
                            {assigned ? (
                                <>
                                    <Fact label="Issued by" value="The Academy" sub="Carried over from Thrive" />
                                    <Fact label="Price" value="—" sub="Not sold online" />
                                </>
                            ) : (
                                <>
                                    <Fact label="Per lesson" value={money0(pack.perLessonPrice)} sub={`Normally ${money0(single)}`} />
                                    <Fact label="You save" value={money0(pack.savings)} sub={`${pct}% off`} />
                                </>
                            )}
                        </div>
                    </Card>

                    <Card>
                        <PolicyList title="How it works" items={pack.howItWorks} />
                        <div className="border-t border-secondary pt-5">
                            <PolicyList title="What's included" items={pack.included} />
                        </div>
                        <div className="border-t border-secondary pt-5">
                            <PolicyList title="Restrictions" items={pack.restrictions} tone="limit" />
                        </div>
                    </Card>

                    <Card>
                        <div>
                            <h2 className="text-lg font-semibold text-primary">The fine print</h2>
                            <p className="mt-1 text-md text-tertiary">Stated before you buy, where it&rsquo;s easy to check.</p>
                        </div>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                            <Fact
                                label="Expires"
                                value={pack.expiration === "No expiration" ? "Never" : "1 year"}
                                sub={pack.expiration === "No expiration" ? pack.expiration : `After purchase · ${expiryIfBoughtToday()} if bought today`}
                            />
                            <Fact label="Transferable" value={pack.transferable ? "Yes" : "No"} sub={pack.transferable ? "Shareable with family" : "This golfer only"} />
                            <Fact label="Valid with" value="1 pro" sub={coach.name} />
                        </div>
                        <div className="flex items-start gap-2.5 rounded-xl bg-warning-primary px-4 py-3">
                            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-fg-warning-primary" aria-hidden="true" />
                            <p className="text-sm text-warning-primary">
                                <span className="font-semibold">Still open for MCG:</span> what happens to a balance if the instructor leaves. Every other term above is a field the
                                Academy sets per package.
                            </p>
                        </div>
                    </Card>

                    <CreditsExplainer />
                </>
            }
            aside={
                <Panel bodyClassName="flex flex-col gap-4 p-5">
                    {assigned ? (
                        <>
                            <MicroLabel>Assigned by the Academy</MicroLabel>
                            <p className="text-md text-tertiary">
                                This balance was carried over from MCG&rsquo;s previous booking system. It never appears in the catalog — there&rsquo;s nothing to buy.
                            </p>
                            <LinkButton href={creditsHref()} variant="filled" className="w-full">
                                See my credits
                            </LinkButton>
                        </>
                    ) : (
                        <>
                            <PriceBlock label="Package price" price={pack.price} list={pack.listPrice} />
                            <SavingNote>
                                {money0(pack.savings)} cheaper than booking {pack.credits} lessons one at a time.
                            </SavingNote>
                            <div className="hidden lg:block">
                                <LinkButton href={packHref(pack.id, "checkout")} variant="filled" size="lg" iconTrailing={ArrowRight} className="w-full">
                                    Buy this package
                                </LinkButton>
                            </div>
                            <LinkButton href={plan ? packHref(plan.id) : plansHref()} iconLeading={RefreshCcw01} className="w-full">
                                Compare with a monthly plan
                            </LinkButton>
                        </>
                    )}
                    <div className="flex flex-col gap-2 border-t border-secondary pt-4">
                        <MetaLine icon={Calendar}>{useByLabel(pack.expiration)}</MetaLine>
                        <MetaLine icon={Users01}>{pack.transferable ? "Transferable" : "One golfer per credit"}</MetaLine>
                        <MetaLine icon={MarkerPin01}>{where}</MetaLine>
                    </div>
                </Panel>
            }
            bar={
                assigned ? undefined : (
                    <>
                        <div className="flex min-w-0 flex-1 flex-col">
                            <span className="text-xl font-bold text-primary tabular-nums">{money0(pack.price)}</span>
                            <span className="text-xs text-tertiary">{money0(pack.perLessonPrice)} per lesson</span>
                        </div>
                        <LinkButton href={packHref(pack.id, "checkout")} variant="filled">
                            Buy package
                        </LinkButton>
                    </>
                )
            }
        />
    );
};

/* ---------- Monthly plan detail ---------- */

/** `renew=0` turns auto-renew off (default on). */
export const RENEW_PARAM = "renew";

/** The three start dates offered: next Monday-ish choices from today. */
export const planStartOptions = () => [3, 10, 17].map((n) => isoOf(addDays(INSTRUCTION_TODAY, n)));
export const dayLabel = (iso: string) => dateOfIso(iso).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
export const longDayLabel = (iso: string) => dateOfIso(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

/** The plan selections carried in the URL (`date`, `renew`). */
export const usePlanSelection = () => {
    const { query, setQuery } = useInstructionQuery();
    const options = planStartOptions();
    const start = query.date && options.includes(query.date) ? query.date : options[0];
    const autoRenew = query.extra[RENEW_PARAM] !== "0";
    const setStart = (date: string) => setQuery({ date }, { replace: true });
    const setAutoRenew = (on: boolean) => {
        const extra = { ...query.extra };
        if (on) delete extra[RENEW_PARAM];
        else extra[RENEW_PARAM] = "0";
        setQuery({ extra }, { replace: true });
    };
    return { start, autoRenew, options, setStart, setAutoRenew, query };
};

/** Single-choice pills (Crane's `ChoicePills`) on a react-aria radio group. */
const ChoicePills = ({ label, options, value, onChange }: { label: string; options: { id: string; label: string }[]; value: string; onChange: (id: string) => void }) => (
    <AriaRadioGroup aria-label={label} value={value} onChange={onChange} orientation="horizontal" className="flex flex-wrap gap-2">
        {options.map((o) => (
            <AriaRadio
                key={o.id}
                value={o.id}
                className={cx(
                    "inline-flex h-10 cursor-pointer items-center rounded-full px-4 text-sm font-semibold ring-1 transition duration-100 ease-linear ring-inset",
                    "bg-primary text-secondary ring-secondary hover:bg-primary_hover",
                    "data-[selected]:bg-brand-solid data-[selected]:text-white data-[selected]:ring-transparent",
                    "data-[focus-visible]:ring-4 data-[focus-visible]:ring-brand-300/60",
                )}
            >
                {o.label}
            </AriaRadio>
        ))}
    </AriaRadioGroup>
);

/**
 * `/instruction/packages?pack=<plan id>` — a monthly plan ("Model C — a monthly lesson plan"):
 * what you get, how billing works, a start date and auto-renew, then the same checkout as a pack.
 */
export const PlanDetailPage = ({ plan }: { plan: LessonSubscription }) => {
    const coach = coachFor(plan.coachId);
    const service = serviceById(plan.appliesToServiceId);
    const { perLesson, saved } = planSaving(plan);
    const { start, autoRenew, options, setStart, setAutoRenew } = usePlanSelection();
    const checkout = packagesHref({ pack: plan.id, step: "checkout", date: start, extra: autoRenew ? {} : { [RENEW_PARAM]: "0" } });

    return (
        <DetailLayout
            back={<BackLink href={plansHref()}>Monthly plans</BackLink>}
            main={
                <>
                    <Card>
                        <CoachHeader
                            coachId={plan.coachId}
                            title={plan.label}
                            badge={<ConceptBadge />}
                            subtitle={
                                <>
                                    with {coach.name} · {service?.name ?? "Private lesson"}
                                </>
                            }
                        />
                        <div className="grid grid-cols-1 gap-3 border-t border-secondary pt-5 md:grid-cols-3">
                            <Fact label="Each month" value={plan.lessonsPerMonth} sub={service ? `${service.durationMin}-minute privates` : undefined} />
                            <Fact label="Per lesson" value={money0(perLesson)} sub={`Normally ${money0(service ? servicePrice(service, coach, 1) : perLesson)}`} />
                            <Fact label="You save" value={money0(saved)} sub="every month" />
                        </div>
                    </Card>

                    <Card>
                        <PolicyList title="What you get" items={plan.perks} />
                        <div className="border-t border-secondary pt-5">
                            <PolicyList title="How billing works" items={plan.obligations} tone="limit" />
                        </div>
                    </Card>

                    <Card>
                        <h2 className="text-lg font-semibold text-primary">Start your plan</h2>
                        <div className="flex flex-col gap-2">
                            <span className="text-sm font-medium text-secondary">First billing date</span>
                            <ChoicePills label="First billing date" options={options.map((iso) => ({ id: iso, label: dayLabel(iso) }))} value={start} onChange={setStart} />
                        </div>
                        <div className="flex items-center justify-between gap-4 rounded-xl bg-secondary px-4 py-3">
                            <span className="flex flex-col">
                                <span className="text-md font-medium text-primary">Auto-renew each month</span>
                                <span className="text-sm text-tertiary">
                                    {autoRenew
                                        ? `Renews monthly. You're notified ${plan.renewalNoticeDays} days before each renewal and can cancel anytime from your account.`
                                        : "One month only. The plan ends after the first cycle and nothing further is charged."}
                                </span>
                            </span>
                            <Toggle size="md" isSelected={autoRenew} onChange={setAutoRenew} aria-label="Auto-renew each month" />
                        </div>
                    </Card>

                    <Card>
                        <div>
                            <h2 className="text-lg font-semibold text-primary">What MCG carries</h2>
                            <p className="mt-1 text-md text-tertiary">Why a plan sits between a pack and a volume discount.</p>
                        </div>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                            <Fact label="Liability" value="$0" sub="Nothing prepaid past this cycle" />
                            <Fact label="Cash up front" value={money0(plan.monthlyPrice)} sub="Every month, not once" />
                            <Fact label="Commitment" value="Rolling" sub="Cancel anytime" />
                        </div>
                    </Card>
                </>
            }
            aside={
                <Panel bodyClassName="flex flex-col gap-4 p-5">
                    <PriceBlock label="Per month" price={plan.monthlyPrice} list={plan.listMonthly} />
                    <SavingNote>
                        {money0(saved)} a month cheaper than booking {plan.lessonsPerMonth} lessons one at a time.
                    </SavingNote>
                    <div className="hidden lg:block">
                        <LinkButton href={checkout} variant="filled" size="lg" className="w-full">
                            Start {money0(plan.monthlyPrice)}/month
                        </LinkButton>
                    </div>
                    <div className="flex flex-col gap-2 border-t border-secondary pt-4">
                        <MetaLine icon={RefreshCcw01}>{autoRenew ? "Auto-renews monthly" : "Single month"}</MetaLine>
                        <MetaLine icon={Calendar}>First charge {dayLabel(start)}</MetaLine>
                        <MetaLine icon={Users01}>One golfer per lesson</MetaLine>
                    </div>
                    {SUBSCRIPTIONS.length > 1 && (
                        <div className="flex flex-col gap-2 border-t border-secondary pt-4">
                            <MicroLabel>Other plans</MicroLabel>
                            {SUBSCRIPTIONS.filter((s) => s.id !== plan.id).map((s) => (
                                <InstructionLink
                                    key={s.id}
                                    href={packHref(s.id)}
                                    className={cx(
                                        "flex items-center justify-between gap-3 rounded-lg bg-primary px-3.5 py-2.5 ring-1 ring-primary transition duration-100 ease-linear ring-inset hover:bg-primary_hover",
                                        focusRing,
                                    )}
                                >
                                    <span className="flex min-w-0 flex-col items-start">
                                        <span className="truncate text-sm font-semibold text-primary">{s.label}</span>
                                        <span className="text-xs text-tertiary">with {coachFor(s.coachId).name}</span>
                                    </span>
                                    <span className="text-md font-semibold text-primary tabular-nums">{money0(s.monthlyPrice)}</span>
                                </InstructionLink>
                            ))}
                        </div>
                    )}
                    <InstructionLink
                        href={packagesHref({ coach: plan.coachId })}
                        className={cx("flex items-center gap-1.5 rounded text-sm font-semibold text-brand-secondary hover:underline", focusRing)}
                    >
                        <Ticket02 className="size-4" aria-hidden="true" />
                        Prefer to pay once? See {coach.name}&rsquo;s packs
                    </InstructionLink>
                </Panel>
            }
            bar={
                <>
                    <div className="flex min-w-0 flex-1 flex-col">
                        <span className="text-xl font-bold text-primary tabular-nums">
                            {money0(plan.monthlyPrice)}
                            <span className="text-sm font-medium text-tertiary">/month</span>
                        </span>
                        <span className="text-xs text-tertiary">First charge {dayLabel(start)}</span>
                    </div>
                    <LinkButton href={checkout} variant="filled">
                        Start plan
                    </LinkButton>
                </>
            }
        />
    );
};
