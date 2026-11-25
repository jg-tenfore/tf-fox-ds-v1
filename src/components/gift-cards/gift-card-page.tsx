"use client";

import { useState } from "react";
import { Calendar, Check, CurrencyDollar, Gift01, InfoCircle, Tag01, User01 } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { TextArea } from "@/components/base/textarea/textarea";
import { cx } from "@/utils/cx";
import { GiftCardGiftForm, type GiftFormValues, type GiftSender } from "./gift-card-gift-form";
import { GIFT_CARD_OFFERS, GOOD_FOR, type GiftCardGift, type GiftCardOffer, type GiftCardPurchase, formatOfferDate, offerHeadline } from "./gift-card-offers";

/**
 * The shop's Gift Card page, rebuilt from the live Fox page (fox.tenfore.golf/dunes/shop/gift-cards)
 * with the Fox design system, without the shop's side rail. Same parts in the same order:
 * special offers (buy for yourself or send as a gift), a custom amount, an optional message,
 * then Purchase for Myself or Purchase as Gift. Send as a Gift and Purchase as Gift open the
 * gift form, as on the live site.
 *
 * Laid out with container queries, so it stacks inside a narrow frame as it would on a phone.
 */

/** Which gift the form opens for: an offer (Send as a Gift) or the typed amount (Purchase as Gift). */
export type GiftFormTarget = { offerId: number } | { amount: number | null };

interface GiftCardPageProps {
    offers?: GiftCardOffer[];
    defaultAmount?: string;
    defaultMessage?: string;
    /** Open with the amount error showing, as after Purchase for Myself with no amount. */
    showAmountError?: boolean;
    /** The signed-in golfer, shown as the sender on the gift form. */
    sender?: GiftSender;
    /** Open on the gift form, as after Send as a Gift or Purchase as Gift. */
    initialGift?: GiftFormTarget;
    giftDefaults?: Partial<GiftFormValues>;
    showGiftErrors?: boolean;
    /** Buy for Myself and Purchase for Myself report here. On the live site each goes to sign-in first. */
    onPurchase?: (purchase: GiftCardPurchase) => void;
    /** The gift form's Add Gift to Cart reports here. */
    onAddGiftToCart?: (gift: GiftCardGift) => void;
}

const SAMPLE_SENDER: GiftSender = { name: "Morgan Hale", email: "morgan.hale@example.com" };

/** A positive dollar amount, or null when the field is empty or not a number above zero. */
const parseAmount = (raw: string) => {
    const value = Number(raw.replace(/[$,\s]/g, ""));
    return raw.trim() !== "" && Number.isFinite(value) && value > 0 ? Math.round(value * 100) / 100 : null;
};

