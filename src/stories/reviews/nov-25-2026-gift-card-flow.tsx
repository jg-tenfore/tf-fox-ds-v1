import { useEffect, useState } from "react";
import {
    ArrowRight,
    CheckCircle,
    ChevronDown,
    ChevronUp,
    CreditCard01,
    Download01,
    Gift01,
    HelpCircle,
    LifeBuoy01,
    Mail01,
    Phone,
    Plus,
    ShoppingBag03,
    Trash01,
    Wallet02,
} from "@untitledui/icons";
import confetti from "canvas-confetti";
import { Alert } from "@/components/application/alerts/alert";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { RadioButtonBase } from "@/components/base/radio-buttons/radio-buttons";
import { course } from "@/components/booking/sagamore-data";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { SagamoreLogo } from "@/components/foundations/sagamore/sagamore-logo";
import { Facebook, Instagram, LinkedIn, X, YouTube } from "@/components/foundations/social-icons";
import {
    type AmountChoice,
    CardFace,
    CardThumb,
    GiftCardBuilder,
    type GiftCardBuilderProps,
    type GiftCardOrder,
    deliveryLine,
    orderTitle,
} from "@/components/gift-cards/gift-card-builder";
import {
    BUYER,
    CARD_DESIGNS,
    GIFT_CARD_DEALS,
    GOOD_FOR,
    SAMPLE_HISTORY,
    STANDARD_AMOUNTS,
    formatDate,
    imageSrc,
    maskCode,
    money,
} from "@/components/gift-cards/gift-card-catalog";
import { UpcBarcode } from "@/components/gift-cards/upc-barcode";
import { QRCode } from "@/components/shared-assets/qr-code";
import { cx } from "@/utils/cx";
import { CartHeader } from "../explorations/cart-shared";
import { SAGAMORE_CLUB, SiteFooter, TopNav } from "../explorations/tenfore-chrome";
import { type SentGiftCard, WalletExperience, type WalletGiftCard } from "../profile/wallet-experience";

/**
 * Nov 25 – New Concept: the gift card builder inside the golfer site, carried through the
 * shop's own Cart, Checkout and Confirmation layouts (Shop Checkout 1, 3 and 4), the purchase
 * email, and into the member's Wallet. Gift cards are emailed, so the shipping, tax, rewards
 * and discount-code parts of those layouts become delivery and deal lines.
 */

export type GiftCardFlowStep = "shop" | "cart" | "checkout" | "confirmation" | "email" | "wallet";

const ACCOUNT_LABEL = "Morgan H.";
const ORDER_NUMBER = "#SG-100519";
/** A sample 12-digit card code, the shape the live shop uses. It is also the barcode (UPC-A) and QR value. */
const CARD_CODE = "284716093352";
const PAID_ON = "November 25, 2026";
const BILLING = "Morgan Hale, 118 Fairway Dr, Brookline MA 02445, US";

type Brand = "amex" | "visa" | "mc";
const BRAND_IMG: Record<Brand, string> = { amex: "Amex.svg", visa: "Visa.svg", mc: "Mastercard.svg" };
const BrandChip = ({ brand }: { brand: Brand }) => <img src={`card-images/${BRAND_IMG[brand]}`} alt={brand} className="h-5 w-auto shrink-0" />;
const CARDS: { id: string; brand: Brand; name: string; last4: string }[] = [
    { id: "amex", brand: "amex", name: "American Express", last4: "3005" },
    { id: "visa", brand: "visa", name: "Visa", last4: "4821" },
    { id: "mc", brand: "mc", name: "Mastercard", last4: "6642" },
];

const designById = (id: string) => CARD_DESIGNS.find((d) => d.id === id) ?? CARD_DESIGNS[0];

/** The order a story opens on when it starts past the builder: the $50 → $60 deal, sent to Alex. */
export const SAMPLE_ORDER: GiftCardOrder = {
    design: designById("birthday-gift"),
    value: 60,
    price: 50,
    deal: GIFT_CARD_DEALS[0],
    recipient: "someone",
    delivery: "email",
    toFirstName: "Alex",
    toLastName: "Rivera",
    toName: "Alex Rivera",
    toEmail: "alex@example.com",
    toPhone: "(555) 010-2481",
    message: "Happy birthday! First round's on me.",
    fromName: BUYER.name,
    fromEmail: BUYER.email,
};

/** The same deal, bought for yourself. */
export const SAMPLE_ORDER_FOR_ME: GiftCardOrder = {
    ...SAMPLE_ORDER,
    design: designById("coastal-cliffs"),
    recipient: "me",
    toFirstName: "",
    toLastName: "",
    toName: "",
    toEmail: "",
    toPhone: undefined,
    message: "",
};

