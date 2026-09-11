/**
 * Flow B — Packages & Credits.
 *
 * Money taken today for lessons owed later. This is the piece MCG called the most
 * complex part of the whole build, and it exists to force one decision — now between
 * three options rather than two:
 *
 *   Model A — a credit book. Buy five lessons, a balance is created, and it's relieved
 *             one lesson at a time as they're taught. Matches how MCG relieves payroll
 *             today, and produces per-instructor liability.
 *   Model B — a volume discount. No pack is sold; lessons ring up at full price and the
 *             fifth is discounted once four are taken. No liability, no cash up front.
 *   Model C — a subscription. Billed monthly with auto-renew and a renewal notice.
 *             Nothing is prepaid beyond the current cycle, so no liability accrues, but
 *             unlike Model B it still produces predictable revenue and a commitment.
 *
 * Model C comes from the Sagamore prototype's resource-package step; so does the
 * howItWorks / included / restrictions structure on the pack detail, which turns the
 * policy questions MCG hasn't answered into fields instead of prose.
 */

import { useEffect, useRef, useState } from "react";
import {
    AlertTriangle,
    ArrowLeft,
    ArrowRight,
    Calendar,
    CheckCircle,
    Clock,
    CreditCard01,
    InfoCircle,
    MarkerPin01,
    RefreshCcw01,
    Ticket02,
    TrendUp02,
    Users01,
} from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { RadioButtonBase } from "@/components/base/radio-buttons/radio-buttons";
import { Toggle } from "@/components/base/toggle/toggle";
import { newId, useSession } from "@/components/mcg/session";
import { asset } from "@/utils/asset";
import { cx } from "@/utils/cx";
import {
    BALANCE_AFTER_REDEMPTION,
    COURSE_NAME,
    CREDIT_BALANCES,
    EDGE_BALANCES,
    GOLFER,
    MCG_GREEN,
    PACKAGES,
    PACKAGE_FILTERS,
    SUBSCRIPTIONS,
    VOLUME_PROGRESS,
    type LessonPackage,
    coachById,
    money,
    money0,
    onlinePackages,
    packageById,
    serviceById,
    servicePrice,
    subscriptionById,
} from "./instruction-catalog";
import {
    AcademyHero,
    CoachAvatar,
    CourseChip,
    CreditCardPanel,
    CreditPips,
    FilterChips,
    InstructionShell,
    MetaLine,
    MicroLabel,
    PolicyList,
    SavingNote,
    SectionTitle,
    SummaryLine,
} from "./instruction-ui";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type PackagesStep =
    | "browse"
    | "details"
    | "checkout"
    | "confirmation"
    | "wallet"
    | "redeem"
    | "after"
    | "volume-progress"
    | "volume-earned"
    | "subscription"
    | "assigned"
    | "expired";

export interface LessonPackagesFlowProps {
    step?: PackagesStep;
    packageId?: string;
    subscriptionId?: string;
}

/** The prototype's "today", matching the date the tee sheet opens on. */
const TODAY_LABEL = "June 19, 2026";

/* ------------------------------------------------------------------ */
/* Flow                                                                */
/* ------------------------------------------------------------------ */

