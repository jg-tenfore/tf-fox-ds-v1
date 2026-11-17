"use client";

import type { ReactNode } from "react";
import { InfoCircle, RefreshCcw01, Ticket02 } from "@untitledui/icons";
import { EmptyState } from "@/components/mcg-3/account/account-ui";
import { McgPage, McgShell } from "@/components/mcg-3/mcg-chrome";
import { cx } from "@/utils/cx";
import { PACKAGE_FILTERS, SUBSCRIPTIONS, coachById, creditsHref, instructionHref, onlinePackages, packagesForCoach, packagesHref, subscriptionForCoach } from "../data";
import { LinkButton, focusRing } from "../kit";
import { InstructionLink, useInstructionQuery } from "../nav";
import { CreditsExplainer } from "./credits-explainer";
import { ConceptBadge, MonthlyPlanCard } from "./monthly-plan-card";
import { PackCard } from "./pack-card";
import { BackLink, InfoNote, PackCoachAvatar, PageHeader } from "./packages-ui";

/** `?lessons=5|10` — the pack-size filter (kept in the query's `extra` params). */
export const LESSONS_PARAM = "lessons";
/** `/instruction/packages?step=plans` — the monthly plans view. */
export const plansHref = () => packagesHref({ step: "plans" });

/** Monthly plans / My credits — the two ways out of the catalog. */
const HeaderActions = ({ plans = true }: { plans?: boolean }) => (
    <div className="flex shrink-0 flex-wrap gap-2.5">
        {plans && (
            <LinkButton href={plansHref()} iconLeading={RefreshCcw01}>
                Monthly plans
            </LinkButton>
        )}
        <LinkButton href={creditsHref()} iconLeading={Ticket02}>
            My credits
        </LinkButton>
    </div>
);

/** A pill link (filter chips are links, so every filter is a deep link). */
const ChipLink = ({ href, active, children }: { href: string; active: boolean; children: ReactNode }) => (
    <InstructionLink
        href={href}
        scroll={false}
        aria-current={active ? "page" : undefined}
        className={cx(
            "inline-flex h-9 shrink-0 items-center rounded-full px-4 text-sm font-semibold ring-1 transition duration-100 ease-linear ring-inset",
            focusRing,
            active ? "bg-brand-solid text-white ring-transparent" : "bg-primary text-secondary ring-secondary hover:bg-primary_hover",
        )}
    >
        {children}
    </InstructionLink>
);

const WhyTiedNote = () => (
    <InfoNote icon={InfoCircle} title="Why packages are tied to an instructor">
        MCG sets rates per instructor — a teacher who stays full at a higher rate is priced there. Because the rate belongs to the person, so does the package, and so does the credit
        you hold.
    </InfoNote>
);

/**
 * `/instruction/packages` — the lesson-pack catalog ("Browse packages").
 * `?lessons=5|10` filters by pack size; `?coach=<id>` scopes to one instructor's packs (and shows
 * their monthly plan, when they offer one).
 */