/** Reopen the builder on the order's choices (Edit from the cart). */
const builderPropsFor = (o: GiftCardOrder): Partial<GiftCardBuilderProps> => {
    const initialAmount: AmountChoice = o.deal
        ? { kind: "deal", id: o.deal.id }
        : STANDARD_AMOUNTS.includes(o.price)
          ? { kind: "preset", value: o.price }
          : { kind: "custom" };
    return {
        initialAmount,
        initialCustom: initialAmount.kind === "custom" ? String(o.price) : "",
        initialDesign: o.design.id,
        initialRecipient: o.recipient,
        initialDelivery: o.delivery,
        initialToFirstName: o.toFirstName,
        initialToLastName: o.toLastName,
        initialToEmail: o.toEmail,
        initialToPhone: o.toPhone ?? "",
        initialMessage: o.message,
    };
};

/** Sample cards already sent, from the catalog's history. */
const SAMPLE_SENT: SentGiftCard[] = SAMPLE_HISTORY.filter((p) => p.recipient === "someone").map((p) => ({
    id: p.id,
    toName: p.toName ?? "",
    toEmail: p.toEmail,
    date: formatDate(p.date),
    value: p.value,
    paid: p.paid,
    status: p.delivery === "print" ? "Ready to print" : "Sent",
    art: imageSrc((CARD_DESIGNS.find((d) => d.id === p.designId) ?? CARD_DESIGNS[0]).art),
}));

export interface GiftCardFlowProps extends GiftCardBuilderProps {
    initialStep?: GiftCardFlowStep;
    /** The order to open on when starting at the cart or later. */
    initialOrder?: GiftCardOrder;
    /** Fires when the golfer pays. */
    onPurchase?: (order: GiftCardOrder) => void;
}

export const GiftCardFlow = ({ initialStep = "shop", initialOrder = SAMPLE_ORDER, onPurchase, ...builderProps }: GiftCardFlowProps) => {
    const [step, setStep] = useState<GiftCardFlowStep>(initialStep);
    const [order, setOrder] = useState<GiftCardOrder | null>(initialStep === "shop" ? null : initialOrder);
    const [purchased, setPurchased] = useState<GiftCardOrder | null>(
        initialStep === "confirmation" || initialStep === "email" || initialStep === "wallet" ? initialOrder : null,
    );
    const [builderKey, setBuilderKey] = useState(0);

    useEffect(() => window.scrollTo(0, 0), [step]);

    const go = (next: GiftCardFlowStep) => setStep(next);
    const buyAnother = () => {
        setOrder(null);
        setBuilderKey((k) => k + 1);
        go("shop");
    };

    if (step === "shop") {
        return (
            <div className="flex min-h-dvh flex-col bg-secondary">
                <TopNav active="Shop" club={SAGAMORE_CLUB} accountLabel={ACCOUNT_LABEL} />
                <main className="w-full flex-1 px-6 pt-10 pb-20">
                    <GiftCardBuilder
                        key={builderKey}
                        {...builderProps}
                        {...(order ? builderPropsFor(order) : {})}
                        onAddToCart={(o) => {
                            setOrder(o);
                            go("cart");
                        }}
                        onOpenWallet={() => go("wallet")}
                    />
                </main>
                <SiteFooter />
            </div>
        );
    }

    if (step === "wallet") {
        const forMe = purchased?.recipient === "me";
        const giftCards: WalletGiftCard[] = [
            ...(forMe && purchased
                ? [
                      {
                          id: "gc-new",
                          name: "Sagamore Gift Card",
                          last4: CARD_CODE.slice(-4),
                          balance: purchased.value,
                          art: imageSrc(purchased.design.art),
                          isNew: true,
                      },
                  ]
                : []),
            { id: "gc-4821", name: "Sagamore Gift Card", last4: "4821", balance: 75 },
        ];
        const sent: SentGiftCard[] = [
            ...(purchased && !forMe
                ? [
                      {
                          id: "gc-new",
                          toName: purchased.toName,
                          toEmail: purchased.delivery === "email" ? purchased.toEmail : undefined,
                          date: "Nov 25, 2026",
                          value: purchased.value,
                          paid: purchased.price,
                          status: purchased.delivery === "print" ? "Ready to print" : "Sent",
                          art: imageSrc(purchased.design.art),
                      },
                  ]
                : []),
            ...SAMPLE_SENT,
        ];
        return (
            <WalletExperience
                accountLabel={ACCOUNT_LABEL}
                giftCards={giftCards}
                sentGiftCards={sent}
                onBuyGiftCard={buyAnother}
                notice={
                    purchased && (
                        <Alert
                            color="success"
                            icon={CheckCircle}
                            title={forMe ? `Your ${money(purchased.value)} gift card is in your wallet` : `Your gift to ${purchased.toName} is on its way`}
                            description={forMe ? "Use it at checkout or at the Pro Shop counter." : "You'll find it under Gift cards › Sent as gifts."}
                        />
                    )
                }
            />
        );
    }

    if (step === "email") {
        return <PurchaseEmail order={purchased ?? initialOrder} onManage={() => go("wallet")} />;
    }

    if (!order) return null;

    return (
        <div className="flex min-h-dvh flex-col bg-secondary">
            <CartHeader onBack={() => go(step === "cart" ? "shop" : step === "checkout" ? "cart" : "wallet")} />
            {step === "cart" && (
                <CartScreen order={order} onEdit={() => go("shop")} onRemove={() => setOrder(null)} onCheckout={() => go("checkout")} onBuy={buyAnother} />
            )}
            {step === "checkout" && (
                <CheckoutScreen
                    order={order}
                    onPay={() => {
                        setPurchased(order);
                        onPurchase?.(order);
                        go("confirmation");
                    }}
                />
            )}
            {step === "confirmation" && (
                <ConfirmationScreen order={purchased ?? order} onWallet={() => go("wallet")} onBuyAnother={buyAnother} onEmail={() => go("email")} />
            )}
            <SiteFooter />
        </div>
    );
};

