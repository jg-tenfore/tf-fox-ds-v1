"use client";

/**
 * Prototype 3 — making lesson packages findable.
 *
 * MCG liked that credits can pay for a booking, and that packs are sold somewhere, but
 * said: "I don't feel like it's easy to figure that out as a customer." Two things
 * follow from that, and both are here:
 *
 *  - **`CreditsExplainer`** — buy, redeem, track, in three lines. Shown wherever a pack
 *    is offered, because the moment someone reads the price is the moment they wonder
 *    how it works.
 *  - **`PackChooser`** / **`PackPrompt`** — the packs for one instructor, priced per
 *    lesson against the single-lesson rate, so the saving is arithmetic rather than a
 *    claim. Packs are bought *before* a booking, never during one, so the prompt appears
 *    after a lesson is confirmed rather than inside checkout.
 */
import { ArrowRight, CreditCard01, RefreshCcw01, Ticket02, Wallet02 } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { type Coach, type LessonPackage, money0, packagesForCoach, serviceById, servicePrice } from "@/components/instruction-3/instruction-catalog";

const STEPS = [
    { icon: CreditCard01, title: "Buy a pack", detail: "5 or 10 lessons with one instructor, paid for up front at a lower rate per lesson." },
    { icon: Wallet02, title: "Credits land in your wallet", detail: "Straight away, under Account → Wallet. Nothing to print or remember." },
    { icon: RefreshCcw01, title: "Spend one when you book", detail: "Pick “use a lesson credit” at checkout and the lesson costs nothing further." },
];

/** Buy → wallet → redeem, in three lines. */
export const CreditsExplainer = ({ compact }: { compact?: boolean }) => (
    <div className="flex flex-col gap-3 rounded-xl bg-secondary p-5 ring-1 ring-secondary ring-inset">
        <div className="flex items-center gap-2">
            <Ticket02 className="size-5 text-fg-brand-primary" aria-hidden="true" />
            <h3 className="text-md font-semibold text-primary">How lesson credits work</h3>
        </div>
        <ol className={compact ? "flex flex-col gap-3" : "grid gap-4 sm:grid-cols-3"}>
            {STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-3">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-solid text-xs font-semibold text-white tabular-nums">{i + 1}</span>
                    <span className="flex flex-col gap-0.5">
                        <span className="text-sm font-semibold text-primary">{step.title}</span>
                        <span className="text-sm text-tertiary">{step.detail}</span>
                    </span>
                </li>
            ))}
        </ol>
        <p className="text-xs text-tertiary">Packs are bought on their own, before a booking — they aren&rsquo;t part of paying for a lesson.</p>
    </div>
);

/** What one pack saves against booking the same lessons one at a time. */
export const packSaving = (pack: LessonPackage, coach?: Coach) => {
    const service = serviceById(pack.appliesToServiceId);
    const single = service ? servicePrice(service, coach, 1) : pack.perLessonPrice;
    return { single, perLesson: pack.perLessonPrice, saved: Math.max(0, single * pack.credits - pack.price) };
};

/**
 * The packs an instructor sells, priced per lesson against their own rate. Shown on the
 * profile, where a golfer is already deciding whether to book with this person.
 */
export const PackChooser = ({ coach, heading = "Buy ahead and save" }: { coach?: Coach; heading?: string }) => {
    const packs = coach ? packagesForCoach(coach.id) : [];
    if (!coach || packs.length === 0) return null;
    const best = packs.reduce((a, b) => (packSaving(b, coach).saved > packSaving(a, coach).saved ? b : a));

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <h3 className="text-md font-semibold text-primary">{heading}</h3>
                <p className="text-sm text-tertiary">
                    Prepay for lessons with {coach.name} at a lower rate per lesson. Buy now, book whenever — credits never tie you to a date.
                </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                {packs.map((pack) => {
                    const { single, perLesson, saved } = packSaving(pack, coach);
                    return (
                        <div key={pack.id} className="flex flex-col gap-2 rounded-xl bg-primary p-4 ring-1 ring-secondary ring-inset">
                            <div className="flex items-start justify-between gap-2">
                                <span className="text-sm font-semibold text-primary">{pack.credits} lessons</span>
                                {pack.id === best.id && (
                                    <Badge color="brand" size="sm" type="pill-color">
                                        Best value
                                    </Badge>
                                )}
                            </div>
                            <span className="text-display-xs font-semibold text-primary tabular-nums">{money0(pack.price)}</span>
                            <span className="text-sm text-secondary tabular-nums">
                                {money0(perLesson)} a lesson <span className="text-tertiary line-through">{money0(single)}</span>
                            </span>
                            <span className="text-sm font-medium text-success-primary tabular-nums">Save {money0(saved)}</span>
                            <Button size="sm" color="secondary" href="/instruction/packages" className="mt-auto w-full">
                                Buy this pack
                            </Button>
                        </div>
                    );
                })}
            </div>

            <CreditsExplainer compact />
        </div>
    );
};

/**
 * After a lesson is booked: what the same lessons would have cost as a pack. Deliberately
 * *after*, so buying a pack never gets tangled up in paying for a booking.
 */
export const PackPrompt = ({ coach }: { coach?: Coach }) => {
    const packs = coach ? packagesForCoach(coach.id) : [];
    if (!coach || packs.length === 0) return null;
    const pack = packs.reduce((a, b) => (packSaving(b, coach).saved > packSaving(a, coach).saved ? b : a));
    const { perLesson, saved } = packSaving(pack, coach);

    return (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-brand-primary p-5 ring-1 ring-brand ring-inset">
            <div className="flex items-start gap-3">
                <Ticket02 className="mt-0.5 size-5 shrink-0 text-fg-brand-primary" aria-hidden="true" />
                <div className="flex flex-col gap-0.5">
                    <p className="text-md font-semibold text-primary">Coming back? You&rsquo;d save {money0(saved)} with a {pack.credits}-lesson pack</p>
                    <p className="text-sm text-tertiary">
                        {money0(pack.price)} for {pack.credits} lessons with {coach.name} — {money0(perLesson)} each. Credits go to your wallet and pay for your next
                        booking.
                    </p>
                </div>
            </div>
            <Button size="md" color="primary" href="/instruction/packages" iconTrailing={ArrowRight}>
                See packs
            </Button>
        </div>
    );
};
