import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { type ReactNode, useState } from "react";
import { ChevronDown, ChevronUp, Clock, CreditCard01, DotsVertical, HelpCircle, Lock01, Plus, SearchLg, XClose } from "@untitledui/icons";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { RadioButtonBase } from "@/components/base/radio-buttons/radio-buttons";
import { cx } from "@/utils/cx";
import { CartHeader, countOf, INITIAL_LINES, money, priceOf, subtotalOf } from "./cart-shared";
import { SiteFooter } from "./tenfore-chrome";

/**
 * "Cart / Checkout" — the Pro Shop checkout, modeled on the Shop (Shopify) pattern:
 * a left column with contact, ship-to (saved addresses + add-address modal),
 * shipping, plan, and an expanded saved-cards payment list, plus a right order
 * summary with points/rewards, a discount field, and totals. Uses native Untitled
 * UI radios and fictional customer / card data. Re-skinned with design tokens.
 */
const meta: Meta = { title: "Shop Checkout/3. Checkout", parameters: { layout: "fullscreen" } };
export default meta;
type Story = StoryObj;

const LINES = INITIAL_LINES;
const CONTACT = "alex.morgan@example.com";

const SHIP = [
    { id: "s1", name: "Alex Morgan", line: "118 Fairway Dr, Brookline MA 02445, US, +1 (555) 204-1180", default: true },
    { id: "s2", name: "Jamie Rivera", line: "22 Cedar Ln, Salem MA 01970, US, +1 (555) 662-3390" },
];

type Brand = "amex" | "visa" | "mc";
// Card-brand SVGs served from the creditCards folder via the card-images staticDir.
const BRAND_IMG: Record<Brand, string> = { amex: "Amex.svg", visa: "Visa.svg", mc: "Mastercard.svg" };
const BrandChip = ({ brand }: { brand: Brand }) => <img src={`card-images/${BRAND_IMG[brand]}`} alt={brand} className="h-5 w-auto shrink-0" />;

const ADDR = "Alex Morgan, 118 Fairway Dr, Brookline MA 02445, US";
const CARDS: { id: string; brand: Brand; name: string; last4: string; exp?: string; muted?: boolean }[] = [
    { id: "amex", brand: "amex", name: "American Express", last4: "3005" },
    { id: "visa", brand: "visa", name: "Visa", last4: "4821" },
    { id: "mc", brand: "mc", name: "Mastercard", last4: "6642" },
    { id: "barclays", brand: "mc", name: "Barclays", last4: "1180", exp: "5/2026", muted: true },
];

const SectionHead = ({ label, right, open = true, onToggle }: { label: string; right?: ReactNode; open?: boolean; onToggle?: () => void }) => (
    <button type="button" onClick={onToggle} className="flex w-full items-center justify-between gap-3 text-left">
        <span className="text-sm text-tertiary">{label}</span>
        <div className="flex items-center gap-2">
            {right}
            {open ? <ChevronUp className="size-4 text-fg-quaternary" aria-hidden="true" /> : <ChevronDown className="size-4 text-fg-quaternary" aria-hidden="true" />}
        </div>
    </button>
);

/* ------------------------------ Add address --------------------------- */

const AddAddressModal = ({ onClose }: { onClose: () => void }) => (
    <>
        <div className="flex items-center justify-between px-6 pt-6">
            <h2 className="text-xl font-semibold text-primary">Add address</h2>
            <button type="button" onClick={onClose} aria-label="Close" className="flex size-8 items-center justify-center rounded-lg text-fg-quaternary transition duration-100 ease-linear hover:bg-primary_hover">
                <XClose className="size-5" aria-hidden="true" />
            </button>
        </div>
        <div className="flex flex-col gap-4 px-6 py-5">
            <Input label="Country/Region" value="United States" onChange={() => {}} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="First name" defaultValue="Alex" />
                <Input label="Last name" defaultValue="Morgan" />
            </div>
            <Input label="Address" placeholder="Start typing your address" icon={SearchLg} />
            <Input label="Apartment, suite, etc. (optional)" placeholder="" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Input label="City" placeholder="City" />
                <Input label="State" placeholder="State" />
                <Input label="ZIP code" placeholder="ZIP code" />
            </div>
            <Input label="Phone (optional)" type="tel" defaultValue="+1 (555) 204-1180" />
            <Checkbox label="This is my default address" />
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-secondary px-6 py-4">
            <Button color="secondary" size="md" onClick={onClose}>
                Cancel
            </Button>
            <Button color="primary" size="md" onClick={onClose}>
                Save address
            </Button>
        </div>
    </>
);

