"use client";

import { type ReactNode, useState } from "react";
import { Calendar, Check, CurrencyDollar, Gift01, Mail01, Phone, Printer, ShoppingBag03, User01, Wallet02 } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { RadioButtonBase } from "@/components/base/radio-buttons/radio-buttons";
import { TextArea } from "@/components/base/textarea/textarea";
import { cx } from "@/utils/cx";
import {
    BUYER,
    CARD_DESIGNS,
    CLUB_NAME,
    CUSTOM_MAX,
    CUSTOM_MIN,
    type CardDesign,
    DESIGN_THEMES,
    type Delivery,
    GIFT_CARD_DEALS,
    GOOD_FOR,
    type GiftCardDeal,
    MESSAGE_MAX,
    type Recipient,
    STANDARD_AMOUNTS,
    formatDate,
    imageSrc,
    maskCode,
    money,
    money0,
} from "./gift-card-catalog";

/**
 * The gift card builder: pick an amount (deals first), a design and who it's for, with a small
 * card preview and running total beside it. Patterned on a builder-style gift card flow (design
 * tiles, amount tiles, how to send, a live card preview), with the club's deals first so
 * "Pay $50, get $60" is the first thing a golfer sees. "Add to cart" hands the order to the
 * shop's cart, checkout and confirmation.
 *
 * Laid out with container queries, so it stacks inside a narrow frame as it would on a phone.
 */

export type AmountChoice = { kind: "deal"; id: string } | { kind: "preset"; value: number } | { kind: "custom" };

/** Everything the cart, checkout and confirmation need to know about the card. */
export interface GiftCardOrder {
    design: CardDesign;
    /** What the card is worth. */
    value: number;
    /** What the golfer pays. */
    price: number;
    deal?: GiftCardDeal;
    recipient: Recipient;
    delivery: Delivery;
    toFirstName: string;
    toLastName: string;
    /** First and last name together. */
    toName: string;
    toEmail: string;
    toPhone?: string;
    message: string;
    fromName: string;
    fromEmail: string;
}

export interface GiftCardBuilderProps {
    initialAmount?: AmountChoice;
    initialCustom?: string;
    initialDesign?: string;
    initialRecipient?: Recipient;
    initialDelivery?: Delivery;
    initialToFirstName?: string;
    initialToLastName?: string;
    initialToEmail?: string;
    /** Defaults to the email, as when the form was filled in before. */
    initialToConfirmEmail?: string;
    initialToPhone?: string;
    initialToConfirmPhone?: string;
    initialMessage?: string;
    /** Open with the field errors showing, as after Add to cart with something missing. */
    showErrors?: boolean;
    deals?: GiftCardDeal[];
    onAddToCart?: (order: GiftCardOrder) => void;
    /** Opens the golfer's Wallet, where their gift cards live. */
    onOpenWallet?: () => void;
}

const shortDate = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" });

const dealLine = (deal: GiftCardDeal) =>
    [deal.endsOn && `Ends ${shortDate(deal.endsOn)}`, deal.limitPerCustomer && `Limit ${deal.limitPerCustomer} each`].filter(Boolean).join(" · ");

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
const digitsOf = (value: string) => value.replace(/\D/g, "");

/** "To Alex · emailed today", "For you · saved to your wallet" */
export const deliveryLine = (o: Pick<GiftCardOrder, "recipient" | "delivery" | "toName">) =>
    o.recipient === "me"
        ? "For you · saved to your wallet"
        : o.delivery === "email"
          ? `To ${o.toName.trim() || "your recipient"} · emailed today`
          : `To ${o.toName.trim() || "your recipient"} · emailed to you to print`;

/** "$60 Sagamore Spring gift card" */
export const orderTitle = (o: Pick<GiftCardOrder, "value">) => `${money0(o.value)} ${CLUB_NAME} gift card`;