/* ------------------------------------------------------------------ */
/* Shared rows                                                         */
/* ------------------------------------------------------------------ */

/** The gift card as a line item, in the same shape as the shop's product lines. */
const GiftLine = ({ order, thumbClass = "w-20" }: { order: GiftCardOrder; thumbClass?: string }) => (
    <div className="flex items-center gap-3">
        <CardThumb design={order.design} className={thumbClass} />
        <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-primary">{orderTitle(order)}</p>
            <p className="text-xs text-tertiary">
                {order.design.name} · {deliveryLine(order)}
            </p>
        </div>
        <span className="shrink-0 text-sm font-semibold text-primary tabular-nums">{money(order.price)}</span>
    </div>
);

const Row = ({ label, value, tone, help }: { label: string; value: string; tone?: "credit"; help?: boolean }) => (
    <div className="flex justify-between">
        <span className="flex items-center gap-1 text-tertiary">
            {label}
            {help && <HelpCircle className="size-3.5 text-fg-quaternary" aria-hidden="true" />}
        </span>
        <span className={cx("font-medium tabular-nums", tone === "credit" ? "text-success-primary" : "text-primary")}>{value}</span>
    </div>
);

/** Totals for a gift card: no shipping and no tax, plus the deal's bonus when there is one. */
const Totals = ({ order, size = "md" }: { order: GiftCardOrder; size?: "md" | "lg" }) => (
    <>
        <Row label="Subtotal · 1 item" value={money(order.price)} />
        {order.value > order.price && <Row label="Deal bonus (card value)" value={`+${money(order.value - order.price)}`} tone="credit" />}
        <Row label="Delivery — email" value="Free" help={size === "lg"} />
        <Row label="Taxes" value={money(0)} help={size === "lg"} />
        <div className="mt-1 flex items-baseline justify-between border-t border-secondary pt-3">
            <span className={cx("font-semibold text-primary", size === "lg" ? "text-lg" : "text-md")}>Total</span>
            <span className={cx("font-semibold text-primary tabular-nums", size === "lg" ? "text-lg" : "text-md")}>
                <span className="mr-1 text-xs font-medium text-tertiary">USD</span>
                {money(order.price)}
            </span>
        </div>
    </>
);

/* ------------------------------------------------------------------ */
/* 1. Cart — Shop Checkout › 1. Cart                                   */
/* ------------------------------------------------------------------ */