/* --------------------------- Payment methods -------------------------- */

const CircleClose = ({ onClose }: { onClose: () => void }) => (
    <button type="button" onClick={onClose} aria-label="Close" className="flex size-8 items-center justify-center rounded-full text-fg-secondary ring-1 ring-secondary transition duration-100 ease-linear ring-inset hover:bg-primary_hover">
        <XClose className="size-5" aria-hidden="true" />
    </button>
);

const PaymentMethodsModal = ({ onClose }: { onClose: () => void }) => {
    const [method, setMethod] = useState<"card" | "paypal">("card");
    return (
        <>
            <div className="flex items-center justify-between px-6 pt-6">
                <h2 className="text-xl font-semibold text-primary">Payment methods</h2>
                <CircleClose onClose={onClose} />
            </div>
            <div className="flex flex-col gap-4 px-6 py-5">
                {/* Credit card */}
                <div className="overflow-hidden rounded-2xl ring-1 ring-secondary ring-inset">
                    <button type="button" onClick={() => setMethod("card")} className={cx("flex w-full items-center justify-between gap-3 px-4 py-3.5", method === "card" && "bg-secondary")}>
                        <span className="flex items-center gap-3">
                            <RadioButtonBase size="md" isSelected={method === "card"} />
                            <span className="text-sm font-semibold text-primary">Credit card</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                            <BrandChip brand="visa" />
                            <BrandChip brand="mc" />
                            <BrandChip brand="amex" />
                            <span className="rounded bg-tertiary px-1.5 py-0.5 text-[10px] font-bold text-secondary">+5</span>
                        </span>
                    </button>
                    {method === "card" && (
                        <div className="flex flex-col gap-3 border-t border-secondary p-4">
                            <Input aria-label="Card number" placeholder="Card number" icon={Lock01} />
                            <div className="grid grid-cols-2 gap-3">
                                <Input aria-label="Expiration date" placeholder="Expiration date (MM / YY)" />
                                <Input aria-label="Security code" placeholder="Security code" icon={HelpCircle} />
                            </div>
                            <Input label="Name on card" defaultValue="Alex Morgan" />
                            <Input aria-label="Nickname" placeholder="Nickname (optional)" />
                        </div>
                    )}
                </div>

                {/* Bill to */}
                <div className="flex items-start justify-between gap-3 rounded-2xl px-4 py-3.5 ring-1 ring-secondary ring-inset">
                    <div className="flex gap-6">
                        <span className="w-12 shrink-0 text-sm text-tertiary">Bill to</span>
                        <div>
                            <p className="text-sm font-semibold text-primary">Alex Morgan</p>
                            <p className="text-sm text-tertiary">118 Fairway Dr</p>
                            <p className="text-sm text-tertiary">Brookline MA 02445, US</p>
                        </div>
                    </div>
                    <ChevronDown className="size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />
                </div>

                {/* Other options */}
                <div>
                    <p className="mb-2 text-sm text-tertiary">Other payment options in guest checkout</p>
                    <button type="button" onClick={() => setMethod("paypal")} className={cx("flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3.5 ring-1 ring-secondary ring-inset", method === "paypal" && "bg-secondary")}>
                        <span className="flex items-center gap-3">
                            <RadioButtonBase size="md" isSelected={method === "paypal"} />
                            <span className="text-sm font-semibold text-primary">PayPal</span>
                        </span>
                        <img src="card-images/PayPal.svg" alt="PayPal" className="h-5 w-auto" />
                    </button>
                </div>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-secondary px-6 py-4">
                <Button color="secondary" size="md" onClick={onClose}>
                    Cancel
                </Button>
                <Button color="primary" size="md" onClick={onClose}>
                    Save
                </Button>
            </div>
        </>
    );
};