export const GiftCardBuilder = ({
    initialAmount = { kind: "deal", id: "deal-60-for-50" },
    initialCustom = "",
    initialDesign = CARD_DESIGNS[0].id,
    initialRecipient = "someone",
    initialDelivery = "email",
    initialToFirstName = "",
    initialToLastName = "",
    initialToEmail = "",
    initialToConfirmEmail = initialToEmail,
    initialToPhone = "",
    initialToConfirmPhone = initialToPhone,
    initialMessage = "",
    showErrors = false,
    deals = GIFT_CARD_DEALS,
    onAddToCart,
    onOpenWallet,
}: GiftCardBuilderProps) => {
    const [amount, setAmount] = useState<AmountChoice>(initialAmount);
    const [custom, setCustom] = useState(initialCustom);
    const [designId, setDesignId] = useState(initialDesign);
    const [recipient, setRecipient] = useState<Recipient>(initialRecipient);
    const [delivery, setDelivery] = useState<Delivery>(initialDelivery);
    const [toFirstName, setToFirstName] = useState(initialToFirstName);
    const [toLastName, setToLastName] = useState(initialToLastName);
    const [toEmail, setToEmail] = useState(initialToEmail);
    const [confirmEmail, setConfirmEmail] = useState(initialToConfirmEmail);
    const [toPhone, setToPhone] = useState(initialToPhone);
    const [confirmPhone, setConfirmPhone] = useState(initialToConfirmPhone);
    const [message, setMessage] = useState(initialMessage);
    const [fromName, setFromName] = useState(BUYER.name);
    const [fromEmail, setFromEmail] = useState(BUYER.email);
    const [editingFrom, setEditingFrom] = useState(false);
    const toName = `${toFirstName.trim()} ${toLastName.trim()}`.trim();
    const [touched, setTouched] = useState(showErrors);

    const design = CARD_DESIGNS.find((d) => d.id === designId) ?? CARD_DESIGNS[0];
    const deal = amount.kind === "deal" ? deals.find((d) => d.id === amount.id) : undefined;
    const customValue = Number(custom.replace(/[$,\s]/g, ""));
    const customValid = custom.trim() !== "" && Number.isFinite(customValue) && customValue >= CUSTOM_MIN && customValue <= CUSTOM_MAX;

    // What the golfer pays and what the card is worth.
    const price = deal ? deal.price : amount.kind === "preset" ? amount.value : customValid ? Math.round(customValue * 100) / 100 : 0;
    const value = deal ? deal.value : price;

    // A standard amount that a live deal beats for the same money.
    const betterDeal = amount.kind === "preset" ? deals.find((d) => !d.soldOut && d.price === amount.value && d.value > d.price) : undefined;

    const errors = {
        amount:
            amount.kind === "custom" && !customValid
                ? custom.trim() === ""
                    ? "Enter an amount"
                    : `Enter an amount from $${CUSTOM_MIN} to $${CUSTOM_MAX}`
                : undefined,
        toFirstName: recipient === "someone" && toFirstName.trim() === "" ? "Add their first name" : undefined,
        toLastName: recipient === "someone" && toLastName.trim() === "" ? "Add their last name" : undefined,
        toEmail: recipient === "someone" && delivery === "email" && !isEmail(toEmail) ? "Add an email we can send the card to" : undefined,
        confirmEmail:
            recipient === "someone" && delivery === "email" && isEmail(toEmail) && confirmEmail.trim().toLowerCase() !== toEmail.trim().toLowerCase()
                ? "The emails don't match"
                : undefined,
        confirmPhone:
            recipient === "someone" && delivery === "email" && digitsOf(toPhone) !== digitsOf(confirmPhone) ? "The phone numbers don't match" : undefined,
        fromName: recipient === "someone" && fromName.trim() === "" ? "Add who it's from" : undefined,
        fromEmail: recipient === "someone" && !isEmail(fromEmail) ? "Add your email" : undefined,
    };
    const isValid = !Object.values(errors).some(Boolean);
    const show = (key: keyof typeof errors) => (touched ? errors[key] : undefined);

    const addToCart = () => {
        setTouched(true);
        if (!isValid) {
            if (errors.fromName || errors.fromEmail) setEditingFrom(true);
            return;
        }
        onAddToCart?.({
            design,
            value,
            price,
            deal,
            recipient,
            delivery,
            toFirstName: toFirstName.trim(),
            toLastName: toLastName.trim(),
            toName,
            toEmail: toEmail.trim(),
            toPhone: delivery === "email" && digitsOf(toPhone) ? toPhone.trim() : undefined,
            message,
            fromName: fromName.trim(),
            fromEmail: fromEmail.trim(),
        });
    };

    return (
        <div className="@container w-full">
            <div className="mx-auto flex max-w-[1120px] flex-col gap-6">
                <header className="flex flex-wrap items-end justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <h1 className="flex items-center gap-3 text-display-sm font-semibold text-primary">
                            <Gift01 className="size-8 shrink-0 text-fg-primary" aria-hidden="true" />
                            Gift cards
                        </h1>
                        <p className="text-md text-tertiary">
                            Give a round, a lesson or lunch at {CLUB_NAME}. Every card is good for {GOOD_FOR}.
                        </p>
                    </div>
                    {onOpenWallet && (
                        <Button color="link-gray" size="md" iconLeading={Wallet02} onClick={onOpenWallet}>
                            Your gift cards
                        </Button>
                    )}
                </header>

                <div className="grid grid-cols-1 gap-6 @5xl:grid-cols-[minmax(0,1fr)_360px] @5xl:items-start">
                    {/* ------------------------------ Choices ------------------------------ */}
                    <div className="flex flex-col gap-6">
                        <Section number={1} title="Choose an amount">
                            {deals.length > 0 && (
                                <div className="flex flex-col gap-3">
                                    <p className="text-sm font-semibold text-secondary">Deals</p>
                                    <div className="grid grid-cols-1 gap-3 @xl:grid-cols-2 @5xl:grid-cols-3">
                                        {deals.map((d) => (
                                            <DealTile
                                                key={d.id}
                                                deal={d}
                                                isSelected={amount.kind === "deal" && amount.id === d.id}
                                                onSelect={() => setAmount({ kind: "deal", id: d.id })}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col gap-3">
                                <p className="text-sm font-semibold text-secondary">{deals.length > 0 ? "Or pick an amount" : "Pick an amount"}</p>
                                <div className="grid grid-cols-2 gap-3 @xl:grid-cols-4">
                                    {STANDARD_AMOUNTS.map((n) => (
                                        <ChoiceTile
                                            key={n}
                                            isSelected={amount.kind === "preset" && amount.value === n}
                                            onSelect={() => setAmount({ kind: "preset", value: n })}
                                            className="px-4 py-3"
                                        >
                                            <span className="text-lg font-semibold text-primary tabular-nums">{money0(n)}</span>
                                        </ChoiceTile>
                                    ))}
                                </div>
                                <Input
                                    label="Other amount"
                                    icon={CurrencyDollar}
                                    placeholder="0.00"
                                    inputMode="decimal"
                                    value={custom}
                                    onChange={(v) => {
                                        setCustom(v);
                                        setAmount({ kind: "custom" });
                                    }}
                                    onFocus={() => setAmount({ kind: "custom" })}
                                    isInvalid={!!show("amount")}
                                    hint={show("amount") ?? `Any amount from $${CUSTOM_MIN} to $${CUSTOM_MAX}.`}
                                    className="w-full max-w-xs"
                                />
                            </div>

                            {betterDeal && (
                                <div className="flex flex-col gap-3 rounded-xl bg-brand-primary p-4 ring-1 ring-brand ring-inset @xl:flex-row @xl:items-center @xl:justify-between">
                                    <p className="text-sm text-secondary">
                                        <span className="font-semibold text-primary">Same {money0(betterDeal.price)}, bigger card.</span> The deal gets you a{" "}
                                        {money0(betterDeal.value)} card instead.
                                    </p>
                                    <Button size="sm" color="secondary" onClick={() => setAmount({ kind: "deal", id: betterDeal.id })}>
                                        Switch to the deal
                                    </Button>
                                </div>
                            )}
                        </Section>

                        <Section number={2} title="Pick a design">
                            <div className="flex flex-col gap-5">
                                {DESIGN_THEMES.map((t) => (
                                    <div key={t.id} className="flex flex-col gap-2">
                                        <p className="text-sm font-medium text-secondary">{t.label}</p>
                                        <div className="grid grid-cols-2 gap-3 @xl:grid-cols-4">
                                            {CARD_DESIGNS.filter((d) => d.theme === t.id).map((d) => (
                                                <ChoiceTile
                                                    key={d.id}
                                                    isSelected={d.id === designId}
                                                    onSelect={() => setDesignId(d.id)}
                                                    className="flex-col p-2"
                                                >
                                                    <img src={imageSrc(d.art)} alt="" className="aspect-[3/2] w-full rounded-lg object-cover" />
                                                    <span className="px-1 pt-2 pb-1 text-sm font-medium text-primary">{d.name}</span>
                                                </ChoiceTile>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Section>

                        <Section number={3} title="Who's it for?">
                            <div className="grid grid-cols-1 gap-3 @xl:grid-cols-2">
                                <OptionTile
                                    icon={Gift01}
                                    title="Someone else"
                                    text="Send it as a gift, with a note."
                                    isSelected={recipient === "someone"}
                                    onSelect={() => setRecipient("someone")}
                                />
                                <OptionTile
                                    icon={User01}
                                    title="Me"
                                    text="It's saved to your wallet to spend."
                                    isSelected={recipient === "me"}
                                    onSelect={() => setRecipient("me")}
                                />
                            </div>

                            {recipient === "someone" && (
                                <div className="flex flex-col gap-5">
                                    <div className="flex flex-col gap-3">
                                        <p className="text-sm font-semibold text-secondary">How should it get there?</p>
                                        <div className="grid grid-cols-1 gap-3 @xl:grid-cols-2">
                                            <OptionTile
                                                icon={Mail01}
                                                title="Email it to them"
                                                text="They get it today, ready to use."
                                                isSelected={delivery === "email"}
                                                onSelect={() => setDelivery("email")}
                                            />
                                            <OptionTile
                                                icon={Printer}
                                                title="Email it to me to print"
                                                text="Hand it over yourself."
                                                isSelected={delivery === "print"}
                                                onSelect={() => setDelivery("print")}
                                            />
                                        </div>
                                    </div>

                                    {/* From, as on the shop's gift form: the signed-in golfer, with Change */}
                                    <div className="flex flex-col gap-4 rounded-xl bg-secondary p-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <p className="min-w-0 text-sm text-tertiary">
                                                <span className="block text-sm font-semibold text-secondary">From</span>
                                                <span className="font-medium text-primary">{fromName.trim() || "—"}</span> ({fromEmail.trim() || "no email"})
                                            </p>
                                            <Button color="link-color" size="sm" onClick={() => setEditingFrom((e) => !e)}>
                                                {editingFrom ? "Done" : "Change"}
                                            </Button>
                                        </div>
                                        {editingFrom && (
                                            <div className="grid grid-cols-1 gap-4 @xl:grid-cols-2">
                                                <Input
                                                    label="Your name"
                                                    value={fromName}
                                                    onChange={setFromName}
                                                    isRequired
                                                    isInvalid={!!show("fromName")}
                                                    hint={show("fromName") ?? "It's on the card, so they know who it's from."}
                                                />
                                                <Input
                                                    label="Your email"
                                                    type="email"
                                                    value={fromEmail}
                                                    onChange={setFromEmail}
                                                    isRequired
                                                    isInvalid={!!show("fromEmail")}
                                                    hint={show("fromEmail")}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* To */}
                                    <div className="flex flex-col gap-3">
                                        <p className="text-sm font-semibold text-secondary">To</p>
                                        <div className="grid grid-cols-1 gap-4 @xl:grid-cols-2">
                                            <Input
                                                label="First name"
                                                placeholder="Alex"
                                                value={toFirstName}
                                                onChange={setToFirstName}
                                                isRequired
                                                isInvalid={!!show("toFirstName")}
                                                hint={show("toFirstName")}
                                            />
                                            <Input
                                                label="Last name"
                                                placeholder="Rivera"
                                                value={toLastName}
                                                onChange={setToLastName}
                                                isRequired
                                                isInvalid={!!show("toLastName")}
                                                hint={show("toLastName")}
                                            />
                                            {delivery === "email" && (
                                                <>
                                                    <Input
                                                        label="Email"
                                                        type="email"
                                                        icon={Mail01}
                                                        placeholder="alex@example.com"
                                                        value={toEmail}
                                                        onChange={setToEmail}
                                                        isRequired
                                                        isInvalid={!!show("toEmail")}
                                                        hint={show("toEmail")}
                                                    />
                                                    <Input
                                                        label="Confirm email"
                                                        type="email"
                                                        icon={Mail01}
                                                        placeholder="alex@example.com"
                                                        value={confirmEmail}
                                                        onChange={setConfirmEmail}
                                                        isRequired
                                                        isInvalid={!!show("confirmEmail")}
                                                        hint={show("confirmEmail")}
                                                    />
                                                    <Input
                                                        label="Phone (optional)"
                                                        type="tel"
                                                        inputMode="tel"
                                                        icon={Phone}
                                                        placeholder="(555) 010-0000"
                                                        value={toPhone}
                                                        onChange={setToPhone}
                                                    />
                                                    <Input
                                                        label="Confirm phone (optional)"
                                                        type="tel"
                                                        inputMode="tel"
                                                        icon={Phone}
                                                        placeholder="(555) 010-0000"
                                                        value={confirmPhone}
                                                        onChange={setConfirmPhone}
                                                        isInvalid={!!show("confirmPhone")}
                                                        hint={show("confirmPhone")}
                                                    />
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <TextArea
                                        label="Message (optional)"
                                        placeholder="Happy birthday! First round's on me."
                                        rows={3}
                                        maxLength={MESSAGE_MAX}
                                        value={message}
                                        onChange={setMessage}
                                        hint={`${message.length}/${MESSAGE_MAX} characters · it goes on the card email.`}
                                    />
                                </div>
                            )}
                        </Section>
                    </div>

                    {/* ------------------------------ Summary ------------------------------ */}
                    <aside className="@5xl:sticky @5xl:top-6">
                        <section className="flex flex-col rounded-xl bg-primary ring-1 ring-secondary ring-inset">
                            <header className="border-b border-secondary px-5 py-4">
                                <h3 className="text-md font-semibold text-primary">Your gift card</h3>
                            </header>
                            <div className="flex flex-col gap-4 px-5 py-5">
                                <CardFace design={design} value={value} />
                                <div className="flex flex-col gap-2.5 text-sm">
                                    <GiftCardTotals value={value} price={price} />
                                </div>
                                <p className="text-xs text-tertiary">{deliveryLine({ recipient, delivery, toName })}</p>
                                <Button size="lg" color="primary" iconLeading={ShoppingBag03} className="w-full" onClick={addToCart}>
                                    Add to cart
                                </Button>
                                {touched && !isValid && <p className="text-sm text-error-primary">Fill in the highlighted fields to continue.</p>}
                            </div>
                        </section>
                    </aside>
                </div>
            </div>
        </div>
    );
};

/* ------------------------------------------------------------------ */
/* Parts (some shared with the cart, checkout and confirmation)        */
/* ------------------------------------------------------------------ */

const Section = ({ number, title, children }: { number: number; title: string; children: ReactNode }) => (
    <section className="flex flex-col gap-5 rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset @3xl:p-6">
        <h2 className="flex items-center gap-3 text-lg font-semibold text-primary">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-solid text-sm font-bold text-white tabular-nums">
                {number}
            </span>
            {title}
        </h2>
        {children}
    </section>
);

/** A selectable tile, styled like the shop checkout's choices. */
const ChoiceTile = ({
    isSelected,
    isDisabled,
    onSelect,
    className,
    children,
}: {
    isSelected: boolean;
    isDisabled?: boolean;
    onSelect: () => void;
    className?: string;
    children: ReactNode;
}) => (
    <button
        type="button"
        onClick={onSelect}
        disabled={isDisabled}
        aria-pressed={isSelected}
        className={cx(
            "relative flex rounded-xl text-left transition duration-100 ease-linear ring-inset disabled:cursor-not-allowed disabled:opacity-50",
            isSelected ? "bg-brand-secondary ring-2 ring-brand" : "bg-primary ring-1 ring-secondary enabled:hover:bg-primary_hover",
            className,
        )}
    >
        {children}
        {isSelected && (
            <span className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full bg-brand-solid text-white shadow-xs">
                <Check className="size-3" aria-hidden="true" />
            </span>
        )}
    </button>
);

const DealTile = ({ deal, isSelected, onSelect }: { deal: GiftCardDeal; isSelected: boolean; onSelect: () => void }) => {
    const line = dealLine(deal);
    return (
        <ChoiceTile isSelected={isSelected} isDisabled={deal.soldOut} onSelect={onSelect} className="flex-col gap-1 p-4">
            <span className="flex items-center justify-between gap-2">
                {deal.soldOut ? (
                    <Badge type="pill-color" color="gray" size="sm">
                        Sold out
                    </Badge>
                ) : (
                    <Badge type="pill-color" color="success" size="sm">
                        +{money0(deal.value - deal.price)} bonus
                    </Badge>
                )}
            </span>
            <span className="mt-1 text-sm text-tertiary">Pay {money0(deal.price)}</span>
            <span className="text-xl font-semibold text-primary">
                Get a <span className="text-brand-secondary">{money0(deal.value)}</span> card
            </span>
            {line && (
                <span className="mt-1 flex items-center gap-1.5 text-xs text-tertiary">
                    <Calendar className="size-3.5 shrink-0 text-fg-quaternary" aria-hidden="true" />
                    {line}
                </span>
            )}
        </ChoiceTile>
    );
};

const OptionTile = ({
    icon: Icon,
    title,
    text,
    isSelected,
    onSelect,
}: {
    icon: typeof Gift01;
    title: string;
    text: string;
    isSelected: boolean;
    onSelect: () => void;
}) => (
    <ChoiceTile isSelected={isSelected} onSelect={onSelect} className="items-start gap-3 p-4">
        <RadioButtonBase size="md" isSelected={isSelected} />
        <span className="flex min-w-0 flex-1 flex-col">
            <span className="flex items-center gap-2 text-sm font-semibold text-primary">
                <Icon className="size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />
                {title}
            </span>
            <span className="mt-0.5 text-sm text-tertiary">{text}</span>
        </span>
    </ChoiceTile>
);

/** The card itself: the chosen art with the club name and value on top. Kept small. */
export const CardFace = ({
    design,
    value,
    code,
    revealCode,
    className,
}: {
    design: CardDesign;
    value: number;
    code?: string;
    /** Show the whole code (the owner's copy) instead of masking it. */
    revealCode?: boolean;
    className?: string;
}) => (
    <div className={cx("relative aspect-[3/2] w-full max-w-[320px] overflow-hidden rounded-xl shadow-md ring-1 ring-secondary", className)}>
        <img src={imageSrc(design.art)} alt={`${design.name} gift card`} className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-black/30" aria-hidden="true" />
        <div className="relative flex h-full flex-col justify-between p-4 text-white">
            <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-semibold">{CLUB_NAME}</span>
                <span className="rounded-full px-2 py-0.5 text-xs font-semibold tracking-wide uppercase ring-1 ring-white/70">Gift card</span>
            </div>
            <div className="flex items-end justify-between gap-2">
                <span className="text-display-md font-semibold tabular-nums">{value > 0 ? money0(value) : "$—"}</span>
                {code && <span className="font-mono text-xs opacity-90">{revealCode ? code : maskCode(code)}</span>}
            </div>
        </div>
    </div>
);

/** The card's art as a small thumbnail, for cart and receipt line items. */
export const CardThumb = ({ design, className }: { design: CardDesign; className?: string }) => (
    <img src={imageSrc(design.art)} alt="" className={cx("aspect-[3/2] shrink-0 rounded-lg object-cover ring-1 ring-secondary", className)} />
);

/** Card value, deal bonus and what the golfer pays, in the shop's summary-row style. */
export const GiftCardTotals = ({ value, price }: { value: number; price: number }) => (
    <>
        <div className="flex justify-between">
            <span className="text-tertiary">Card value</span>
            <span className="font-medium text-primary tabular-nums">{value > 0 ? money(value) : "—"}</span>
        </div>
        {value > price && (
            <div className="flex justify-between">
                <span className="text-tertiary">Deal bonus</span>
                <span className="font-medium text-success-primary tabular-nums">+{money(value - price)}</span>
            </div>
        )}
        <div className="mt-1 flex items-baseline justify-between border-t border-secondary pt-3">
            <span className="text-md font-semibold text-primary">You pay</span>
            <span className="text-md font-semibold text-primary tabular-nums">{price > 0 ? money(price) : "—"}</span>
        </div>
    </>
);

export { formatDate };