export const PackagesPage = () => {
    const { query, hrefWith } = useInstructionQuery();
    const lessons = PACKAGE_FILTERS.some((f) => f.id === query.extra[LESSONS_PARAM]) ? query.extra[LESSONS_PARAM] : "all";
    const coach = query.coach ? coachById(query.coach) : undefined;
    const scoped = !!coach && !coach.isAny;
    const packs = scoped ? packagesForCoach(coach.id) : onlinePackages();
    const visible = lessons === "all" ? packs : packs.filter((p) => String(p.credits) === lessons);
    const coachCount = new Set(packs.map((p) => p.coachId)).size;
    const plan = scoped ? subscriptionForCoach(coach.id) : undefined;

    const withLessons = (id: string) => {
        const extra = { ...query.extra };
        if (id === "all") delete extra[LESSONS_PARAM];
        else extra[LESSONS_PARAM] = id;
        return hrefWith({ extra });
    };

    return (
        <McgShell>
            <McgPage>
                <PageHeader
                    back={<BackLink href={instructionHref()}>Instruction</BackLink>}
                    eyebrow="MCG Academy"
                    title="Lesson packages"
                    subtitle="Buy several lessons up front and pay less per lesson. Rates are set per instructor across the county, so packages are too — a pack is good with the instructor you bought it from."
                    actions={<HeaderActions />}
                />

                {scoped && (
                    <div data-testid="coach-scope" className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl bg-brand-primary_alt px-4 py-3 ring-1 ring-brand ring-inset">
                        <PackCoachAvatar coach={coach} size="sm" />
                        <p className="min-w-0 flex-1 text-md text-primary">
                            Showing <span className="font-semibold">{coach.name}&rsquo;s</span> packs
                        </p>
                        <InstructionLink href={hrefWith({ coach: undefined })} className={cx("rounded text-sm font-semibold text-brand-secondary hover:underline", focusRing)}>
                            Show all
                        </InstructionLink>
                    </div>
                )}

                <section aria-label="Available packages" className="mt-8">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <h2 className="text-display-xs font-semibold text-primary">Available packages</h2>
                            <p className="mt-1 text-md text-tertiary">
                                {visible.length} {visible.length === 1 ? "package" : "packages"}
                                {scoped ? ` from ${coach.name}` : ` from ${coachCount} instructors`}
                            </p>
                        </div>
                        <nav aria-label="Package size" className="-mx-6 flex gap-2 overflow-x-auto px-6 md:mx-0 md:px-0">
                            {PACKAGE_FILTERS.map((f) => (
                                <ChipLink key={f.id} href={withLessons(f.id)} active={lessons === f.id}>
                                    {f.label}
                                </ChipLink>
                            ))}
                        </nav>
                    </div>

                    {visible.length ? (
                        <div className="mt-5 grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {visible.map((p) => (
                                <PackCard key={p.id} pack={p} />
                            ))}
                        </div>
                    ) : (
                        <div className="mt-5 rounded-2xl bg-primary ring-1 ring-secondary ring-inset">
                            <EmptyState
                                icon={Ticket02}
                                title={scoped && packs.length === 0 ? `${coach.name} doesn’t sell packages yet` : `No ${lessons}-lesson packages here`}
                                blurb={scoped ? "Packages are set per instructor. Book single lessons, or see every instructor's packs." : "Try another pack size."}
                                actions={
                                    <LinkButton href={scoped ? hrefWith({ coach: undefined, extra: {} }) : withLessons("all")}>{scoped ? "Show all packages" : "All packages"}</LinkButton>
                                }
                            />
                        </div>
                    )}
                </section>

                {plan && (
                    <section aria-label="Monthly plan" className="mt-10">
                        <h2 className="text-xl font-semibold text-primary">Or a monthly plan with {coach!.name}</h2>
                        <p className="mt-1 text-md text-tertiary">Billed monthly instead of up front. Nothing prepaid past the current month.</p>
                        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <MonthlyPlanCard plan={plan} hideCoach />
                        </div>
                    </section>
                )}

                <div className="mt-10 flex flex-col gap-4">
                    <WhyTiedNote />
                    <CreditsExplainer />
                </div>
            </McgPage>
        </McgShell>
    );
};

/**
 * `/instruction/packages?step=plans` — monthly lesson plans ("Model C"), marked as a concept:
 * billed monthly with auto-renew and a renewal notice, nothing prepaid past the current cycle.
 */
export const MonthlyPlansPage = () => (
    <McgShell>
        <McgPage>
            <PageHeader
                back={<BackLink href={packagesHref()}>Lesson packages</BackLink>}
                eyebrow="MCG Academy"
                title={
                    <span className="flex flex-wrap items-center gap-3">
                        Monthly plans
                        <ConceptBadge />
                    </span>
                }
                subtitle="A set number of lessons every month, billed monthly like a membership. Cancel anytime — you're told before every renewal."
                actions={<HeaderActions plans={false} />}
            />

            <section aria-label="Plans" className="mt-8">
                <h2 className="text-display-xs font-semibold text-primary">Available plans</h2>
                <p className="mt-1 text-md text-tertiary">Offered by MCG instructors at their own rate.</p>
                <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {SUBSCRIPTIONS.map((s) => (
                        <MonthlyPlanCard key={s.id} plan={s} />
                    ))}
                </div>
            </section>

            <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
                <InfoNote icon={RefreshCcw01} title="Plan or pack?">
                    <p>A pack is paid once and spent lesson by lesson. A plan is paid monthly and resets each month — nothing sits prepaid, and you can stop whenever you like.</p>
                    <InstructionLink href={packagesHref()} className={cx("mt-2 inline-block rounded text-sm font-semibold text-brand-secondary hover:underline", focusRing)}>
                        Compare with lesson packages
                    </InstructionLink>
                </InfoNote>
                <InfoNote icon={InfoCircle} title="A third option for MCG" tone="warning">
                    Billed monthly with auto-renew. Nothing is prepaid beyond the current cycle, so the Academy carries no liability — but unlike a pure discount, the revenue and the
                    commitment are both predictable.
                </InfoNote>
            </div>
        </McgPage>
    </McgShell>
);