export const GiftCardPage = ({
    offers = GIFT_CARD_OFFERS,
    defaultAmount = "",
    defaultMessage = "",
    showAmountError = false,
    sender = SAMPLE_SENDER,
    initialGift,
    giftDefaults,
    showGiftErrors = false,
    onPurchase,
    onAddGiftToCart,
}: GiftCardPageProps) => {
    const [amount, setAmount] = useState(defaultAmount);
    const [message, setMessage] = useState(defaultMessage);
    const [amountError, setAmountError] = useState(showAmountError);
    const [gift, setGift] = useState<GiftFormTarget | null>(initialGift ?? null);

    const openGift = (target: GiftFormTarget) => {
        setGift(target);
        if (typeof window !== "undefined") window.scrollTo(0, 0);
    };

    // As on the live site: buying for yourself needs an amount; a gift can go on without one (the gift form follows).
    const purchaseForMyself = () => {
        const value = parseAmount(amount);
        if (value === null) {
            setAmountError(true);
            return;
        }
        onPurchase?.({ recipient: "myself", amount: value, message });
    };

    // As on the live site, a gift goes on even without an amount; the gift form asks for one.
    const purchaseAsGift = () => openGift({ amount: parseAmount(amount) });

    if (gift) {
        const offer = "offerId" in gift ? offers.find((o) => o.id === gift.offerId) : undefined;
        return (
            <div className="@container w-full bg-secondary p-4 @3xl:p-8">
                <GiftCardGiftForm
                    key={JSON.stringify(gift)}
                    offer={offer}
                    amount={"amount" in gift ? gift.amount : null}
                    sender={sender}
                    defaults={{ message, ...giftDefaults }}
                    showErrors={showGiftErrors}
                    goodFor={offer?.goodFor ?? GOOD_FOR}
                    onBack={() => setGift(null)}
                    onAddToCart={onAddGiftToCart}
                />
            </div>
        );
    }

    return (
        <div className="@container w-full bg-secondary p-4 @3xl:p-8">
            <section className="mx-auto flex max-w-[1120px] flex-col gap-8 rounded-2xl bg-primary p-6 shadow-xs ring-1 ring-secondary @3xl:p-8">
                <h1 className="flex items-center gap-3 text-display-sm font-semibold text-primary">
                    <Gift01 className="size-8 shrink-0 text-fg-primary" aria-hidden="true" />
                    Gift Card
                </h1>

                {offers.length > 0 && (
                    <div className="flex flex-col gap-5">
                        <h2 className="flex items-center gap-2 text-xl font-semibold text-primary">
                            <Tag01 className="size-6 shrink-0 text-fg-primary" aria-hidden="true" />
                            Special offers
                        </h2>
                        <ul className="grid gap-5 @3xl:grid-cols-2">
                            {offers.map((offer) => (
                                <OfferCard key={offer.id} offer={offer} onPurchase={onPurchase} onSendGift={() => openGift({ offerId: offer.id })} />
                            ))}
                        </ul>
                    </div>
                )}

                <div className="flex flex-col gap-6">
                    <Input
                        label="Amount (USD)"
                        icon={CurrencyDollar}
                        placeholder="0.00"
                        inputMode="decimal"
                        value={amount}
                        onChange={(value) => {
                            setAmount(value);
                            setAmountError(false);
                        }}
                        isInvalid={amountError}
                        hint={amountError ? "Amount is required" : undefined}
                        className="w-full max-w-xs"
                    />

                    <TextArea
                        label="Personal Message (optional)"
                        placeholder="Personal message (optional)"
                        rows={4}
                        value={message}
                        onChange={setMessage}
                        hint={
                            <span className="flex items-center gap-2">
                                <InfoCircle className="size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />
                                Add a personal touch! Your message will be included in the gift card email.
                            </span>
                        }
                    />
                </div>

                <div className="grid gap-3 @xl:grid-cols-2">
                    <Button size="xl" color="primary" onClick={purchaseForMyself}>
                        Purchase for Myself
                    </Button>
                    <Button size="xl" color="secondary" onClick={purchaseAsGift}>
                        Purchase as Gift
                    </Button>
                </div>
            </section>
        </div>
    );
};

const OfferCard = ({ offer, onPurchase, onSendGift }: { offer: GiftCardOffer; onPurchase?: (purchase: GiftCardPurchase) => void; onSendGift: () => void }) => {
    const soldOut = !!offer.soldOut;

    return (
        <li
            className={cx("flex flex-col rounded-2xl p-5 ring-inset @3xl:p-6", soldOut ? "bg-secondary ring-1 ring-secondary" : "bg-primary ring-2 ring-brand")}
        >
            <div className="flex items-start justify-between gap-3">
                <p className="text-md font-semibold text-primary">{offer.name}</p>
                {soldOut && (
                    <Badge type="pill-color" color="gray" size="sm">
                        Sold out
                    </Badge>
                )}
            </div>
            <p className={cx("mt-1 text-display-xs font-semibold", soldOut ? "text-primary" : "text-brand-secondary")}>{offerHeadline(offer)}</p>
            <p className="mt-1 text-md text-tertiary">{offer.description}</p>

            <ul className="mt-4 flex flex-col gap-2 text-md text-tertiary">
                <OfferFact icon={Check}>Good for {offer.goodFor.join(", ")}</OfferFact>
                {offer.endsOn && <OfferFact icon={Calendar}>Through {formatOfferDate(offer.endsOn)}</OfferFact>}
                {offer.limitPerCustomer && <OfferFact icon={User01}>Limit {offer.limitPerCustomer} per customer</OfferFact>}
            </ul>

            <div className="mt-auto grid grid-cols-1 gap-3 pt-6 @md:grid-cols-2">
                <Button size="lg" color="primary" isDisabled={soldOut} onClick={() => onPurchase?.({ recipient: "myself", offerId: offer.id })}>
                    Buy for Myself
                </Button>
                <Button size="lg" color="secondary" isDisabled={soldOut} onClick={onSendGift}>
                    Send as a Gift
                </Button>
            </div>
        </li>
    );
};

const OfferFact = ({ icon: Icon, children }: { icon: typeof Check; children: React.ReactNode }) => (
    <li className="flex items-start gap-2">
        <Icon className="mt-0.5 size-5 shrink-0 text-fg-quaternary" aria-hidden="true" />
        {children}
    </li>
);
