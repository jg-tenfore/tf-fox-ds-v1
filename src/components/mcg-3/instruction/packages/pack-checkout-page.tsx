"use client";

import { useState, type ReactNode } from "react";
import { ArrowRight, Calendar, CheckCircle, Lock01, Plus, RefreshCcw01, Ticket02, User01, Users01 } from "@untitledui/icons";
import { Radio as AriaRadio, RadioGroup as AriaRadioGroup } from "react-aria-components";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { RadioButtonBase } from "@/components/base/radio-buttons/radio-buttons";
import { McgPage, McgShell } from "@/components/mcg-3/mcg-chrome";
import { DEMO_USER, useSession } from "@/components/mcg-3/session";
import { cx } from "@/utils/cx";
import { USER, bookHref, creditsHref, money, money0, packagesHref, serviceById, type LessonPackage, type LessonSubscription } from "../data";
import { useInstructionStore } from "../instruction-store";
import { LinkButton, MetaLine } from "../kit";
import { useInstructionNav } from "../nav";
import { AddCardDialog } from "./add-card-dialog";
import { BILLING_LINE, SAVED_PAYMENTS, cardArt, type SavedPayment } from "./checkout-data";
import { CreditsExplainer } from "./credits-explainer";
import { planSaving } from "./monthly-plan-card";
import { packHref } from "./pack-card";
import { RENEW_PARAM, dayLabel, longDayLabel, usePlanSelection } from "./pack-detail-page";
import { BackLink, CreditDots, MicroLabel, PackCoachAvatar, PageHeader, Panel, PanelSection, PolicyList, SummaryLine, coachFor, lessonsLabel, useByLabel } from "./packages-ui";

/** `/instruction/credits?bought=<pack id>` highlights the balance a purchase just created. */
export const BOUGHT_PARAM = "bought";

export type Purchase = { kind: "pack"; pack: LessonPackage } | { kind: "plan"; plan: LessonSubscription };

/** A lesson for a pack/plan's coach: their only course, or let Booking ask. */
export const bookWithHref = (coachId: string, serviceId: string) => {
    const coach = coachFor(coachId);
    return bookHref({ coach: coachId, service: serviceId, course: coach.courseSlugs.length === 1 ? coach.courseSlugs[0] : undefined });
};

/* ---------- Sign-in gate ---------- */

/**
 * Crane sends the golfer to its sign-in page with `?next=`. P3's `/signin` always lands on the
 * account page, so the prototype signs the sample golfer in right here instead — nothing chosen
 * is lost — and still offers the full sign-up page.
 */
const SignInGate = ({ back, what }: { back: ReactNode; what: string }) => {
    const { signIn } = useSession();
    return (
        <McgShell>
            <McgPage width="6xl">
                <PageHeader back={back} eyebrow="Secure checkout" title="Checkout" />
                <Panel className="mt-8" bodyClassName="flex flex-col items-center px-6 py-14 text-center">
                    <span className="flex size-14 items-center justify-center rounded-full bg-brand-primary_alt text-fg-brand-primary">
                        <User01 className="size-7" aria-hidden="true" />
                    </span>
                    <h2 className="mt-4 text-xl font-semibold text-primary">Sign in to buy {what}</h2>
                    <p className="mt-1.5 max-w-md text-md text-tertiary">
                        Lesson credits live in your MCG account, so you need one to buy them. It takes a minute, and your credits are there the moment you pay.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                        <Button size="lg" onClick={() => signIn(DEMO_USER)}>
                            Sign in
                        </Button>
                        <LinkButton href="/signup" size="lg">
                            Create an account
                        </LinkButton>
                    </div>
                    <p className="mt-4 text-xs text-quaternary">Prototype: signs in the sample golfer, {DEMO_USER.first} {DEMO_USER.last}.</p>
                </Panel>
            </McgPage>
        </McgShell>
    );
};

/* ---------- Checkout ---------- */

/**
 * `/instruction/packages?pack=<id>&step=checkout` — buying a pack or starting a monthly plan, on the
 * P3 checkout pattern (contact, saved cards, order summary, sticky pay bar on mobile). Paid in full
 * here — there's no pay-later. An account is required. Paying a pack calls `buyPack`, so the credits
 * are in My credits at once.
 */
