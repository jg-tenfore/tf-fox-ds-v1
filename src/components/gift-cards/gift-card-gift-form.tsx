"use client";

import { type ReactNode, useState } from "react";
import { Bookmark, CreditCard02, CurrencyDollar, Gift01, InfoCircle, User01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { TextArea } from "@/components/base/textarea/textarea";
import { type GiftCardGift, type GiftCardOffer, offerHeadline } from "./gift-card-offers";

/**
 * The live shop's gift form (fox.tenfore.golf/…/shop/gift-cards/gift), rebuilt with the Fox
 * design system. Send as a Gift and Purchase as Gift open it. Same parts in the same order:
 * who it's from (with Change), who it's to (name, email twice, phone twice), the offer or
 * amount being bought, an optional message, then Back or Add Gift to Cart.
 */

export interface GiftFormValues {
    firstName: string;
    lastName: string;
    email: string;
    confirmEmail: string;
    phone: string;
    confirmPhone: string;
    message: string;
    /** Only asked for when the golfer chose Purchase as Gift without typing an amount. */
    amount: string;
}

export interface GiftSender {
    name: string;
    email: string;
}

export interface GiftCardGiftFormProps {
    /** The special offer being sent (from Send as a Gift). */
    offer?: GiftCardOffer;
    /** The amount typed on the page (from Purchase as Gift); null when it was left empty. */
    amount?: number | null;
    /** The signed-in golfer. */
    sender: GiftSender;
    defaults?: Partial<GiftFormValues>;
    /** Open with the field errors showing, as after Add Gift to Cart with something missing. */
    showErrors?: boolean;
    goodFor: string[];
    onBack?: () => void;
    onAddToCart?: (gift: GiftCardGift) => void;
}

const EMPTY: GiftFormValues = { firstName: "", lastName: "", email: "", confirmEmail: "", phone: "", confirmPhone: "", message: "", amount: "" };

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
const digits = (value: string) => value.replace(/\D/g, "");
const parseAmount = (raw: string) => {
    const value = Number(raw.replace(/[$,\s]/g, ""));
    return raw.trim() !== "" && Number.isFinite(value) && value > 0 ? Math.round(value * 100) / 100 : null;
};
const money = (n: number) => `$${n.toFixed(2)}`;

export const GiftCardGiftForm = ({
    offer,
    amount = null,
    sender: initialSender,
    defaults,
    showErrors = false,
    goodFor,
    onBack,
    onAddToCart,
}: GiftCardGiftFormProps) => {
    const [values, setValues] = useState<GiftFormValues>({ ...EMPTY, ...defaults });
    const [sender, setSender] = useState(initialSender);
    const [editingSender, setEditingSender] = useState(false);
    const [touched, setTouched] = useState(showErrors);

    const set = (key: keyof GiftFormValues) => (value: string) => setValues((v) => ({ ...v, [key]: value }));
    const askAmount = !offer && amount === null;
    const typedAmount = parseAmount(values.amount);

    const errors: Partial<Record<keyof GiftFormValues | "senderName" | "senderEmail", string>> = {
        firstName: values.firstName.trim() ? undefined : "First name is required",
        lastName: values.lastName.trim() ? undefined : "Last name is required",
        email: !values.email.trim() ? "Email is required" : !isEmail(values.email) ? "Enter a valid email" : undefined,
        confirmEmail: !values.confirmEmail.trim()
            ? "Confirm the email"
            : values.confirmEmail.trim().toLowerCase() !== values.email.trim().toLowerCase()
              ? "Emails do not match"
              : undefined,
        confirmPhone: digits(values.phone) !== digits(values.confirmPhone) ? "Phone numbers do not match" : undefined,
        amount: askAmount && typedAmount === null ? "Amount is required" : undefined,
        senderName: sender.name.trim() ? undefined : "Name is required",
        senderEmail: isEmail(sender.email) ? undefined : "Enter a valid email",
    };
    const show = (key: keyof typeof errors) => (touched ? errors[key] : undefined);
    const isValid = !Object.values(errors).some(Boolean);

    const addToCart = () => {
        setTouched(true);
        if (!isValid) return;
        const to = {
            firstName: values.firstName.trim(),
            lastName: values.lastName.trim(),
            email: values.email.trim(),
            phone: digits(values.phone) ? values.phone.trim() : undefined,
        };
        const from = { name: sender.name.trim(), email: sender.email.trim() };
        onAddToCart?.(
            offer
                ? { offerId: offer.id, to, from, message: values.message }
                : { amount: (askAmount ? typedAmount : amount) ?? 0, to, from, message: values.message },
        );
    };

    return (
        <section className="mx-auto flex max-w-[1120px] flex-col gap-8 rounded-2xl bg-primary p-6 shadow-xs ring-1 ring-secondary @3xl:p-8">
            <h1 className="flex items-center gap-3 text-display-sm font-semibold text-primary">
                <Gift01 className="size-8 shrink-0 text-fg-primary" aria-hidden="true" />
                Gift Card
            </h1>

            <FormSection
                icon={User01}
                title="From (Sender Information)"
                action={
                    <Button color="link-color" size="md" onClick={() => setEditingSender((e) => !e)}>
                        {editingSender ? "Done" : "Change"}
                    </Button>
                }
            >
                {editingSender ? (
                    <div className="grid grid-cols-1 gap-4 @3xl:grid-cols-2">
                        <Input
                            label="Name"
                            value={sender.name}
                            onChange={(name) => setSender((s) => ({ ...s, name }))}
                            isInvalid={!!show("senderName")}
                            hint={show("senderName")}
                        />
                        <Input
                            label="Email"
                            type="email"
                            value={sender.email}
                            onChange={(email) => setSender((s) => ({ ...s, email }))}
                            isInvalid={!!show("senderEmail")}
                            hint={show("senderEmail")}
                        />
                    </div>
                ) : (
                    <p className="text-md text-tertiary">
                        <span className="font-medium text-primary">{sender.name}</span> ({sender.email})
                    </p>
                )}
            </FormSection>

            <FormSection icon={Bookmark} title="To (Recipient Information)">
                <div className="grid grid-cols-1 gap-x-6 gap-y-4 @3xl:grid-cols-2">
                    <Input
                        label="First Name"
                        placeholder="First Name"
                        value={values.firstName}
                        onChange={set("firstName")}
                        isInvalid={!!show("firstName")}
                        hint={show("firstName")}
                    />
                    <Input
                        label="Last Name"
                        placeholder="Last Name"
                        value={values.lastName}
                        onChange={set("lastName")}
                        isInvalid={!!show("lastName")}
                        hint={show("lastName")}
                    />
                    <Input
                        label="Email"
                        type="email"
                        placeholder="Email"
                        value={values.email}
                        onChange={set("email")}
                        isInvalid={!!show("email")}
                        hint={show("email")}
                    />
                    <Input
                        label="Confirm Email"
                        type="email"
                        placeholder="Confirm Email"
                        value={values.confirmEmail}
                        onChange={set("confirmEmail")}
                        isInvalid={!!show("confirmEmail")}
                        hint={show("confirmEmail")}
                    />
                    <Input label="Phone (optional)" type="tel" inputMode="tel" placeholder="Phone (optional)" value={values.phone} onChange={set("phone")} />
                    <Input
                        label="Confirm Phone (optional)"
                        type="tel"
                        inputMode="tel"
                        placeholder="Confirm Phone (optional)"
                        value={values.confirmPhone}
                        onChange={set("confirmPhone")}
                        isInvalid={!!show("confirmPhone")}
                        hint={show("confirmPhone")}
                    />
                </div>
            </FormSection>

            <FormSection icon={CreditCard02} title="Gift Card Details">
                <div className="flex flex-col gap-6">
                    {askAmount ? (
                        <Input
                            label="Amount (USD)"
                            icon={CurrencyDollar}
                            placeholder="0.00"
                            inputMode="decimal"
                            value={values.amount}
                            onChange={set("amount")}
                            isInvalid={!!show("amount")}
                            hint={show("amount")}
                            className="w-full max-w-xs"
                        />
                    ) : (
                        <div className="flex flex-col rounded-2xl bg-primary p-5 ring-2 ring-brand ring-inset @3xl:p-6">
                            <p className="text-md font-semibold text-primary">{offer ? offer.name : "Gift card"}</p>
                            <p className="mt-1 text-display-xs font-semibold text-brand-secondary">
                                {offer ? offerHeadline(offer) : `${money(amount ?? 0)} gift card`}
                            </p>
                            <p className="mt-1 text-md text-tertiary">Good for {goodFor.join(", ")}</p>
                        </div>
                    )}

                    <TextArea
                        label="Personal Message (optional)"
                        placeholder="Personal message (optional)"
                        rows={4}
                        value={values.message}
                        onChange={set("message")}
                        hint={
                            <span className="flex items-center gap-2">
                                <InfoCircle className="size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />
                                Add a personal touch! Your message will be included in the recipient&apos;s gift card email.
                            </span>
                        }
                    />
                </div>
            </FormSection>

            <div className="flex flex-col-reverse gap-3 @xl:flex-row @xl:justify-end">
                <Button size="xl" color="secondary" onClick={onBack}>
                    Back
                </Button>
                <Button size="xl" color="primary" onClick={addToCart}>
                    Add Gift to Cart
                </Button>
            </div>
        </section>
    );
};

const FormSection = ({ icon: Icon, title, action, children }: { icon: typeof User01; title: string; action?: ReactNode; children: ReactNode }) => (
    <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-4 border-b border-secondary pb-4">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-primary">
                <Icon className="size-6 shrink-0 text-fg-primary" aria-hidden="true" />
                {title}
            </h2>
            {action}
        </div>
        {children}
    </div>
);