const CartScreen = ({
    order,
    onEdit,
    onRemove,
    onCheckout,
    onBuy,
}: {
    order: GiftCardOrder | null;
    onEdit: () => void;
    onRemove: () => void;
    onCheckout: () => void;
    onBuy: () => void;
}) => (
    <main className="mx-auto w-full max-w-[1080px] flex-1 px-6 pt-10 pb-20">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="flex flex-col gap-4">
                <div>
                    <h1 className="text-display-sm font-semibold text-primary">Your cart</h1>
                    <p className="mt-2 text-md text-tertiary">Review your gift card before checkout.</p>
                </div>
                <section className="flex flex-col rounded-xl bg-primary ring-1 ring-secondary ring-inset">
                    <header className="border-b border-secondary px-5 py-4">
                        <h3 className="text-md font-semibold text-primary">{order ? "1 item" : "0 items"}</h3>
                    </header>
                    {!order ? (
                        <div className="flex flex-col items-center gap-3 px-5 py-10 text-center">
                            <p className="text-sm text-tertiary">Your cart is empty.</p>
                            <Button color="secondary" size="md" iconLeading={Gift01} onClick={onBuy}>
                                Buy a gift card
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4 px-5 py-4">
                            <CardThumb design={order.design} className="w-28" />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-primary">{orderTitle(order)}</p>
                                <p className="text-xs text-tertiary">
                                    {order.design.name} · {deliveryLine(order)}
                                </p>
                                {order.deal && (
                                    <p className="mt-1 text-xs font-medium text-success-primary">
                                        Deal: pay {money(order.deal.price)}, get a {money(order.deal.value)} card
                                    </p>
                                )}
                                <div className="mt-2 flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={onEdit}
                                        className="text-xs font-semibold text-brand-secondary transition duration-100 ease-linear hover:underline"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={onRemove}
                                        className="flex items-center gap-1 text-xs font-medium text-tertiary transition duration-100 ease-linear hover:text-error-primary"
                                    >
                                        <Trash01 className="size-3.5" aria-hidden="true" /> Remove
                                    </button>
                                </div>
                            </div>
                            <p className="shrink-0 text-sm font-semibold text-primary tabular-nums">{money(order.price)}</p>
                        </div>
                    )}
                </section>
            </div>

            <aside className="flex flex-col gap-4">
                <section className="flex flex-col rounded-xl bg-primary ring-1 ring-secondary ring-inset">
                    <header className="border-b border-secondary px-5 py-4">
                        <h3 className="text-md font-semibold text-primary">Order summary</h3>
                    </header>
                    <div className="border-b border-secondary px-5 py-4">
                        <p className="text-sm text-tertiary">Discount codes and gift cards can't be used to buy gift cards.</p>
                    </div>
                    <div className="flex flex-col gap-2.5 px-5 py-4 text-sm">
                        {order ? <Totals order={order} /> : <Row label="Subtotal · 0 items" value={money(0)} />}
                    </div>
                </section>
                <Button color="primary" size="lg" iconLeading={ShoppingBag03} className="w-full" isDisabled={!order} onClick={onCheckout}>
                    Checkout
                </Button>
                <p className="text-center text-xs text-tertiary">Gift cards are emailed, so there's no shipping or tax.</p>
            </aside>
        </div>
    </main>
);

/* ------------------------------------------------------------------ */
/* 2. Checkout — Shop Checkout › 3. Checkout                           */
/* ------------------------------------------------------------------ */