export const PackCheckoutPage = ({ purchase }: { purchase: Purchase }) => {
    const { user } = useSession();
    const { push } = useInstructionNav();
    const { buyPack } = useInstructionStore();
    const plan = usePlanSelection();
    const [payments, setPayments] = useState<SavedPayment[]>(SAVED_PAYMENTS);
    const [paymentId, setPaymentId] = useState(SAVED_PAYMENTS[0].id);
    const [payOpen, setPayOpen] = useState(false);
    const [placing, setPlacing] = useState(false);

    const isPack = purchase.kind === "pack";
    const id = isPack ? purchase.pack.id : purchase.plan.id;
    const coach = coachFor(isPack ? purchase.pack.coachId : purchase.plan.coachId);
    const back = <BackLink href={packHref(id)}>{isPack ? "Back to package" : "Back to plan"}</BackLink>;

    if (!user) return <SignInGate back={back} what={isPack ? "a lesson package" : "a monthly plan"} />;

    const total = isPack ? purchase.pack.price : purchase.plan.monthlyPrice;
    const title = isPack ? purchase.pack.label : purchase.plan.label;
    const golfer = { first: user.first || USER.firstName, last: user.last || USER.lastName, email: user.email || USER.email };

    const pay = () => {
        setPlacing(true);
        window.setTimeout(() => {
            if (isPack) {
                buyPack(purchase.pack.id);
                push(packHref(purchase.pack.id, "done"));
            } else {
                push(packagesHref({ pack: id, step: "done", date: plan.start, extra: plan.autoRenew ? {} : { [RENEW_PARAM]: "0" } }));
            }
        }, 600);
    };

    const payLabel = placing ? "Processing…" : isPack ? `Pay ${money(total)}` : `Start plan · ${money(total)}/mo`;
    const payButton = (
        <Button size="xl" className="w-full" isLoading={placing} showTextWhileLoading iconLeading={placing ? undefined : Lock01} onClick={pay}>
            {payLabel}
        </Button>
    );

    const summary = (
        <Panel title="Order summary" bodyClassName="flex flex-col gap-4 p-5">
            <div className="flex items-center gap-3">
                <PackCoachAvatar coach={coach} size="sm" />
                <div className="flex min-w-0 flex-col">
                    <span className="truncate text-md font-semibold text-primary">{title}</span>
                    <span className="truncate text-sm text-tertiary">with {coach.name}</span>
                </div>
            </div>
            <div className="flex flex-col border-t border-secondary pt-3">
                {isPack ? (
                    <>
                        <SummaryLine label={`${purchase.pack.credits} lessons at full price`} value={money(purchase.pack.listPrice)} />
                        <SummaryLine label="Package discount" value={`−${money(purchase.pack.savings)}`} tone="success" />
                    </>
                ) : (
                    <>
                        <SummaryLine label={`${purchase.plan.lessonsPerMonth} lessons a month at full price`} value={money(purchase.plan.listMonthly)} />
                        <SummaryLine label="Plan discount" value={`−${money(planSaving(purchase.plan).saved)}`} tone="success" />
                        <SummaryLine label="First charge" value={dayLabel(plan.start)} />
                    </>
                )}
                <div className="mt-2 border-t border-secondary pt-3">
                    <SummaryLine label={isPack ? "Total" : "Due on first charge"} value={money(total)} strong />
                </div>
            </div>
            <div className="hidden flex-col gap-2 lg:flex">
                {payButton}
                <p className="text-sm text-tertiary">
                    {isPack
                        ? "Credits appear in your account immediately and can be booked straight away."
                        : plan.autoRenew
                          ? `Renews monthly. You're notified ${purchase.plan.renewalNoticeDays} days before each renewal.`
                          : "One month only — nothing further is charged."}
                </p>
            </div>
        </Panel>
    );

    return (
        <McgShell>
            <McgPage width="6xl">
                <PageHeader back={back} eyebrow="Secure checkout" title="Checkout" />

                <div className="mt-6 grid grid-cols-1 gap-6 lg:mt-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8">
                    <aside className="lg:sticky lg:top-6 lg:order-last lg:self-start">{summary}</aside>

                    <div className="flex min-w-0 flex-col gap-5">
                        <Panel bodyClassName="flex flex-col divide-y divide-secondary">
                            <PanelSection label="Contact">
                                <p className="-mt-1 text-md text-secondary">
                                    {golfer.first} {golfer.last} · {golfer.email} <span className="text-tertiary">· your receipt goes here</span>
                                </p>
                            </PanelSection>

                            <PanelSection
                                label="Payment"
                                right={
                                    <span className="flex items-center gap-1 text-xs text-tertiary">
                                        <Lock01 className="size-3.5" aria-hidden="true" /> Encrypted
                                    </span>
                                }
                            >
                                <p className="-mt-1 text-sm text-tertiary">
                                    {isPack ? "Charged today, in full." : `Charged on ${dayLabel(plan.start)}, then monthly.`} Your card stays saved so your instructor can book and charge
                                    you directly.
                                </p>
                                <AriaRadioGroup aria-label="Payment method" value={paymentId} onChange={setPaymentId} className="flex flex-col gap-2">
                                    {payments.map((p) => (
                                        <AriaRadio
                                            key={p.id}
                                            value={p.id}
                                            isDisabled={!!p.expired}
                                            className={cx(
                                                "flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 ring-1 ring-secondary transition duration-100 ease-linear ring-inset hover:bg-primary_hover",
                                                "data-[focus-visible]:ring-4 data-[focus-visible]:ring-brand-300/60",
                                                "data-[selected]:bg-brand-primary_alt data-[selected]:ring-2 data-[selected]:ring-brand data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
                                            )}
                                        >
                                            {({ isSelected, isDisabled }) => (
                                                <>
                                                    <RadioButtonBase size="md" isSelected={isSelected} isDisabled={isDisabled} />
                                                    <img src={cardArt(p.brand)} alt="" className="h-6 w-auto shrink-0" />
                                                    <span className="min-w-0 flex-1">
                                                        <span className="flex flex-wrap items-center gap-2">
                                                            <span className="text-md font-semibold text-primary">
                                                                {p.name} ···· {p.last4}
                                                            </span>
                                                            {p.expired && (
                                                                <Badge color="error" size="sm" type="pill-color">
                                                                    Exp. {p.expired}
                                                                </Badge>
                                                            )}
                                                        </span>
                                                        <span className="block truncate text-sm text-tertiary">
                                                            {golfer.first} {golfer.last}, {BILLING_LINE}
                                                        </span>
                                                    </span>
                                                </>
                                            )}
                                        </AriaRadio>
                                    ))}
                                </AriaRadioGroup>
                                <Button size="md" color="link-color" iconLeading={Plus} onClick={() => setPayOpen(true)} className="self-start">
                                    Use a different card
                                </Button>
                            </PanelSection>

                            <PanelSection label="What you're agreeing to">
                                {isPack ? (
                                    <div className="flex flex-col gap-5">
                                        <PolicyList title="How it works" items={purchase.pack.howItWorks} />
                                        <PolicyList title="Restrictions" items={purchase.pack.restrictions} tone="limit" />
                                    </div>
                                ) : (
                                    <PolicyList
                                        title="How billing works"
                                        items={plan.autoRenew ? purchase.plan.obligations : [...purchase.plan.obligations.slice(0, 2), "Auto-renew is off: the plan ends after the first month"]}
                                        tone="limit"
                                    />
                                )}
                            </PanelSection>
                        </Panel>
                    </div>
                </div>

                <div className="sticky bottom-0 z-20 -mx-6 mt-6 flex flex-col gap-2 border-t border-secondary bg-primary px-6 pt-3 pb-4 sm:-mx-8 sm:px-8 lg:hidden">{payButton}</div>
            </McgPage>

            {payOpen && (
                <AddCardDialog
                    isOpen={payOpen}
                    onOpenChange={setPayOpen}
                    defaultName={`${golfer.first} ${golfer.last}`}
                    onSave={(p) => {
                        setPayments((ps) => [...ps, p]);
                        setPaymentId(p.id);
                    }}
                />
            )}
        </McgShell>
    );
};