/* -------------------------------- Screen ------------------------------ */

const CheckoutScreen = () => {
    const [addr, setAddr] = useState("s1");
    const [shipOpen, setShipOpen] = useState(false);
    const [plan, setPlan] = useState<"now" | "installments">("now");
    const [card, setCard] = useState("amex");
    const [addrOpen, setAddrOpen] = useState(false);
    const [payOpen, setPayOpen] = useState(false);
    const [code, setCode] = useState("");
    const [applied, setApplied] = useState<string | null>(null);
    const [rewardApplied, setRewardApplied] = useState(false);

    const selShip = SHIP.find((s) => s.id === addr)!;
    const count = countOf(LINES);
    const subtotal = subtotalOf(LINES);
    const discount = (applied ? 15 : 0) + (rewardApplied ? 20 : 0);
    const shipping = 19.9;
    const taxes = Math.max(0, subtotal - discount) * 0.0625;
    const total = subtotal - discount + shipping + taxes;

    return (
        <div className="flex min-h-dvh flex-col bg-secondary">
            <CartHeader />
            <main className="mx-auto w-full max-w-[1080px] flex-1 px-6 pt-10 pb-20">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
                    {/* Left */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-secondary">{CONTACT}</span>
                            <button type="button" aria-label="More" className="flex size-8 items-center justify-center rounded-lg text-fg-quaternary hover:bg-primary_hover">
                                <DotsVertical className="size-5" aria-hidden="true" />
                            </button>
                        </div>

                        <div className="flex flex-col divide-y divide-secondary rounded-2xl bg-primary ring-1 ring-secondary ring-inset">
                            {/* Ship to (collapsible) */}
                            <div className="px-5 py-4">
                                <button type="button" onClick={() => setShipOpen((o) => !o)} className="flex w-full items-center justify-between gap-4 text-left">
                                    <div className="flex min-w-0 gap-6">
                                        <span className="w-12 shrink-0 text-sm text-tertiary">Ship to</span>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-primary">{selShip.name}</p>
                                            <p className="truncate text-sm text-tertiary">{selShip.line}</p>
                                        </div>
                                    </div>
                                    {shipOpen ? <ChevronUp className="size-4 shrink-0 text-fg-quaternary" aria-hidden="true" /> : <ChevronDown className="size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />}
                                </button>
                                {shipOpen && (
                                    <div className="mt-4 flex flex-col gap-3">
                                        {SHIP.map((a) => (
                                            <div key={a.id} className="flex items-start gap-3">
                                                <button type="button" onClick={() => setAddr(a.id)} className="mt-0.5" aria-label={`Select ${a.name}`}>
                                                    <RadioButtonBase size="md" isSelected={addr === a.id} />
                                                </button>
                                                <button type="button" onClick={() => setAddr(a.id)} className="min-w-0 flex-1 text-left">
                                                    <p className="text-sm font-semibold text-primary">{a.name}</p>
                                                    <p className="text-sm text-tertiary">{a.line}</p>
                                                    {a.default && <span className="mt-1.5 inline-block rounded-md bg-tertiary px-2 py-0.5 text-[10px] font-semibold text-secondary">Default</span>}
                                                </button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => setAddrOpen(true)} className="flex items-center gap-2 self-start rounded-lg px-3 py-2 text-sm font-semibold text-brand-secondary ring-1 ring-brand transition duration-100 ease-linear ring-inset hover:bg-brand-primary">
                                            <Plus className="size-4" aria-hidden="true" /> Use a different address
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Shipping */}
                            <div className="flex flex-col gap-3 px-5 py-4">
                                <SectionHead label="Shipping" />
                                <div className="flex items-center justify-between rounded-xl bg-secondary px-4 py-3">
                                    <div>
                                        <p className="text-sm font-semibold text-primary">Ground Shipping</p>
                                        <p className="text-sm text-tertiary">4 to 7 business days</p>
                                    </div>
                                    <span className="text-sm font-semibold text-primary tabular-nums">{money(shipping)}</span>
                                </div>
                            </div>

                            {/* Plan */}
                            <div className="flex flex-col gap-2 px-5 py-4">
                                <SectionHead label="Plan" />
                                <button type="button" onClick={() => setPlan("now")} className={cx("flex items-start gap-3 rounded-xl px-4 py-3 text-left transition duration-100 ease-linear", plan === "now" ? "bg-secondary" : "hover:bg-primary_hover")}>
                                    <span className="mt-0.5">
                                        <RadioButtonBase size="md" isSelected={plan === "now"} />
                                    </span>
                                    <div>
                                        <p className="text-sm font-semibold text-primary">Pay now</p>
                                        <p className="text-sm text-tertiary">Pay the entire amount today</p>
                                    </div>
                                </button>
                                <button type="button" onClick={() => setPlan("installments")} className={cx("flex items-start gap-3 rounded-xl px-4 py-3 text-left transition duration-100 ease-linear", plan === "installments" ? "bg-secondary" : "hover:bg-primary_hover")}>
                                    <span className="mt-0.5">
                                        <RadioButtonBase size="md" isSelected={plan === "installments"} />
                                    </span>
                                    <div>
                                        <p className="flex items-center gap-2 text-sm font-semibold text-primary">
                                            Pay in installments <span className="rounded-full bg-success-secondary px-2 py-0.5 text-[10px] font-semibold text-success-primary">Prequalified</span>
                                        </p>
                                        <p className="text-sm text-tertiary">Starting at {money(total / 4)} / 2 weeks with no interest</p>
                                    </div>
                                </button>
                            </div>

                            {/* Payment — expanded saved cards */}
                            <div className="flex flex-col gap-1 px-5 py-4">
                                <SectionHead label="Payment" />
                                {CARDS.map((c) => {
                                    const selected = card === c.id;
                                    return (
                                        <div key={c.id} className={cx("rounded-xl px-4 py-3", selected && "bg-secondary", c.muted && !selected && "opacity-60")}>
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
                                                    <p className="text-sm text-tertiary">{ADDR}</p>
                                                    {c.exp && (
                                                        <span className="mt-1.5 flex items-center gap-3">
                                                            <span className="rounded-md bg-error-secondary px-2 py-0.5 text-[10px] font-semibold text-error-primary">Exp. {c.exp}</span>
                                                        </span>
                                                    )}
                                                </button>
                                                {selected && <DotsVertical className="size-5 shrink-0 text-fg-quaternary" aria-hidden="true" />}
                                            </div>
                                            {c.exp && (
                                                <button type="button" className="mt-1.5 ml-8 text-xs font-semibold text-error-primary">
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                                <div className="mt-1 flex items-center justify-between gap-2 px-1">
                                    <button type="button" onClick={() => setPayOpen(true)} className="flex items-center gap-2 py-2 text-sm font-semibold text-brand-secondary">
                                        <Plus className="size-4" aria-hidden="true" /> Pay another way
                                    </button>
                                    <span className="flex items-center gap-1 text-xs text-tertiary">
                                        <CreditCard01 className="size-5 text-fg-quaternary" aria-hidden="true" /> +1
                                    </span>
                                </div>
                            </div>
                        </div>

                        {plan === "installments" ? (
                            <div className="flex flex-col gap-2">
                                <Button color="primary" size="lg" className="w-full">
                                    Continue to payment plans
                                </Button>
                                <p className="text-xs text-tertiary">Subject to eligibility. Installments offered through a financing partner.</p>
                                <button type="button" className="self-start text-sm font-semibold text-brand-secondary underline underline-offset-2">
                                    View sample plans
                                </button>
                            </div>
                        ) : (
                            <Button color="primary" size="lg" className="w-full">
                                Pay now
                            </Button>
                        )}
                    </div>

                    {/* Right — order summary */}
                    <aside className="flex flex-col gap-5 lg:border-l lg:border-secondary lg:pl-10">
                        <div className="flex flex-col gap-3">
                            {LINES.map((l) => (
                                <div key={l.product.id} className="flex items-center gap-3">
                                    <div className="relative size-14 shrink-0">
                                        <div className="size-full overflow-hidden rounded-lg bg-secondary ring-1 ring-secondary ring-inset">
                                            <img src={l.product.src} alt="" className="size-full object-contain p-1.5" loading="lazy" />
                                        </div>
                                        {l.qty > 1 && <span className="absolute -top-2 -right-2 z-10 flex size-5 items-center justify-center rounded-full bg-primary-solid text-[10px] font-semibold text-white tabular-nums">{l.qty}</span>}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-primary">{l.product.title}</p>
                                        {l.variant && <p className="text-xs text-tertiary">{l.variant}</p>}
                                    </div>
                                    <span className="shrink-0 text-sm font-semibold text-primary tabular-nums">{money(priceOf(l.product) * l.qty)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-secondary pt-5">
                            <p className="text-sm font-medium text-primary">You have 415 points</p>
                            <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-tertiary">
                                <Clock className="size-4 text-fg-quaternary" aria-hidden="true" /> Hurry! 38 points will expire in 10 days.
                            </p>
                            <div className="mt-3 flex items-center gap-2">
                                <button type="button" className="flex flex-1 items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm ring-1 ring-secondary ring-inset">
                                    <span>
                                        <span className="block text-xs text-tertiary">Rewards</span>
                                        <span className="font-medium text-primary">$20 off for 200 points</span>
                                    </span>
                                    <ChevronDown className="size-4 text-fg-quaternary" aria-hidden="true" />
                                </button>
                                <Button color="primary" size="md" isDisabled={rewardApplied} onClick={() => setRewardApplied(true)}>
                                    {rewardApplied ? "Applied" : "Apply"}
                                </Button>
                            </div>
                        </div>

                        <div className="border-t border-secondary pt-5">
                            <div className="flex items-start gap-2">
                                <Input aria-label="Discount code or gift card" placeholder="Discount code or gift card" value={code} onChange={setCode} wrapperClassName="flex-1" />
                                <Button color="primary" size="md" isDisabled={!code.trim() || !!applied} onClick={() => setApplied(code.trim().toUpperCase())}>
                                    {applied ? "Applied" : "Apply"}
                                </Button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2.5 border-t border-secondary pt-5 text-sm">
                            <div className="flex justify-between">
                                <span className="text-secondary">Subtotal · {count} items</span>
                                <span className="font-medium text-primary tabular-nums">{money(subtotal)}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-secondary">Discount</span>
                                    <span className="font-medium text-success-primary tabular-nums">−{money(discount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="flex items-center gap-1 text-secondary">
                                    Shipping <HelpCircle className="size-3.5 text-fg-quaternary" aria-hidden="true" />
                                </span>
                                <span className="font-medium text-primary tabular-nums">{money(shipping)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="flex items-center gap-1 text-secondary">
                                    Estimated taxes <HelpCircle className="size-3.5 text-fg-quaternary" aria-hidden="true" />
                                </span>
                                <span className="font-medium text-primary tabular-nums">{money(taxes)}</span>
                            </div>
                            <div className="mt-1 flex items-baseline justify-between border-t border-secondary pt-3">
                                <span className="text-lg font-semibold text-primary">Total</span>
                                <span className="text-lg font-semibold text-primary tabular-nums">
                                    <span className="mr-1 text-xs font-medium text-tertiary">USD</span>
                                    {money(total)}
                                </span>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            <ModalOverlay isOpen={addrOpen} onOpenChange={setAddrOpen}>
                <Modal className="max-w-lg">
                    <Dialog className="max-h-[90vh] overflow-y-auto rounded-2xl bg-primary shadow-xl ring-1 ring-secondary_alt">
                        <AddAddressModal onClose={() => setAddrOpen(false)} />
                    </Dialog>
                </Modal>
            </ModalOverlay>

            <ModalOverlay isOpen={payOpen} onOpenChange={setPayOpen}>
                <Modal className="max-w-lg">
                    <Dialog className="max-h-[90vh] overflow-y-auto rounded-2xl bg-primary shadow-xl ring-1 ring-secondary_alt">
                        <PaymentMethodsModal onClose={() => setPayOpen(false)} />
                    </Dialog>
                </Modal>
            </ModalOverlay>

            <SiteFooter />
        </div>
    );
};

export const Default: Story = { name: "Checkout", render: () => <CheckoutScreen /> };