const CheckoutScreen = ({ order, onPay }: { order: GiftCardOrder; onPay: () => void }) => {
    const [card, setCard] = useState("amex");
    const [sendOpen, setSendOpen] = useState(false);

    return (
        <main className="mx-auto w-full max-w-[1080px] flex-1 px-6 pt-10 pb-20">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
                {/* Left */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-secondary">{BUYER.email}</span>
                    </div>

                    <div className="flex flex-col divide-y divide-secondary rounded-2xl bg-primary ring-1 ring-secondary ring-inset">
                        {/* Send to (collapsible), in place of Ship to */}
                        <div className="px-5 py-4">
                            <button type="button" onClick={() => setSendOpen((o) => !o)} className="flex w-full items-center justify-between gap-4 text-left">
                                <div className="flex min-w-0 gap-6">
                                    <span className="w-14 shrink-0 text-sm text-tertiary">{order.recipient === "me" ? "For" : "Send to"}</span>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-primary">{order.recipient === "me" ? `${BUYER.name} (you)` : order.toName}</p>
                                        <p className="truncate text-sm text-tertiary">
                                            {order.recipient === "me"
                                                ? "Saved to your wallet"
                                                : order.delivery === "email"
                                                  ? order.toEmail
                                                  : `Emailed to you to print · ${BUYER.email}`}
                                        </p>
                                    </div>
                                </div>
                                {sendOpen ? (
                                    <ChevronUp className="size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />
                                ) : (
                                    <ChevronDown className="size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />
                                )}
                            </button>
                            {sendOpen && order.recipient === "someone" && (
                                <div className="mt-4 rounded-xl bg-secondary px-4 py-3 text-sm">
                                    <p className="text-tertiary">Message</p>
                                    <p className="mt-1 text-primary">{order.message || "No message"}</p>
                                    {order.toPhone && <p className="mt-2 text-tertiary">Their phone {order.toPhone}</p>}
                                    <p className="mt-2 text-tertiary">From {order.fromName}</p>
                                </div>
                            )}
                        </div>

                        {/* Delivery, in place of Shipping */}
                        <div className="flex flex-col gap-3 px-5 py-4">
                            <span className="text-sm text-tertiary">Delivery</span>
                            <div className="flex items-center justify-between rounded-xl bg-secondary px-4 py-3">
                                <div>
                                    <p className="text-sm font-semibold text-primary">{order.recipient === "me" ? "Wallet" : "Email"}</p>
                                    <p className="text-sm text-tertiary">
                                        {order.recipient === "me" ? "Ready to use right after you pay" : "Sent today, right after you pay"}
                                    </p>
                                </div>
                                <span className="text-sm font-semibold text-primary">Free</span>
                            </div>
                        </div>

                        {/* Payment — saved cards */}
                        <div className="flex flex-col gap-1 px-5 py-4">
                            <span className="text-sm text-tertiary">Payment</span>
                            {CARDS.map((c) => {
                                const selected = card === c.id;
                                return (
                                    <div key={c.id} className={cx("rounded-xl px-4 py-3", selected && "bg-secondary")}>
                                        <div className="flex items-start gap-3">
                                            <button type="button" onClick={() => setCard(c.id)} className="mt-0.5" aria-label={`Select ${c.name}`}>
                                                <RadioButtonBase size="md" isSelected={selected} />
                                            </button>
                                            <button type="button" onClick={() => setCard(c.id)} className="min-w-0 flex-1 text-left">
                                                <span className="flex items-center gap-2">
                                                    <span className="text-sm font-semibold text-primary">
                                                        {c.name} ···· {c.last4}
                                                    </span>
                                                    <BrandChip brand={c.brand} />
                                                </span>
                                                <p className="text-sm text-tertiary">{BILLING}</p>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                            <div className="mt-1 flex items-center justify-between gap-2 px-1">
                                <button type="button" className="flex items-center gap-2 py-2 text-sm font-semibold text-brand-secondary">
                                    <Plus className="size-4" aria-hidden="true" /> Pay another way
                                </button>
                                <span className="flex items-center gap-1 text-xs text-tertiary">
                                    <CreditCard01 className="size-5 text-fg-quaternary" aria-hidden="true" /> +1
                                </span>
                            </div>
                        </div>
                    </div>

                    <Button color="primary" size="lg" className="w-full" onClick={onPay}>
                        Pay now · {money(order.price)}
                    </Button>
                </div>

                {/* Right — order summary */}
                <aside className="flex flex-col gap-5 lg:border-l lg:border-secondary lg:pl-10">
                    <GiftLine order={order} />
                    <div className="border-t border-secondary pt-5">
                        <p className="text-sm text-tertiary">Points, rewards and discount codes can't be used on gift cards.</p>
                    </div>
                    <div className="flex flex-col gap-2.5 border-t border-secondary pt-5 text-sm">
                        <Totals order={order} size="lg" />
                    </div>
                </aside>
            </div>
        </main>
    );
};

/* ------------------------------------------------------------------ */
/* 3. Confirmation — Shop Checkout › 4. Confirmation - Purchase        */
/* ------------------------------------------------------------------ */

const PayRow = ({ label, value, muted }: { label: string; value: string; muted?: boolean }) => (
    <div className="flex items-center justify-between gap-4 py-3">
        <span className="text-secondary">{label}</span>
        <span className={cx("shrink-0 tabular-nums", muted ? "text-success-primary" : "text-primary")}>{value}</span>
    </div>
);

const ConfirmationScreen = ({
    order,
    onWallet,
    onBuyAnother,
    onEmail,
}: {
    order: GiftCardOrder;
    onWallet: () => void;
    onBuyAnother: () => void;
    onEmail: () => void;
}) => {
    useEffect(() => {
        confetti({ particleCount: 140, spread: 75, startVelocity: 45, origin: { y: 0.35 } });
        const t = window.setTimeout(() => confetti({ particleCount: 90, spread: 110, startVelocity: 32, origin: { y: 0.4 } }), 260);
        return () => window.clearTimeout(t);
    }, []);

    const forMe = order.recipient === "me";
    const headline = forMe
        ? `Your ${money(order.value)} gift card is in your wallet.`
        : order.delivery === "email"
          ? `${order.toName} gets the card by email today.`
          : `We've emailed the printable card to ${BUYER.email}.`;
    const pill = forMe ? "Saved to your wallet" : order.delivery === "email" ? `Emailed to ${order.toName} today` : "Emailed to you to print";

    return (
        <main className="flex-1 px-6 pt-10 pb-20">
            <div className="mx-auto max-w-2xl">
                <div className="overflow-hidden rounded-2xl bg-primary shadow-sm ring-1 ring-secondary ring-inset">
                    <div className="flex justify-center px-7 pt-7">
                        <FeaturedIcon icon={CheckCircle} size="lg" color="success" theme="light" />
                    </div>
                    <div className="px-7 pt-4 text-center">
                        <p className="text-xs font-semibold tracking-wide text-quaternary uppercase">Order confirmation</p>
                        <p className="mt-1 text-lg font-semibold text-primary tabular-nums">{ORDER_NUMBER}</p>
                    </div>
                    <div className="px-7 pt-4 pb-7 text-center">
                        <h1 className="text-2xl font-semibold text-primary">Thank you, {BUYER.name.split(" ")[0]}!</h1>
                        <p className="mt-2 text-md text-tertiary">Your gift card order is confirmed. {headline}</p>
                        <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary">
                            {forMe ? (
                                <Wallet02 className="size-4 text-fg-quaternary" aria-hidden="true" />
                            ) : (
                                <Mail01 className="size-4 text-fg-quaternary" aria-hidden="true" />
                            )}
                            {pill}
                        </p>
                    </div>

                    {/* Items */}
                    <section className="border-t border-secondary px-7 py-7">
                        <div className="flex items-center justify-between gap-3">
                            <h2 className="text-lg font-semibold text-primary">
                                Items <span className="text-tertiary">(1)</span>
                            </h2>
                            <Badge color="success" size="md" type="pill-color">
                                Paid
                            </Badge>
                        </div>
                        <div className="mt-4">
                            <GiftLine order={order} />
                        </div>
                    </section>

                    {/* Delivery */}
                    <section className="border-t border-secondary px-7 py-7">
                        <h2 className="text-lg font-semibold text-primary">Delivery</h2>
                        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:justify-between">
                            <div>
                                <p className="text-xs font-semibold tracking-wide text-quaternary uppercase">{forMe ? "For" : "Send to"}</p>
                                <p className="mt-1 text-sm font-medium text-primary">{forMe ? `${BUYER.name} (you)` : order.toName}</p>
                                <p className="text-sm text-tertiary">
                                    {forMe ? "Your wallet" : order.delivery === "email" ? order.toEmail : `Printable copy to ${BUYER.email}`}
                                </p>
                                {!forMe && <p className="text-sm text-tertiary">From {order.fromName}</p>}
                            </div>
                            <div>
                                <p className="text-xs font-semibold tracking-wide text-quaternary uppercase">Method</p>
                                <p className="mt-1 text-sm font-medium text-primary">{forMe ? "Wallet" : "Email"}</p>
                                <p className="text-sm text-tertiary">Today</p>
                                {!forMe && order.message && <p className="max-w-56 truncate text-sm text-tertiary">“{order.message}”</p>}
                            </div>
                        </div>
                    </section>

                    {/* Payment details */}
                    <section className="border-t border-secondary px-7 py-7">
                        <h2 className="text-lg font-semibold text-primary">Payment details</h2>
                        <div className="mt-4 flex flex-col divide-y divide-secondary border-y border-secondary text-sm">
                            <PayRow label="Subtotal · 1 item" value={money(order.price)} />
                            {order.value > order.price && <PayRow label="Deal bonus (card value)" value={`+${money(order.value - order.price)}`} muted />}
                            <PayRow label="Delivery — email" value="Free" />
                            <PayRow label="Taxes" value={money(0)} />
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                            <span className="text-base font-semibold text-primary">Total charged</span>
                            <span className="text-base font-semibold text-primary tabular-nums">{money(order.price)}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                            <span className="flex items-center gap-2.5 text-sm text-secondary">
                                <img src="card-images/Amex.svg" alt="American Express" className="h-6 w-auto" />
                                American Express ···· 3005
                            </span>
                            <span className="text-sm text-secondary tabular-nums">{money(order.price)}</span>
                        </div>
                        <p className="mt-4 text-xs text-tertiary">
                            Paid online on {PAID_ON}. We emailed your receipt to {BUYER.email}.{" "}
                            <button
                                type="button"
                                onClick={onEmail}
                                className="font-semibold text-brand-secondary transition duration-100 ease-linear hover:underline"
                            >
                                View the email
                            </button>
                        </p>
                        <Button color="secondary" size="lg" iconLeading={Download01} className="mt-6 w-full">
                            Download PDF receipt
                        </Button>
                    </section>

                    {/* Gift card details, in place of Returns & exchanges */}
                    <section className="border-t border-secondary px-7 py-7">
                        <h2 className="text-lg font-semibold text-primary">Gift card details</h2>
                        <p className="mt-3 text-sm leading-relaxed text-tertiary">
                            Card code <span className="font-mono text-primary">{forMe ? CARD_CODE : maskCode(CARD_CODE)}</span>. Good for {GOOD_FOR} at{" "}
                            {course.name}. It doesn't expire, and gift cards can't be returned or exchanged for cash.
                        </p>
                        <div className="mt-6 flex flex-col gap-3">
                            <Button color="secondary" size="lg" iconLeading={Wallet02} className="w-full" onClick={onWallet}>
                                {forMe ? "See it in your wallet" : "See your gift cards"}
                            </Button>
                            {!forMe && order.delivery === "email" && (
                                <Button color="secondary" size="lg" iconLeading={Mail01} className="w-full">
                                    Resend the email
                                </Button>
                            )}
                            <Button color="secondary" size="lg" iconLeading={Gift01} className="w-full" onClick={onBuyAnother}>
                                Buy another gift card
                            </Button>
                        </div>
                    </section>

                    {/* Help */}
                    <section className="border-t border-secondary px-7 py-7">
                        <h2 className="text-lg font-semibold text-primary">Where to find help</h2>
                        <div className="mt-5 flex flex-col gap-5">
                            <div className="flex gap-3">
                                <Phone className="mt-0.5 size-5 shrink-0 text-fg-brand-primary" aria-hidden="true" />
                                <div>
                                    <p className="text-sm font-semibold text-primary">Questions about your gift card</p>
                                    <p className="mt-1 text-sm text-tertiary">
                                        Contact the {course.name} Pro Shop at <span className="font-medium text-brand-secondary">{course.phone}</span>.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <LifeBuoy01 className="mt-0.5 size-5 shrink-0 text-fg-brand-primary" aria-hidden="true" />
                                <div>
                                    <p className="text-sm font-semibold text-primary">Help with this receipt or your account</p>
                                    <p className="mt-1 text-sm text-tertiary">
                                        Reach TenFore support 24/7 — <span className="font-medium text-brand-secondary">get support</span>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
};

/* ------------------------------------------------------------------ */
/* 4. Purchase email — the receipt the buyer gets, Self or Gift        */
/* ------------------------------------------------------------------ */

const DetailRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-start justify-between gap-6 px-5 py-3 text-sm">
        <span className="shrink-0 text-tertiary">{label}</span>
        <span className="text-right text-secondary">{value}</span>
    </div>
);

const SOCIALS = [
    { label: "LinkedIn", Icon: LinkedIn },
    { label: "Facebook", Icon: Facebook },
    { label: "X", Icon: X },
    { label: "Instagram", Icon: Instagram },
    { label: "YouTube", Icon: YouTube },
];

/**
 * The purchase email, laid out like the Gift Cards › Purchase email template: club header,
 * a "Gift card" heading with the card and order numbers, the card (Self) or a "Gift sent"
 * note (Gift), the details, "Manage gift cards" and the footer. Built from Fox parts and
 * carrying the card design the golfer picked.
 */
export const PurchaseEmail = ({ order, onManage }: { order: GiftCardOrder; onManage?: () => void }) => {
    const isGift = order.recipient === "someone";
    const firstName = BUYER.name.split(" ")[0];

    return (
        <div className="min-h-dvh bg-tertiary px-4 py-12">
            <div className="mx-auto w-full max-w-[600px] overflow-hidden rounded-2xl bg-primary shadow-xs ring-1 ring-secondary ring-inset">
                {/* Club header */}
                <header className="flex flex-col items-center gap-1 border-b border-secondary px-8 py-6 text-center">
                    <SagamoreLogo className="mb-2 h-14 w-auto" />
                    <p className="text-md font-semibold text-primary">{course.name}</p>
                    <p className="text-sm text-tertiary">{course.address}</p>
                </header>

                {/* Heading */}
                <section className="px-8 pt-8">
                    <p className="text-xs font-semibold tracking-wide text-brand-secondary uppercase">Gift card</p>
                    <h1 className="mt-2 text-display-xs font-semibold text-primary">
                        {isGift ? `Your gift card is on its way.` : `Your gift card is ready, ${firstName}.`}
                    </h1>
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-tertiary uppercase">
                        <span>
                            Gift card <span className="ml-1 font-mono text-secondary normal-case">{isGift ? maskCode(CARD_CODE) : CARD_CODE}</span>
                        </span>
                        <span>
                            Order <span className="ml-1 font-mono text-secondary normal-case">{ORDER_NUMBER}</span>
                        </span>
                    </div>
                </section>

                {/* The card, or the gift note */}
                <section className="flex flex-col gap-4 px-8 pt-7">
                    {isGift ? (
                        <>
                            <div className="flex items-center gap-4 rounded-xl bg-secondary p-3">
                                <CardThumb design={order.design} className="w-28" />
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-primary">{orderTitle(order)}</p>
                                    <p className="text-sm text-tertiary">{order.design.name} design</p>
                                </div>
                            </div>
                            <Alert
                                color="success"
                                icon={CheckCircle}
                                title="Gift sent"
                                description={
                                    order.delivery === "email"
                                        ? `We sent the ${money(order.value)} gift card to ${order.toName}. They'll get a separate email with the card and its code.`
                                        : `We sent you a separate email with the ${money(order.value)} card to print and give to ${order.toName}.`
                                }
                            />
                        </>
                    ) : (
                        <>
                            <CardFace design={order.design} value={order.value} code={CARD_CODE} revealCode className="mx-auto max-w-[400px]" />
                            <p className="text-center text-sm text-tertiary">
                                Scan the barcode at the Pro Shop, or enter the code at checkout online. It&apos;s also in your wallet.
                            </p>
                        </>
                    )}
                </section>

                {/* Details */}
                <section className="px-8 pt-8">
                    <h2 className="text-lg font-semibold text-primary">Details</h2>
                    <div className="mt-4 flex flex-col divide-y divide-secondary rounded-xl ring-1 ring-secondary ring-inset">
                        {!isGift && (
                            <>
                                <DetailRow label="Gift Card ID" value={CARD_CODE} />
                                {/* Scannable codes, like the live email's barcode, plus the square code */}
                                <div className="flex flex-col items-center gap-3 px-5 py-5">
                                    <div className="flex items-center justify-center gap-8">
                                        <UpcBarcode value={CARD_CODE} />
                                        <QRCode value={CARD_CODE} size="md" />
                                    </div>
                                    <p className="text-xs text-tertiary">Scannable barcode for easy redemption</p>
                                </div>
                            </>
                        )}
                        <DetailRow label="Card value" value={money(order.value)} />
                        {order.value > order.price && (
                            <DetailRow label="You paid" value={`${money(order.price)} (deal: +${money(order.value - order.price)} bonus)`} />
                        )}
                        {isGift && <DetailRow label="Recipient" value={order.toName} />}
                        {isGift && (
                            <DetailRow
                                label={order.delivery === "email" ? "Recipient email" : "Delivery"}
                                value={order.delivery === "email" ? order.toEmail : `Printable copy, emailed to you`}
                            />
                        )}
                        {isGift && order.delivery === "email" && order.toPhone && <DetailRow label="Recipient phone" value={order.toPhone} />}
                        {isGift && order.message && <DetailRow label="Message" value={`“${order.message}”`} />}
                        {isGift && <DetailRow label="From" value={order.fromName} />}
                        <DetailRow label="Design" value={order.design.name} />
                        <DetailRow label="Expiration" value="Doesn't expire" />
                        <DetailRow label="Use for" value={GOOD_FOR} />
                        <DetailRow label="Purchased" value={PAID_ON} />
                        <DetailRow label="Paid with" value="American Express ···· 3005" />
                    </div>
                </section>

                {/* Action */}
                <section className="flex flex-col items-center gap-4 px-8 pt-8 pb-8">
                    <Button color="primary" size="lg" iconTrailing={ArrowRight} className="w-full" onClick={onManage}>
                        Manage gift cards
                    </Button>
                    <p className="text-sm text-tertiary">
                        Need help? <span className="font-semibold text-brand-secondary underline">Contact the pro shop</span>.
                    </p>
                </section>

                {/* Footer */}
                <footer className="flex flex-col items-center gap-5 border-t border-secondary bg-secondary px-8 py-8 text-center">
                    <div>
                        <p className="text-sm font-semibold text-primary">{course.name}</p>
                        <p className="mt-1 text-sm text-tertiary">{course.address}</p>
                    </div>
                    <div className="w-12 border-t border-secondary" aria-hidden="true" />
                    <div className="max-w-md">
                        <p className="text-sm font-medium text-secondary">Powered by TenFore Golf.</p>
                        <p className="mt-1 text-sm text-tertiary">
                            The next generation of golf course management. Simple, fast, cloud-based, and fully mobile. Built for golf. Built to last.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button color="secondary" size="sm">
                            Sales Inquiry
                        </Button>
                        <Button color="secondary" size="sm">
                            Customer Support
                        </Button>
                    </div>
                    <div className="flex gap-2">
                        {SOCIALS.map(({ label, Icon }) => (
                            <span
                                key={label}
                                aria-label={label}
                                className="flex size-9 items-center justify-center rounded-lg bg-primary text-fg-tertiary ring-1 ring-secondary ring-inset"
                            >
                                <Icon size={16} />
                            </span>
                        ))}
                    </div>
                    <div className="w-full border-t border-secondary pt-5 text-xs text-quaternary">
                        <p>You&apos;re receiving this because you bought a {course.name} gift card.</p>
                        <p className="mt-1">
                            <span className="underline">Terms of Service</span> · <span className="underline">Privacy</span> ·{" "}
                            <span className="underline">Unsubscribe</span>
                        </p>
                        <p className="mt-1">© 2026 TenFore Technology LLC. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </div>
    );
};