/* ---------- Purchased ---------- */

const DoneHero = ({ title, body }: { title: ReactNode; body: ReactNode }) => (
    <div className="flex flex-col items-center gap-3 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-success-secondary">
            <CheckCircle className="size-7 text-fg-success-primary" aria-hidden="true" />
        </span>
        <h1 className="text-display-xs font-semibold text-primary md:text-display-sm">{title}</h1>
        <p className="max-w-md text-md text-tertiary">{body}</p>
    </div>
);

/**
 * `/instruction/packages?pack=<id>&step=done` — the pack is bought: "5 credits added to your
 * wallet", the balance, its expiry date, and the next step — book a lesson with these credits.
 * For a plan: when it starts and how it renews.
 */
export const PackPurchasedPage = ({ purchase }: { purchase: Purchase }) => {
    const { user } = useSession();
    const plan = usePlanSelection();
    const isPack = purchase.kind === "pack";
    const coach = coachFor(isPack ? purchase.pack.coachId : purchase.plan.coachId);
    const serviceId = isPack ? purchase.pack.appliesToServiceId : purchase.plan.appliesToServiceId;
    const service = serviceById(serviceId);
    const email = user?.email || USER.email;

    return (
        <McgShell>
            <McgPage width="3xl">
                {isPack ? (
                    <DoneHero title={`${lessonsLabel(purchase.pack.credits)} are yours`} body={`${purchase.pack.credits} credits added to your wallet and ready to book. Receipt sent to ${email}.`} />
                ) : (
                    <DoneHero
                        title="Your monthly plan is set up"
                        body={`${purchase.plan.lessonsPerMonth} lessons a month with ${coach.name}, starting ${longDayLabel(plan.start)}. Receipt sent to ${email}.`}
                    />
                )}

                <Panel className="mt-8" bodyClassName="flex flex-col gap-5 p-5 md:p-6">
                    <div className="flex items-center gap-3.5 border-b border-secondary pb-5">
                        <PackCoachAvatar coach={coach} />
                        <div className="flex min-w-0 flex-1 flex-col">
                            <span className="text-md font-semibold text-primary">{isPack ? purchase.pack.label : purchase.plan.label}</span>
                            <span className="text-sm text-tertiary">with {coach.name}</span>
                        </div>
                        <Badge color="success" size="sm" type="pill-color">
                            Active
                        </Badge>
                    </div>

                    {isPack ? (
                        <div className="flex flex-wrap items-end justify-between gap-4 rounded-xl bg-secondary px-4 py-4">
                            <div className="flex flex-col gap-2">
                                <MicroLabel>Credits available</MicroLabel>
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="text-display-xs font-semibold text-primary tabular-nums">{purchase.pack.credits}</span>
                                    <CreditDots total={purchase.pack.credits} remaining={purchase.pack.credits} />
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <MicroLabel>Paid</MicroLabel>
                                <span className="text-lg font-semibold text-primary tabular-nums">{money(purchase.pack.price)}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-wrap items-end justify-between gap-4 rounded-xl bg-secondary px-4 py-4">
                            <div className="flex flex-col gap-1">
                                <MicroLabel>Each month</MicroLabel>
                                <span className="text-display-xs font-semibold text-primary tabular-nums">{lessonsLabel(purchase.plan.lessonsPerMonth)}</span>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <MicroLabel>{plan.autoRenew ? "Per month" : "One month"}</MicroLabel>
                                <span className="text-lg font-semibold text-primary tabular-nums">{money0(purchase.plan.monthlyPrice)}</span>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                        {isPack ? (
                            <>
                                <MetaLine icon={Calendar}>{useByLabel(purchase.pack.expiration, true)}</MetaLine>
                                <MetaLine icon={Ticket02}>Redeem online, or {coach.name} can apply a credit at the lesson tee</MetaLine>
                                <MetaLine icon={Users01}>{purchase.pack.transferable ? "Transferable between golfers" : "Non-transferable"}</MetaLine>
                            </>
                        ) : (
                            <>
                                <MetaLine icon={Calendar}>First charge {longDayLabel(plan.start)}</MetaLine>
                                <MetaLine icon={RefreshCcw01}>
                                    {plan.autoRenew
                                        ? `Renews monthly · notified ${purchase.plan.renewalNoticeDays} days before each renewal · cancel anytime`
                                        : "Ends after one month — nothing further is charged"}
                                </MetaLine>
                            </>
                        )}
                    </div>

                    <div className="flex flex-col gap-3 border-t border-secondary pt-5 md:flex-row md:flex-wrap">
                        <LinkButton href={bookWithHref(coach.id, serviceId)} variant="filled" size="lg" iconTrailing={ArrowRight}>
                            {isPack ? "Book a lesson with these credits" : "Book your first lesson"}
                        </LinkButton>
                        {isPack ? (
                            <LinkButton href={creditsHref({ extra: { [BOUGHT_PARAM]: purchase.pack.id } })} size="lg">
                                View my credits
                            </LinkButton>
                        ) : (
                            <LinkButton href={packagesHref()} size="lg">
                                Back to packages
                            </LinkButton>
                        )}
                    </div>
                    {service && <p className="text-sm text-tertiary">Each credit covers one {service.name.toLowerCase()} with {coach.name}.</p>}
                </Panel>

                {isPack && <CreditsExplainer className="mt-6" />}
            </McgPage>
        </McgShell>
    );
};