export const LessonPackagesFlow = ({
    step: initialStep = "browse",
    packageId: initialPackageId = "mike-kenny--pack-5",
    subscriptionId: initialSubscriptionId = "mike-kenny--sub-2",
}: LessonPackagesFlowProps) => {
    const { addCredits } = useSession();

    const [step, setStep] = useState<PackagesStep>(initialStep);
    const [packageId, setPackageId] = useState(initialPackageId);
    const [filter, setFilter] = useState("all");
    const [redeemFrom, setRedeemFrom] = useState<string>(CREDIT_BALANCES[0].id);
    const [autoRenew, setAutoRenew] = useState(true);

    const pack = packageById(packageId)!;
    const coach = coachById(pack.coachId)!;
    const subscription = subscriptionById(initialSubscriptionId)!;

    /**
     * Drop the credits into the prototype session the first time the purchase
     * confirmation renders, so the wallet and My account agree with what was just
     * bought. Inert in Storybook, and keyed on the pack so buying a second one after
     * the first still registers.
     */
    const credited = useRef<string | null>(null);
    useEffect(() => {
        if (step !== "confirmation" || credited.current === pack.id) return;
        credited.current = pack.id;

        addCredits({
            id: newId("credit"),
            coachId: pack.coachId,
            packageId: pack.id,
            creditsTotal: pack.credits,
            creditsRemaining: pack.credits,
            valueRemaining: pack.price,
            purchasedOn: TODAY_LABEL,
            expiresOn: pack.expiration === "No expiration" ? undefined : pack.expiration,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [step, pack.id]);

    const openPack = (id: string) => {
        setPackageId(id);
        setStep("details");
    };

    /* ================================================================ */
    /* 1 — Browse packages                                              */
    /* ================================================================ */
    if (step === "browse") {
        const packs = onlinePackages();
        const visible = filter === "all" ? packs : packs.filter((p) => String(p.credits) === filter);
        const coachIds = Array.from(new Set(packs.map((p) => p.coachId)));

        return (
            <InstructionShell>
                <AcademyHero
                    title="Lesson packages"
                    blurb="Buy several lessons up front and pay less per lesson. Rates are set per instructor across the county, so packages are too — a pack is good with the instructor you bought it from."
                    right={
                        <div className="flex flex-wrap gap-3">
                            <Button size="lg" color="secondary" iconLeading={RefreshCcw01} onClick={() => setStep("subscription")}>
                                Monthly plans
                            </Button>
                            <Button size="lg" color="secondary" iconLeading={Ticket02} onClick={() => setStep("wallet")}>
                                My credits
                            </Button>
                        </div>
                    }
                />

                <div className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-8">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <SectionTitle sub={`${visible.length} packages from ${coachIds.length} instructors`}>Available packages</SectionTitle>
                        <FilterChips options={PACKAGE_FILTERS} value={filter} onChange={setFilter} />
                    </div>

                    <div className="mt-5 grid items-start gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {visible.map((p) => (
                            <PackageCard key={p.id} pack={p} onSelect={() => openPack(p.id)} />
                        ))}
                    </div>

                    <div className="mt-8 flex items-start gap-3 rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset">
                        <InfoCircle className="mt-0.5 size-5 shrink-0 text-fg-brand-primary" aria-hidden="true" />
                        <div className="flex flex-col gap-1">
                            <p className="text-sm font-semibold text-primary">Why packages are tied to an instructor</p>
                            <p className="max-w-3xl text-sm text-tertiary">
                                MCG sets rates per instructor — a teacher who stays full at a higher rate is priced there. Because the rate belongs to the person, so does the
                                package, and so does the credit you hold.
                            </p>
                        </div>
                    </div>
                </div>
            </InstructionShell>
        );
    }

    /* ================================================================ */
    /* 2 — Package details                                              */
    /* ================================================================ */
    if (step === "details") {
        const service = serviceById(pack.appliesToServiceId)!;
        const unit = servicePrice(service, coach, 1);

        return (
            <InstructionShell>
                <div className="mx-auto w-full max-w-5xl px-6 py-8 sm:px-8">
                    <Button size="sm" color="link-gray" iconLeading={ArrowLeft} onClick={() => setStep("browse")}>
                        All packages
                    </Button>

                    <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                        <div className="flex flex-col gap-6">
                            <section className="flex flex-col gap-5 rounded-2xl bg-primary p-6 ring-1 ring-secondary ring-inset">
                                <div className="flex flex-wrap items-start gap-4">
                                    <CoachAvatar coach={coach} size="lg" />
                                    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                                        <div className="flex flex-wrap items-center gap-2.5">
                                            <h1 className="text-display-xs font-semibold text-primary">{pack.label}</h1>
                                            {pack.badge && (
                                                <Badge color="brand" size="sm" type="pill-color">
                                                    {pack.badge}
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-md text-tertiary">
                                            with {coach.name} · {coach.title}
                                        </p>
                                        <div className="flex flex-wrap gap-1.5 pt-1">
                                            {coach.courseSlugs.map((slug) => (
                                                <CourseChip key={slug} slug={slug} />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-3 border-t border-secondary pt-5 sm:grid-cols-3">
                                    <Fact label="Lessons" value={String(pack.credits)} sub={`${service.durationMin}-minute privates`} />
                                    <Fact label="Per lesson" value={money0(pack.perLessonPrice)} sub={`Normally ${money0(unit)}`} />
                                    <Fact label="You save" value={money0(pack.savings)} sub={`${Math.round((pack.savings / pack.listPrice) * 100)}% off`} />
                                </div>
                            </section>

                            {/* The three copy blocks the prototype uses — policy as fields, not prose */}
                            <section className="flex flex-col gap-6 rounded-2xl bg-primary p-6 ring-1 ring-secondary ring-inset">
                                <PolicyList title="How it works" items={pack.howItWorks} tone="good" />
                                <div className="border-t border-secondary pt-6">
                                    <PolicyList title="What's included" items={pack.included} tone="good" />
                                </div>
                                <div className="border-t border-secondary pt-6">
                                    <PolicyList title="Restrictions" items={pack.restrictions} tone="limit" />
                                </div>
                            </section>

                            <section className="flex flex-col gap-4 rounded-2xl bg-primary p-6 ring-1 ring-secondary ring-inset">
                                <SectionTitle sub="The terms MCG has to set an Academy policy on. Stated here, before purchase, where they're cheap to answer.">
                                    The fine print, as data
                                </SectionTitle>
                                <div className="grid gap-3 sm:grid-cols-3">
                                    <Fact label="Expires" value={pack.expiration === "No expiration" ? "Never" : "Dec 31"} sub={pack.expiration} />
                                    <Fact label="Transferable" value={pack.transferable ? "Yes" : "No"} sub={pack.transferable ? "Shareable with family" : "This golfer only"} />
                                    <Fact label="Valid with" value="1 pro" sub={coach.name} />
                                </div>
                                <div className="flex items-start gap-2.5 rounded-xl bg-warning-secondary px-4 py-3">
                                    <AlertTriangle className="mt-0.5 size-4 shrink-0 text-fg-warning-secondary" aria-hidden="true" />
                                    <p className="text-sm text-warning-primary">
                                        <span className="font-semibold">Still open:</span> what happens to a balance if the instructor leaves MCG. Every other term above is now
                                        a field the Academy can set per package.
                                    </p>
                                </div>
                            </section>
                        </div>

                        <aside className="flex flex-col gap-4 rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset lg:sticky lg:top-6 lg:self-start">
                            <div className="flex items-end justify-between gap-3">
                                <div className="flex flex-col">
                                    <MicroLabel>Package price</MicroLabel>
                                    <span className="text-display-sm font-semibold text-primary tabular-nums">{money0(pack.price)}</span>
                                </div>
                                <span className="pb-1.5 text-md text-tertiary line-through tabular-nums">{money0(pack.listPrice)}</span>
                            </div>
                            <SavingNote>
                                {money0(pack.savings)} cheaper than booking {pack.credits} lessons one at a time.
                            </SavingNote>
                            <Button size="lg" color="primary" iconTrailing={ArrowRight} onClick={() => setStep("checkout")}>
                                Buy this package
                            </Button>
                            <Button size="md" color="secondary" iconLeading={RefreshCcw01} onClick={() => setStep("subscription")}>
                                Compare with a monthly plan
                            </Button>
                            <div className="flex flex-col gap-2 border-t border-secondary pt-4">
                                <MetaLine icon={Calendar}>{pack.expiration === "No expiration" ? "No expiry" : `Use by ${pack.expiration}`}</MetaLine>
                                <MetaLine icon={Users01}>{pack.transferable ? "Transferable" : "One golfer per credit"}</MetaLine>
                                <MetaLine icon={MarkerPin01}>
                                    {coach.courseSlugs.length === 1 ? COURSE_NAME[coach.courseSlugs[0]] : `${coach.courseSlugs.length} MCG courses`}
                                </MetaLine>
                            </div>
                        </aside>
                    </div>
                </div>
            </InstructionShell>
        );
    }

    /* ================================================================ */
    /* 3 — Buy, checkout                                                */
    /* ================================================================ */
    if (step === "checkout") {
        return (
            <InstructionShell>
                <div className="mx-auto w-full max-w-5xl px-6 py-8 sm:px-8">
                    <Button size="sm" color="link-gray" iconLeading={ArrowLeft} onClick={() => setStep("details")}>
                        Back to package
                    </Button>

                    <h1 className="mt-5 text-display-xs font-semibold text-primary">Checkout</h1>

                    <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
                        <div className="flex flex-col gap-6">
                            <section className="flex flex-col gap-4 rounded-2xl bg-primary p-6 ring-1 ring-secondary ring-inset">
                                <SectionTitle>Your details</SectionTitle>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <Input label="First name" defaultValue={GOLFER.first} />
                                    <Input label="Last name" defaultValue={GOLFER.last} />
                                </div>
                                <Input label="Email" defaultValue={GOLFER.email} />
                                <Input label="Phone" defaultValue={GOLFER.phone} />
                            </section>

                            <section className="flex flex-col gap-4 rounded-2xl bg-primary p-6 ring-1 ring-secondary ring-inset">
                                <SectionTitle sub="Charged today. Your card is saved so your instructor can book and charge you directly.">Payment</SectionTitle>
                                <div className="flex items-center gap-3.5 rounded-xl bg-brand-primary px-4 py-4 ring-2 ring-brand ring-inset">
                                    <RadioButtonBase size="md" isSelected />
                                    <img src={asset("card-images/Visa.svg")} alt="Visa" className="h-5 w-auto shrink-0" />
                                    <span className="flex min-w-0 flex-1 flex-col">
                                        <span className="text-sm font-semibold text-primary">Visa ···· 4242</span>
                                        <span className="text-xs text-tertiary">Expires 04 / 28</span>
                                    </span>
                                </div>
                                <Button size="md" color="secondary" iconLeading={CreditCard01}>
                                    Use a different card
                                </Button>
                            </section>

                            <section className="flex flex-col gap-5 rounded-2xl bg-primary p-6 ring-1 ring-secondary ring-inset">
                                <SectionTitle>What you&rsquo;re agreeing to</SectionTitle>
                                <PolicyList title="How it works" items={pack.howItWorks} tone="good" />
                                <div className="border-t border-secondary pt-5">
                                    <PolicyList title="Restrictions" items={pack.restrictions} tone="limit" />
                                </div>
                            </section>
                        </div>

                        <aside className="flex flex-col gap-4 rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset lg:sticky lg:top-6 lg:self-start">
                            <SectionTitle>Order summary</SectionTitle>
                            <div className="flex items-center gap-3">
                                <CoachAvatar coach={coach} size="sm" />
                                <div className="flex min-w-0 flex-col">
                                    <span className="truncate text-sm font-semibold text-primary">{pack.label}</span>
                                    <span className="truncate text-xs text-tertiary">with {coach.name}</span>
                                </div>
                            </div>
                            <div className="flex flex-col border-t border-secondary pt-3">
                                <SummaryLine label={`${pack.credits} lessons at full price`} value={money(pack.listPrice)} muted />
                                <SummaryLine label="Package discount" value={`−${money(pack.savings)}`} />
                                <div className="mt-2 border-t border-secondary pt-2.5">
                                    <SummaryLine label="Total" value={money(pack.price)} strong />
                                </div>
                            </div>
                            <Button size="lg" color="primary" onClick={() => setStep("confirmation")}>
                                Pay {money(pack.price)}
                            </Button>
                            <p className="text-xs text-tertiary">Credits appear in your account immediately and can be booked straight away.</p>
                        </aside>
                    </div>
                </div>
            </InstructionShell>
        );
    }

    /* ================================================================ */
    /* 4 — Purchase confirmation                                        */
    /* ================================================================ */
    if (step === "confirmation") {
        return (
            <InstructionShell>
                <div className="mx-auto w-full max-w-2xl px-6 py-12 sm:px-8">
                    <div className="flex flex-col items-center gap-3 text-center">
                        <span className="flex size-14 items-center justify-center rounded-full bg-success-secondary">
                            <CheckCircle className="size-7 text-fg-success-primary" aria-hidden="true" />
                        </span>
                        <h1 className="text-display-sm font-semibold text-primary">{pack.credits} lessons are yours</h1>
                        <p className="max-w-md text-md text-tertiary">Your credits are in your MCG account and ready to book. Receipt sent to {GOLFER.email}.</p>
                    </div>

                    <div className="mt-8 flex flex-col gap-5 rounded-2xl bg-primary p-6 ring-1 ring-secondary ring-inset">
                        <div className="flex items-center gap-3.5 border-b border-secondary pb-5">
                            <CoachAvatar coach={coach} />
                            <div className="flex min-w-0 flex-1 flex-col">
                                <span className="text-md font-semibold text-primary">{pack.label}</span>
                                <span className="text-sm text-tertiary">with {coach.name}</span>
                            </div>
                            <Badge color="success" size="md" type="pill-color">
                                Active
                            </Badge>
                        </div>

                        <div className="flex flex-wrap items-end justify-between gap-4 rounded-xl bg-secondary_subtle px-4 py-4">
                            <div className="flex flex-col gap-2">
                                <MicroLabel>Credits available</MicroLabel>
                                <div className="flex items-center gap-3">
                                    <span className="text-display-xs font-semibold text-primary tabular-nums">{pack.credits}</span>
                                    <CreditPips total={pack.credits} remaining={pack.credits} />
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <MicroLabel>Paid</MicroLabel>
                                <span className="text-lg font-semibold text-primary tabular-nums">{money(pack.price)}</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <MetaLine icon={Calendar}>{pack.expiration === "No expiration" ? "No expiry" : `Use by ${pack.expiration}`}</MetaLine>
                            <MetaLine icon={Ticket02}>Redeemable online or by {coach.name} at the lesson tee</MetaLine>
                            <MetaLine icon={Users01}>{pack.transferable ? "Transferable between golfers" : "Non-transferable"}</MetaLine>
                        </div>

                        <div className="flex flex-wrap gap-3 border-t border-secondary pt-5">
                            <Button size="lg" color="primary" iconTrailing={ArrowRight}>
                                Book your first lesson
                            </Button>
                            <Button size="lg" color="secondary" onClick={() => setStep("wallet")}>
                                View my credits
                            </Button>
                        </div>
                    </div>
                </div>
            </InstructionShell>
        );
    }

    /* ================================================================ */
    /* 5 — Wallet, credit balances                                      */
    /* ================================================================ */
    if (step === "wallet") {
        const totalValue = CREDIT_BALANCES.reduce((sum, b) => sum + b.valueRemaining, 0);
        const totalCredits = CREDIT_BALANCES.reduce((sum, b) => sum + b.creditsRemaining, 0);

        return (
            <InstructionShell>
                <AcademyHero
                    title="My lesson credits"
                    blurb="Credits sit in your MCG wallet next to gift cards and punch cards. Each balance belongs to the instructor you bought it from."
                    right={
                        <div className="flex gap-3">
                            <div className="rounded-xl bg-secondary_subtle px-4 py-3 ring-1 ring-secondary ring-inset">
                                <MicroLabel>Lessons</MicroLabel>
                                <p className="text-display-xs font-semibold text-primary tabular-nums">{totalCredits}</p>
                            </div>
                            <div className="rounded-xl bg-secondary_subtle px-4 py-3 ring-1 ring-secondary ring-inset">
                                <MicroLabel>Value</MicroLabel>
                                <p className="text-display-xs font-semibold text-primary tabular-nums">{money0(totalValue)}</p>
                            </div>
                        </div>
                    }
                />

                <div className="mx-auto w-full max-w-5xl px-6 py-8 sm:px-8">
                    <SectionTitle sub="One balance per instructor — that's also how MCG reports what the Academy still owes in lessons.">Active balances</SectionTitle>
                    <div className="mt-5 grid items-start gap-4 lg:grid-cols-2">
                        {CREDIT_BALANCES.map((b) => (
                            <CreditCardPanel
                                key={b.id}
                                balance={b}
                                action={
                                    <>
                                        <Button size="sm" color="primary" onClick={() => setStep("redeem")}>
                                            Book with these credits
                                        </Button>
                                        <Button size="sm" color="link-gray" onClick={() => openPack(b.packageId)}>
                                            Terms
                                        </Button>
                                    </>
                                }
                            />
                        ))}
                    </div>

                    <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset">
                        <div className="flex items-start gap-3">
                            <Ticket02 className="mt-0.5 size-5 shrink-0 text-fg-brand-primary" aria-hidden="true" />
                            <div className="flex flex-col gap-0.5">
                                <p className="text-sm font-semibold text-primary">Add more lessons</p>
                                <p className="text-sm text-tertiary">Packages and monthly plans are available from every MCG instructor.</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                            <Button size="md" color="secondary" onClick={() => setStep("browse")}>
                                Browse packages
                            </Button>
                            <Button size="md" color="secondary" iconLeading={RefreshCcw01} onClick={() => setStep("subscription")}>
                                Monthly plans
                            </Button>
                        </div>
                    </div>
                </div>
            </InstructionShell>
        );
    }

    /* ================================================================ */
    /* 6 — Redeem at booking                                            */
    /* ================================================================ */
    if (step === "redeem") {
        const chosen = CREDIT_BALANCES.find((b) => b.id === redeemFrom)!;
        const chosenCoach = coachById(chosen.coachId)!;
        const chosenService = serviceById(packageById(chosen.packageId)!.appliesToServiceId)!;
        const chosenPrice = servicePrice(chosenService, chosenCoach, 1);
        const facilityFee = 4;

        return (
            <InstructionShell>
                <div className="mx-auto w-full max-w-5xl px-6 py-8 sm:px-8">
                    <Button size="sm" color="link-gray" iconLeading={ArrowLeft} onClick={() => setStep("wallet")}>
                        Back to my credits
                    </Button>

                    <h1 className="mt-5 text-display-xs font-semibold text-primary">Which credit are you spending?</h1>
                    <p className="mt-2 max-w-2xl text-md text-tertiary">
                        You hold credits with two instructors. Credits are tied to the instructor who sold them, so picking a balance also picks who teaches the lesson.
                    </p>

                    <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
                        <div className="flex flex-col gap-3">
                            {CREDIT_BALANCES.map((b) => {
                                const c = coachById(b.coachId)!;
                                const p = packageById(b.packageId)!;
                                const svc = serviceById(p.appliesToServiceId)!;
                                const active = redeemFrom === b.id;
                                return (
                                    <button
                                        key={b.id}
                                        type="button"
                                        onClick={() => setRedeemFrom(b.id)}
                                        className={cx(
                                            "flex items-start gap-3.5 rounded-2xl p-5 text-left ring-1 transition duration-100 ease-linear ring-inset",
                                            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
                                            active ? "bg-brand-primary ring-2 ring-brand" : "bg-primary ring-secondary hover:ring-brand",
                                        )}
                                    >
                                        <RadioButtonBase size="md" isSelected={active} />
                                        <CoachAvatar coach={c} />
                                        <span className="flex min-w-0 flex-1 flex-col gap-2">
                                            <span className="flex flex-wrap items-center gap-2">
                                                <span className="text-sm font-semibold text-primary">{c.name}</span>
                                                {p.availability === "assigned" && (
                                                    <Badge color="blue" size="sm" type="pill-color">
                                                        Assigned
                                                    </Badge>
                                                )}
                                            </span>
                                            <span className="text-sm text-tertiary">
                                                {svc.name} · {svc.durationMin} min · {c.courseSlugs.map((s) => COURSE_NAME[s]).join(", ")}
                                            </span>
                                            <span className="flex items-center gap-3">
                                                <CreditPips total={b.creditsTotal} remaining={b.creditsRemaining} />
                                                <span className="text-xs text-tertiary tabular-nums">
                                                    {b.creditsRemaining} left · {money(b.valueRemaining)} value
                                                </span>
                                            </span>
                                            <span className="text-xs text-tertiary">{b.expiresOn ? `Expires ${b.expiresOn}` : "No expiry"}</span>
                                        </span>
                                    </button>
                                );
                            })}

                            <div className="flex items-start gap-2.5 rounded-xl bg-secondary_subtle px-4 py-3.5">
                                <InfoCircle className="mt-0.5 size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />
                                <p className="text-sm text-tertiary">
                                    A credit covers the lesson itself. The {money0(facilityFee)} facility fee is charged to your card either way.
                                </p>
                            </div>
                        </div>

                        <aside className="flex flex-col gap-4 rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset lg:sticky lg:top-6 lg:self-start">
                            <SectionTitle>Your lesson</SectionTitle>
                            <div className="flex items-center gap-3">
                                <CoachAvatar coach={chosenCoach} size="sm" />
                                <div className="flex min-w-0 flex-col">
                                    <span className="truncate text-sm font-semibold text-primary">{chosenCoach.name}</span>
                                    <span className="truncate text-xs text-tertiary">{chosenService.name}</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 rounded-xl bg-secondary_subtle px-4 py-3.5">
                                <MetaLine icon={Calendar}>Fri, Jun 19, 2026</MetaLine>
                                <MetaLine icon={Clock}>10:30 AM · {chosenService.durationMin} min</MetaLine>
                                <MetaLine icon={MarkerPin01}>{COURSE_NAME[chosenCoach.courseSlugs[0]]}</MetaLine>
                            </div>
                            <div className="flex flex-col border-t border-secondary pt-3">
                                <SummaryLine label={chosenService.name} value={money(chosenPrice)} />
                                <SummaryLine label="Lesson credit applied" value={`−${money(chosenPrice)}`} />
                                <SummaryLine label="Facility fee" value={money(facilityFee)} muted />
                                <div className="mt-2 border-t border-secondary pt-2.5">
                                    <SummaryLine label="Due now" value={money(facilityFee)} strong />
                                </div>
                            </div>
                            <Button size="lg" color="primary" onClick={() => setStep("after")}>
                                Confirm — pay {money(facilityFee)}
                            </Button>
                            <p className="text-xs text-tertiary">
                                {chosenCoach.name} — {chosen.creditsRemaining - 1} {chosen.creditsRemaining - 1 === 1 ? "credit" : "credits"} will remain after this booking.
                            </p>
                        </aside>
                    </div>
                </div>
            </InstructionShell>
        );
    }

    /* ================================================================ */
    /* 7 — Balance after redemption                                     */
    /* ================================================================ */
    if (step === "after") {
        const b = BALANCE_AFTER_REDEMPTION;
        const c = coachById(b.coachId)!;
        return (
            <InstructionShell>
                <div className="mx-auto w-full max-w-3xl px-6 py-12 sm:px-8">
                    <div className="flex flex-col items-center gap-3 text-center">
                        <span className="flex size-14 items-center justify-center rounded-full bg-success-secondary">
                            <CheckCircle className="size-7 text-fg-success-primary" aria-hidden="true" />
                        </span>
                        <h1 className="text-display-sm font-semibold text-primary">Lesson booked with a credit</h1>
                        <p className="max-w-lg text-md text-tertiary">
                            One credit spent with {c.name} — the same entry that draws down your balance is what relieves MCG&rsquo;s liability for that instructor.
                        </p>
                    </div>

                    <div className="mt-8">
                        <CreditCardPanel
                            balance={b}
                            action={
                                <>
                                    <Button size="sm" color="primary" onClick={() => setStep("redeem")}>
                                        Book another
                                    </Button>
                                    <Button size="sm" color="secondary" onClick={() => setStep("wallet")}>
                                        All my credits
                                    </Button>
                                </>
                            }
                        />
                    </div>

                    <div className="mt-6 flex items-start gap-3 rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset">
                        <InfoCircle className="mt-0.5 size-5 shrink-0 text-fg-brand-primary" aria-hidden="true" />
                        <div className="flex flex-col gap-1">
                            <p className="text-sm font-semibold text-primary">The same ledger, read two ways</p>
                            <p className="text-sm text-tertiary">
                                Golfer view: {b.creditsRemaining} lessons left, {money(b.valueRemaining)} of value. Academy view: {money(b.valueRemaining)} of outstanding
                                liability still carried against {c.name}, relieved {money(b.history[0].valueRelieved)} at a time as lessons are taught.
                            </p>
                        </div>
                    </div>
                </div>
            </InstructionShell>
        );
    }

    /* ================================================================ */
    /* Model C — the subscription                                       */
    /* ================================================================ */
    if (step === "subscription") {
        const subCoach = coachById(subscription.coachId)!;
        const subService = serviceById(subscription.appliesToServiceId)!;
        const perLesson = subscription.monthlyPrice / subscription.lessonsPerMonth;
        const saving = subscription.listMonthly - subscription.monthlyPrice;

        return (
            <InstructionShell>
                <AcademyHero
                    title="Model C — a monthly lesson plan"
                    blurb="Billed monthly with auto-renew, like a membership. Nothing is prepaid beyond the current cycle, so the Academy carries no liability — but unlike a pure discount, the revenue and the commitment are both predictable."
                    right={
                        <Badge color="warning" size="lg" type="pill-color">
                            Third option
                        </Badge>
                    }
                />

                <div className="mx-auto w-full max-w-5xl px-6 py-8 sm:px-8">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <SectionTitle sub="Available from any MCG instructor at their own rate.">Monthly plans</SectionTitle>
                        <Button size="sm" color="link-gray" iconLeading={ArrowLeft} onClick={() => setStep("browse")}>
                            Back to packages
                        </Button>
                    </div>

                    <div className="mt-5 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
                        <div className="flex flex-col gap-6">
                            <section className="flex flex-col gap-5 rounded-2xl bg-primary p-6 ring-1 ring-secondary ring-inset">
                                <div className="flex flex-wrap items-start gap-4">
                                    <CoachAvatar coach={subCoach} size="lg" />
                                    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                                        <h2 className="text-display-xs font-semibold text-primary">{subscription.label}</h2>
                                        <p className="text-md text-tertiary">
                                            with {subCoach.name} · {subService.name}
                                        </p>
                                    </div>
                                </div>
                                <div className="grid gap-3 border-t border-secondary pt-5 sm:grid-cols-3">
                                    <Fact label="Each month" value={String(subscription.lessonsPerMonth)} sub={`${subService.durationMin}-minute privates`} />
                                    <Fact label="Per lesson" value={money0(perLesson)} sub={`Normally ${money0(servicePrice(subService, subCoach, 1))}`} />
                                    <Fact label="You save" value={money0(saving)} sub="every month" />
                                </div>
                            </section>

                            <section className="flex flex-col gap-5 rounded-2xl bg-primary p-6 ring-1 ring-secondary ring-inset">
                                <PolicyList title="What you get" items={subscription.perks} tone="good" />
                                <div className="border-t border-secondary pt-5">
                                    <PolicyList title="How billing works" items={subscription.obligations} tone="limit" />
                                </div>
                            </section>

                            <section className="flex flex-col gap-4 rounded-2xl bg-primary p-6 ring-1 ring-secondary ring-inset">
                                <SectionTitle>Start your plan</SectionTitle>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <Input label="Start date" defaultValue="2026-06-22" type="date" isRequired />
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-sm font-medium text-secondary">Billing</span>
                                        <div className="flex items-center justify-between gap-3 rounded-xl bg-secondary_subtle px-4 py-3">
                                            <span className="text-sm text-secondary">Auto-renew each cycle</span>
                                            <Toggle isSelected={autoRenew} onChange={setAutoRenew} size="sm" aria-label="Auto-renew each cycle" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2.5 rounded-xl bg-secondary_subtle px-4 py-3.5">
                                    <RefreshCcw01 className="mt-0.5 size-4 shrink-0 text-fg-brand-primary" aria-hidden="true" />
                                    <p className="text-sm text-tertiary">
                                        {autoRenew
                                            ? `Renews monthly. You'll be notified ${subscription.renewalNoticeDays} days before each renewal, and you can cancel anytime from your account.`
                                            : "One month only. Your plan ends after the first cycle and nothing further is charged."}
                                    </p>
                                </div>
                            </section>

                            <section className="flex flex-col gap-4 rounded-2xl bg-primary p-6 ring-1 ring-secondary ring-inset">
                                <SectionTitle sub="Why this sits between the other two models.">What MCG carries</SectionTitle>
                                <div className="grid gap-3 sm:grid-cols-3">
                                    <Fact label="Liability" value="$0" sub="Nothing prepaid past this cycle" />
                                    <Fact label="Cash up front" value={money0(subscription.monthlyPrice)} sub="Every month, not once" />
                                    <Fact label="Commitment" value="Rolling" sub="Cancel anytime" />
                                </div>
                            </section>
                        </div>

                        <aside className="flex flex-col gap-4 rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset lg:sticky lg:top-6 lg:self-start">
                            <div className="flex items-end justify-between gap-3">
                                <div className="flex flex-col">
                                    <MicroLabel>Per month</MicroLabel>
                                    <span className="text-display-sm font-semibold text-primary tabular-nums">{money0(subscription.monthlyPrice)}</span>
                                </div>
                                <span className="pb-1.5 text-md text-tertiary line-through tabular-nums">{money0(subscription.listMonthly)}</span>
                            </div>
                            <SavingNote>
                                {money0(saving)} a month cheaper than booking {subscription.lessonsPerMonth}
                                {" lessons one at a time — with nothing sitting on MCG’s books."}
                            </SavingNote>
                            <Button size="lg" color="primary" iconTrailing={ArrowRight}>
                                Start {money0(subscription.monthlyPrice)}/month
                            </Button>
                            <div className="flex flex-col gap-2 border-t border-secondary pt-4">
                                <MetaLine icon={RefreshCcw01}>{autoRenew ? "Auto-renews monthly" : "Single month"}</MetaLine>
                                <MetaLine icon={Calendar}>Notified {subscription.renewalNoticeDays} days before renewal</MetaLine>
                                <MetaLine icon={Users01}>One golfer per lesson</MetaLine>
                            </div>
                            <div className="flex flex-col gap-2 border-t border-secondary pt-4">
                                <MicroLabel>Other plans</MicroLabel>
                                {SUBSCRIPTIONS.filter((s) => s.id !== subscription.id).map((s) => {
                                    const sc = coachById(s.coachId)!;
                                    return (
                                        <div key={s.id} className="flex items-center justify-between gap-3 rounded-xl bg-secondary_subtle px-4 py-3">
                                            <div className="flex min-w-0 flex-col">
                                                <span className="truncate text-sm font-semibold text-primary">{s.label}</span>
                                                <span className="text-xs text-tertiary">with {sc.name}</span>
                                            </div>
                                            <span className="shrink-0 text-md font-semibold text-primary tabular-nums">{money0(s.monthlyPrice)}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </aside>
                    </div>
                </div>
            </InstructionShell>
        );
    }

    /* ================================================================ */
    /* Model B — volume discount                                        */
    /* ================================================================ */
    if (step === "volume-progress" || step === "volume-earned") {
        const vp = VOLUME_PROGRESS;
        const c = coachById(vp.coachId)!;
        const svc = serviceById(vp.serviceId)!;
        const earned = step === "volume-earned";
        const taken = earned ? vp.lessonsRequired : vp.lessonsTaken;
        const full = servicePrice(svc, c, 1);
        const discounted = full * (1 - vp.discount);
        const facilityFee = 4;

        return (
            <InstructionShell>
                <AcademyHero
                    title="Model B — lessons that pay for themselves"
                    blurb="No package, no balance, no expiry. Lessons ring up at full price and the next one is half off once you've taken four with the same instructor."
                    right={
                        <Badge color="warning" size="lg" type="pill-color">
                            Alternative model
                        </Badge>
                    }
                />

                <div className="mx-auto w-full max-w-3xl px-6 py-8 sm:px-8">
                    <div className="flex flex-col gap-5 rounded-2xl bg-primary p-6 ring-1 ring-secondary ring-inset">
                        <div className="flex items-center gap-3.5">
                            <CoachAvatar coach={c} />
                            <div className="flex min-w-0 flex-1 flex-col">
                                <span className="text-md font-semibold text-primary">{c.name}</span>
                                <span className="text-sm text-tertiary">{svc.name}</span>
                            </div>
                            {earned ? (
                                <Badge color="success" size="md" type="pill-color">
                                    Discount ready
                                </Badge>
                            ) : (
                                <Badge color="gray" size="md" type="pill-color">
                                    {vp.lessonsRequired - taken} to go
                                </Badge>
                            )}
                        </div>

                        <div className="flex flex-col gap-3 rounded-xl bg-secondary_subtle px-5 py-5">
                            <div className="flex items-end justify-between gap-4">
                                <div className="flex flex-col gap-1">
                                    <MicroLabel>Lessons taken with {c.name}</MicroLabel>
                                    <span className="text-display-xs font-semibold text-primary tabular-nums">
                                        {taken}
                                        <span className="text-md font-medium text-tertiary">/{vp.lessonsRequired}</span>
                                    </span>
                                </div>
                                <span className="pb-1.5 text-sm text-tertiary">
                                    {earned
                                        ? `Next lesson ${Math.round(vp.discount * 100)}% off`
                                        : `${vp.lessonsRequired - taken} more and the next is ${Math.round(vp.discount * 100)}% off`}
                                </span>
                            </div>
                            {/* A meter, not a credit book — nothing is owed here */}
                            <div className="flex gap-1.5">
                                {Array.from({ length: vp.lessonsRequired }, (_, i) => (
                                    <span
                                        key={i}
                                        className={cx("h-2.5 flex-1 rounded-full", i < taken ? "" : "bg-quaternary")}
                                        style={i < taken ? { backgroundColor: MCG_GREEN } : undefined}
                                    />
                                ))}
                            </div>
                        </div>

                        {earned ? (
                            <>
                                <SavingNote>
                                    Your fifth lesson with {c.name} is {money(discounted)} instead of {money(full)}. Applied automatically at checkout — nothing to redeem.
                                </SavingNote>
                                <div className="flex flex-col border-t border-secondary pt-4">
                                    <SummaryLine label={svc.name} value={money(full)} muted />
                                    <SummaryLine label={`Loyalty discount (${Math.round(vp.discount * 100)}%)`} value={`−${money(full - discounted)}`} />
                                    <SummaryLine label="Facility fee" value={money(facilityFee)} muted />
                                    <div className="mt-2 border-t border-secondary pt-2.5">
                                        <SummaryLine label="Due now" value={money(discounted + facilityFee)} strong />
                                    </div>
                                </div>
                                <Button size="lg" color="primary">
                                    Book at {money(discounted)}
                                </Button>
                            </>
                        ) : (
                            <>
                                <div className="flex flex-col gap-2.5">
                                    <MicroLabel>Recent lessons</MicroLabel>
                                    <div className="flex flex-col divide-y divide-secondary">
                                        {[
                                            { date: "Apr 11, 2026", where: "Laytonsville" },
                                            { date: "May 2, 2026", where: "Little Bennett" },
                                            { date: "Jun 6, 2026", where: "Laytonsville" },
                                        ].map((l) => (
                                            <div key={l.date} className="flex items-center justify-between gap-4 py-2.5 text-sm">
                                                <span className="text-secondary">
                                                    {svc.name} · {l.where}
                                                </span>
                                                <span className="text-tertiary tabular-nums">{l.date}</span>
                                                <span className="font-semibold text-primary tabular-nums">{money(full)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <Button size="lg" color="primary" iconTrailing={ArrowRight}>
                                    Book lesson {taken + 1} at {money(full)}
                                </Button>
                            </>
                        )}
                    </div>

                    <div className="mt-6 flex items-start gap-3 rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset">
                        <TrendUp02 className="mt-0.5 size-5 shrink-0 text-fg-brand-primary" aria-hidden="true" />
                        <div className="flex flex-col gap-1">
                            <p className="text-sm font-semibold text-primary">What MCG trades away</p>
                            <p className="text-sm text-tertiary">
                                No outstanding liability, no expiry policy, no refunds to administer, and nothing to migrate if an instructor leaves. In exchange: no cash up
                                front, and no commitment holding the golfer to a fifth lesson. A monthly plan keeps the revenue without the liability — see Model C.
                            </p>
                        </div>
                    </div>
                </div>
            </InstructionShell>
        );
    }

    /* ================================================================ */
    /* Assigned package — the Thrive import                             */
    /* ================================================================ */
    if (step === "assigned") {
        const balance = CREDIT_BALANCES.find((b) => b.id === "bal-doug-thrive")!;
        const assignedPack = packageById(balance.packageId)!;
        const c = coachById(balance.coachId)!;

        return (
            <InstructionShell>
                <AcademyHero
                    title="Credits carried over from Thrive"
                    blurb="Balances migrated from MCG's previous booking system. They're visible to the golfer who holds them and never appear in the package catalog — there is nothing to buy."
                />

                <div className="mx-auto w-full max-w-3xl px-6 py-8 sm:px-8">
                    <CreditCardPanel
                        balance={balance}
                        action={
                            <Button size="sm" color="primary" onClick={() => setStep("redeem")}>
                                Book with these credits
                            </Button>
                        }
                    />

                    <div className="mt-6 flex flex-col gap-5 rounded-2xl bg-primary p-6 ring-1 ring-secondary ring-inset">
                        <SectionTitle sub="How this differs from a package you buy.">Assigned, not purchased</SectionTitle>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <Fact label="In the catalog" value="Hidden" sub="No buy button, no price, unreachable by anyone else" />
                            <Fact label="Issued by" value="The Academy" sub={`${c.name} can also spend it at the lesson tee`} />
                            <Fact label="Expires" value="Never" sub="Keeps the terms it was bought under" />
                            <Fact label="Liability" value={money0(balance.valueRemaining)} sub={`Still owed against ${c.name}`} />
                        </div>
                        <div className="border-t border-secondary pt-5">
                            <PolicyList title="How it works" items={assignedPack.howItWorks} tone="good" />
                        </div>
                        <div className="border-t border-secondary pt-5">
                            <PolicyList title="Restrictions" items={assignedPack.restrictions} tone="limit" />
                        </div>
                    </div>
                </div>
            </InstructionShell>
        );
    }

    /* ================================================================ */
    /* Expired / zero balance                                           */
    /* ================================================================ */
    const [spent, expiredBalance] = EDGE_BALANCES;
    const spentCoach = coachById(spent.coachId)!;
    const expiredCoach = coachById(expiredBalance.coachId)!;
    const repurchase = PACKAGES.find((p) => p.coachId === spent.coachId && p.availability === "online")!;

    return (
        <InstructionShell>
            <AcademyHero
                title="When credits run out"
                blurb="The two states the Academy actually fields phone calls about — a pack that's been used up, and one that expired with lessons still on it."
            />

            <div className="mx-auto w-full max-w-5xl px-6 py-8 sm:px-8">
                <div className="grid items-start gap-4 lg:grid-cols-2">
                    <div className="flex flex-col gap-4">
                        <SectionTitle sub="Every lesson taken. The balance stays visible as a record, and the obvious next step is another pack.">Used up</SectionTitle>
                        <CreditCardPanel
                            balance={spent}
                            action={
                                <Button size="sm" color="primary" onClick={() => openPack(repurchase.id)}>
                                    Buy another {repurchase.credits}-lesson pack — {money0(repurchase.price)}
                                </Button>
                            }
                        />
                    </div>

                    <div className="flex flex-col gap-4">
                        <SectionTitle sub="Two lessons unused past the expiry date. This is where the policy has to be defensible when a golfer reads it back to you.">
                            Expired
                        </SectionTitle>
                        <CreditCardPanel
                            balance={expiredBalance}
                            expired
                            action={
                                <>
                                    <Button size="sm" color="secondary">
                                        Ask the Academy about these
                                    </Button>
                                    <Button size="sm" color="link-gray" onClick={() => openPack(expiredBalance.packageId)}>
                                        Read the terms
                                    </Button>
                                </>
                            }
                        />
                    </div>
                </div>

                <div className="mt-8 flex items-start gap-3 rounded-2xl bg-warning-secondary p-5">
                    <AlertTriangle className="mt-0.5 size-5 shrink-0 text-fg-warning-secondary" aria-hidden="true" />
                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-semibold text-warning-primary">Open question for MCG</p>
                        <p className="max-w-3xl text-sm text-warning-primary">
                            {money(expiredBalance.valueRemaining)} sat unused with {expiredCoach.name} past December 31. Does that revert to the Academy as revenue, stay on the
                            books as liability, or get extended on request? Whichever it is, the golfer needs to have been told on the way in — the restrictions list on the
                            package is doing that work today.
                        </p>
                    </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset">
                    <div className="flex items-start gap-3">
                        <Ticket02 className="mt-0.5 size-5 shrink-0 text-fg-brand-primary" aria-hidden="true" />
                        <div className="flex flex-col gap-0.5">
                            <p className="text-sm font-semibold text-primary">Start again with {spentCoach.name}</p>
                            <p className="text-sm text-tertiary">Packages and monthly plans are available from every MCG instructor.</p>
                        </div>
                    </div>
                    <Button size="md" color="secondary" onClick={() => setStep("browse")}>
                        Browse packages
                    </Button>
                </div>
            </div>
        </InstructionShell>
    );
};

/* ------------------------------------------------------------------ */
/* Local pieces                                                        */
/* ------------------------------------------------------------------ */

const Fact = ({ label, value, sub }: { label: string; value: string; sub: string }) => (
    <div className="flex flex-col gap-1 rounded-xl bg-secondary_subtle px-4 py-3.5">
        <MicroLabel>{label}</MicroLabel>
        <span className="text-display-xs font-semibold text-primary tabular-nums">{value}</span>
        <span className="text-xs text-tertiary">{sub}</span>
    </div>
);

/** A package in the browse grid. */
const PackageCard = ({ pack, onSelect }: { pack: LessonPackage; onSelect: () => void }) => {
    const coach = coachById(pack.coachId)!;
    const service = serviceById(pack.appliesToServiceId)!;
    return (
        <button
            type="button"
            onClick={onSelect}
            className="group flex h-full flex-col gap-4 rounded-2xl bg-primary p-5 text-left ring-1 ring-secondary transition duration-100 ease-linear ring-inset hover:ring-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
            <div className="flex items-start gap-3.5">
                <CoachAvatar coach={coach} />
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="truncate text-md font-semibold text-primary">{coach.name}</span>
                    <span className="truncate text-sm text-tertiary">{coach.title}</span>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                    {pack.badge && (
                        <Badge color="brand" size="sm" type="pill-color">
                            {pack.badge}
                        </Badge>
                    )}
                    <Badge color="success" size="sm" type="pill-color">
                        Save {money0(pack.savings)}
                    </Badge>
                </div>
            </div>

            <div className="flex flex-col gap-2 rounded-xl bg-secondary_subtle px-4 py-3.5">
                <span className="text-sm font-semibold text-primary">{pack.label}</span>
                <div className="flex items-center gap-3">
                    <CreditPips total={pack.credits} remaining={pack.credits} />
                    <span className="text-xs text-tertiary">{service.durationMin}-minute privates</span>
                </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
                {coach.courseSlugs.map((slug) => (
                    <CourseChip key={slug} slug={slug} />
                ))}
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <MetaLine icon={Calendar}>{pack.expiration === "No expiration" ? "No expiry" : `Use by ${pack.expiration}`}</MetaLine>
                <MetaLine icon={Users01}>{pack.transferable ? "Transferable" : "Non-transferable"}</MetaLine>
            </div>

            <div className="mt-auto flex items-end justify-between gap-3 border-t border-secondary pt-3.5">
                <div className="flex flex-col">
                    <span className="text-lg font-semibold text-primary tabular-nums">{money0(pack.price)}</span>
                    <span className="text-xs text-tertiary tabular-nums">{money0(pack.perLessonPrice)} per lesson</span>
                </div>
                <span className="text-sm font-semibold text-brand-secondary transition duration-100 ease-linear group-hover:underline">View</span>
            </div>
        </button>
    );
};
