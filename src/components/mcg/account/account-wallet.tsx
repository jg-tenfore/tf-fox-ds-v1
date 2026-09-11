"use client";

/**
 * `/account/wallet` — everything with money or entitlement attached to it.
 *
 * Four things sit here for one reason: each is value the golfer already holds.
 * Lesson credits and a gift-card balance are prepaid; a saved card is how the next
 * thing gets paid for; the resident ID is what earns the county rate. Keeping them
 * on one page is what makes "how much golf have I already paid for?" answerable.
 */
import { CreditCard01, Gift01, Plus, ShieldTick, Ticket02 } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { McgLogo } from "@/components/foundations/mcg/mcg-logo";
import { MastercardIcon, VisaIcon } from "@/components/foundations/payment-icons";
import { money } from "@/components/instruction/instruction-catalog";
import { CreditCardPanel } from "@/components/instruction/instruction-ui";
import { CreditCard } from "@/components/shared-assets/credit-card/credit-card";
import { cx } from "@/utils/cx";
import { McgShell } from "../mcg-chrome";
import { type LessonCredit, type SessionUser, useSession } from "../session";
import { AccountShell } from "./account-shell";
import {
    EmptyState,
    GIFT_CARD,
    PAYMENT_METHODS,
    Panel,
    RESIDENT,
    SignedOut,
    creditsRemaining,
    renderableCredits,
    toCreditBalance,
    useResident,
} from "./account-ui";

export interface AccountWalletProps {
    userOverride?: SessionUser | null;
    creditsOverride?: LessonCredit[];
}

export const AccountWalletScreen = ({ userOverride, creditsOverride }: AccountWalletProps) => {
    const session = useSession();
    const user = userOverride ?? session.user;
    const credits = creditsOverride ?? session.credits;
    const [isResident] = useResident(true);

    if (!user) {
        return (
            <McgShell>
                <SignedOut title="Wallet" blurb="Sign in to see your lesson credits, gift-card balance, saved cards and Montgomery County resident ID." />
            </McgShell>
        );
    }

    const packs = renderableCredits(credits);

    return (
        <AccountShell active="wallet">
            <div className="flex flex-col gap-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                        <h2 className="text-display-sm font-semibold text-primary">Wallet</h2>
                        <p className="mt-1.5 text-md text-tertiary">Lesson credits, gift-card balance, saved cards and your county resident ID.</p>
                    </div>
                    <Button href="/shop" size="md" color="secondary" iconLeading={Gift01}>
                        Buy a gift card
                    </Button>
                </div>

                {/* Headline balances — the two numbers people open the wallet for */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-4 rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset">
                        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-secondary">
                            <Ticket02 className="size-6 text-fg-brand-primary" aria-hidden="true" />
                        </span>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold tracking-wide text-quaternary uppercase">Lesson credits</p>
                            <p className="mt-1 text-display-xs font-semibold text-primary tabular-nums">{creditsRemaining(credits)}</p>
                        </div>
                        <Button href="/instruction" size="sm" color="secondary">
                            Redeem
                        </Button>
                    </div>

                    <div className="flex items-center gap-4 rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset">
                        <span className="bg-secondary_subtle flex size-12 shrink-0 items-center justify-center rounded-full ring-1 ring-secondary ring-inset">
                            <Gift01 className="size-6 text-fg-quaternary" aria-hidden="true" />
                        </span>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold tracking-wide text-quaternary uppercase">Gift card balance</p>
                            <p className="mt-1 text-display-xs font-semibold text-primary tabular-nums">{money(GIFT_CARD.balance)}</p>
                        </div>
                        <Button href="/shop" size="sm" color="secondary">
                            Add funds
                        </Button>
                    </div>
                </div>

                <Panel
                    title="Lesson credits"
                    sub="Prepaid lessons with an MCG coach. Credits are redeemed at booking — the balance drops the moment the lesson is confirmed."
                    flush={packs.length > 0}
                    action={
                        <Button href="/instruction" color="link-color" size="sm">
                            Buy another package
                        </Button>
                    }
                >
                    {packs.length > 0 ? (
                        <div className="grid gap-4 p-5">
                            {packs.map((credit) => (
                                <CreditCardPanel
                                    key={credit.id}
                                    balance={toCreditBalance(credit)}
                                    action={
                                        <Button href="/instruction" size="sm" color="secondary">
                                            Book a lesson
                                        </Button>
                                    }
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={Ticket02}
                            title="No lesson credits"
                            blurb="Buy five lessons at once and the per-lesson price drops. Credits work with the coach who issued them, at any course they teach."
                            actions={
                                <Button href="/instruction" size="md">
                                    See packages
                                </Button>
                            }
                        />
                    )}
                </Panel>

                <Panel title="Gift card" sub={`Code ${GIFT_CARD.code} · applies to green fees, the Pro Shop and the Grill.`} flush>
                    <div className="divide-y divide-secondary">
                        {GIFT_CARD.history.map((entry) => (
                            <div key={`${entry.date}-${entry.label}`} className="flex items-center gap-4 px-5 py-4">
                                <span className="w-28 shrink-0 text-sm text-tertiary tabular-nums">{entry.date}</span>
                                <span className="min-w-0 flex-1 truncate text-sm text-primary">{entry.label}</span>
                                <span className={cx("shrink-0 text-sm font-semibold tabular-nums", entry.amount < 0 ? "text-primary" : "text-success-primary")}>
                                    {entry.amount < 0 ? `−${money(Math.abs(entry.amount))}` : `+${money(entry.amount)}`}
                                </span>
                            </div>
                        ))}
                        <div className="flex items-center justify-between gap-4 px-5 py-4">
                            <span className="text-sm font-semibold text-primary">Balance</span>
                            <span className="text-md font-semibold text-primary tabular-nums">{money(GIFT_CARD.balance)}</span>
                        </div>
                    </div>
                </Panel>

                <Panel
                    title="Payment methods"
                    flush
                    action={
                        <Button color="link-color" size="sm" iconLeading={Plus}>
                            Add a card
                        </Button>
                    }
                >
                    <div className="divide-y divide-secondary">
                        {PAYMENT_METHODS.map((method) => (
                            <div key={method.last4} className="flex items-center gap-3.5 px-5 py-4">
                                <span className="flex h-8 w-11.5 shrink-0 items-center justify-center overflow-hidden rounded">
                                    {method.brand === "visa" ? <VisaIcon /> : <MastercardIcon />}
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-primary">
                                        {method.brand === "visa" ? "Visa" : "Mastercard"} ending {method.last4}
                                    </p>
                                    <p className="truncate text-sm text-tertiary">Expires {method.expiry}</p>
                                </div>
                                {method.isDefault && (
                                    <Badge color="gray" size="sm" type="pill-color">
                                        Default
                                    </Badge>
                                )}
                                <Button color="link-gray" size="sm">
                                    Edit
                                </Button>
                            </div>
                        ))}
                        <div className="flex items-center gap-2.5 px-5 py-4 text-sm text-tertiary">
                            <CreditCard01 className="size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />
                            Cards are charged at booking. Tee times cancelled more than 24 hours ahead are refunded in full.
                        </div>
                    </div>
                </Panel>

                <Panel title="Resident ID" sub="Show this at the counter, or leave it here — the resident rate is applied automatically when you book.">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
                        <CreditCard
                            type="brand-dark"
                            width={316}
                            company="Montgomery County Golf"
                            cardHolder={`${user.first} ${user.last}`}
                            cardNumber={RESIDENT.id}
                            cardExpiration={isResident ? "Resident" : "Non-resident"}
                            logo={<McgLogo className="max-h-7 max-w-full object-contain" />}
                        />

                        <div className="flex min-w-0 flex-1 flex-col gap-3">
                            <div className="flex items-center gap-2">
                                {isResident ? (
                                    <Badge color="success" size="md" type="pill-color">
                                        Resident verified
                                    </Badge>
                                ) : (
                                    <Badge color="gray" size="md" type="pill-color">
                                        Not verified
                                    </Badge>
                                )}
                                <span className="text-sm text-tertiary">
                                    {isResident ? RESIDENT.verifiedOn : "Add your address to claim the resident rate"}
                                </span>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <ShieldTick className="mt-0.5 size-4 shrink-0 text-fg-success-secondary" aria-hidden="true" />
                                <p className="text-sm text-tertiary">
                                    {isResident ? (
                                        <>
                                            {RESIDENT.savings} — {RESIDENT.town} {RESIDENT.zip}.
                                        </>
                                    ) : (
                                        <>
                                            Montgomery County residents pay a lower green fee at Falls Road, Northwest, Hampshire Greens, Laytonsville, Little
                                            Bennett, Needwood and The Crossvines.
                                        </>
                                    )}
                                </p>
                            </div>
                            <div>
                                <Button href="/account/settings" size="sm" color="secondary">
                                    {isResident ? "Update residency" : "Verify residency"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Panel>
            </div>
        </AccountShell>
    );
};
