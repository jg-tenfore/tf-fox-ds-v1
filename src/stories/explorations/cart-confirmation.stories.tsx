import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useEffect } from "react";
import confetti from "canvas-confetti";
import { CheckCircle, Download01, LifeBuoy01, MarkerPin01, Phone, RefreshCcw01, Truck01 } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { course } from "@/components/booking/sagamore-data";
import { cx } from "@/utils/cx";
import { CartHeader, countOf, INITIAL_LINES, money, priceOf, subtotalOf } from "./cart-shared";
import { SiteFooter } from "./tenfore-chrome";

/**
 * "Cart / Confirmation - Purchase" — a receipt-style confirmation for a completed
 * Pro Shop order, duplicated from the Tee Time Confirmation: green check, order
 * number, item list, delivery, payment details, returns info, and help, with
 * confetti on load. Uses fictional customer / card data.
 */
const meta: Meta = { title: "Shop Checkout/4. Confirmation - Purchase", parameters: { layout: "fullscreen" } };
export default meta;
type Story = StoryObj;

const PayRow = ({ label, value, muted }: { label: string; value: string; muted?: boolean }) => (
    <div className="flex items-center justify-between gap-4 py-3">
        <span className="text-secondary">{label}</span>
        <span className={cx("shrink-0 tabular-nums", muted ? "text-success-primary" : "text-primary")}>{value}</span>
    </div>
);

const LINES = INITIAL_LINES;

const PurchaseConfirmationScreen = () => {
    const subtotal = subtotalOf(LINES);
    const shipping = 19.9;
    const taxes = subtotal * 0.0625;
    const total = subtotal + shipping + taxes;
    const count = countOf(LINES);

    useEffect(() => {
        confetti({ particleCount: 140, spread: 75, startVelocity: 45, origin: { y: 0.35 } });
        const t = window.setTimeout(() => confetti({ particleCount: 90, spread: 110, startVelocity: 32, origin: { y: 0.4 } }), 260);
        return () => window.clearTimeout(t);
    }, []);

    return (
        <div className="flex min-h-dvh flex-col bg-secondary">
            <CartHeader />

            <main className="flex-1 px-6 pt-10 pb-20">
                <div className="mx-auto max-w-2xl">
                    <div className="overflow-hidden rounded-2xl bg-primary shadow-sm ring-1 ring-secondary ring-inset">
                        <div className="flex justify-center px-7 pt-7">
                            <FeaturedIcon icon={CheckCircle} size="lg" color="success" theme="light" />
                        </div>

                        <div className="px-7 pt-4 text-center">
                            <p className="text-xs font-semibold tracking-wide text-quaternary uppercase">Order confirmation</p>
                            <p className="mt-1 text-lg font-semibold text-primary tabular-nums">#SG-100482</p>
                        </div>

                        <div className="px-7 pt-4 pb-7 text-center">
                            <h1 className="text-2xl font-semibold text-primary">Thank you, Alex!</h1>
                            <p className="mt-2 text-md text-tertiary">Your Pro Shop order is confirmed. We'll email tracking when it ships.</p>
                            <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary">
                                <Truck01 className="size-4 text-fg-quaternary" aria-hidden="true" /> Estimated arrival Aug 14–17
                            </p>
                        </div>

                        {/* Items */}
                        <section className="border-t border-secondary px-7 py-7">
                            <div className="flex items-center justify-between gap-3">
                                <h2 className="text-lg font-semibold text-primary">
                                    Items <span className="text-tertiary">({count})</span>
                                </h2>
                                <Badge color="success" size="md" type="pill-color">
                                    Paid
                                </Badge>
                            </div>
                            <div className="mt-4 flex flex-col gap-4">
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
                        </section>

                        {/* Delivery */}
                        <section className="border-t border-secondary px-7 py-7">
                            <h2 className="text-lg font-semibold text-primary">Delivery</h2>
                            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:justify-between">
                                <div>
                                    <p className="text-xs font-semibold tracking-wide text-quaternary uppercase">Ship to</p>
                                    <p className="mt-1 text-sm font-medium text-primary">Alex Morgan</p>
                                    <p className="text-sm text-tertiary">118 Fairway Dr</p>
                                    <p className="text-sm text-tertiary">Brookline, MA 02445, US</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold tracking-wide text-quaternary uppercase">Method</p>
                                    <p className="mt-1 text-sm font-medium text-primary">Ground Shipping</p>
                                    <p className="text-sm text-tertiary">4 to 7 business days</p>
                                    <p className="text-sm text-tertiary">Arrives Aug 14–17</p>
                                </div>
                            </div>
                        </section>

                        {/* Payment details */}
                        <section className="border-t border-secondary px-7 py-7">
                            <h2 className="text-lg font-semibold text-primary">Payment details</h2>
                            <div className="mt-4 flex flex-col divide-y divide-secondary border-y border-secondary text-sm">
                                <PayRow label={`Subtotal · ${count} items`} value={money(subtotal)} />
                                <PayRow label="Shipping — Ground" value={money(shipping)} />
                                <PayRow label="Estimated taxes" value={money(taxes)} />
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                                <span className="text-base font-semibold text-primary">Total charged</span>
                                <span className="text-base font-semibold text-primary tabular-nums">{money(total)}</span>
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                                <span className="flex items-center gap-2.5 text-sm text-secondary">
                                    <img src="card-images/Amex.svg" alt="American Express" className="h-6 w-auto" />
                                    American Express ···· 3005
                                </span>
                                <span className="text-sm text-secondary tabular-nums">{money(total)}</span>
                            </div>
                            <p className="mt-4 text-xs text-tertiary">Paid online on August 8, 2026.</p>
                            <Button color="secondary" size="lg" iconLeading={Download01} className="mt-6 w-full">
                                Download PDF receipt
                            </Button>
                        </section>

                        {/* Returns */}
                        <section className="border-t border-secondary px-7 py-7">
                            <h2 className="text-lg font-semibold text-primary">Returns &amp; exchanges</h2>
                            <p className="mt-3 text-sm leading-relaxed text-tertiary">
                                Unworn items with tags can be returned within 30 days for a full refund. Custom-fit and personalized items are final sale. Bring your
                                receipt to the Pro Shop or start a return online.
                            </p>
                            <div className="mt-6 flex flex-col gap-3">
                                <Button color="secondary" size="lg" iconLeading={Truck01} className="w-full">
                                    Track order
                                </Button>
                                <Button color="secondary" size="lg" iconLeading={RefreshCcw01} className="w-full">
                                    Start a return
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
                                        <p className="text-sm font-semibold text-primary">Questions about your order</p>
                                        <p className="mt-1 text-sm text-tertiary">
                                            Contact the {course.name} Pro Shop at{" "}
                                            <a href="tel:7813343151" className="font-medium text-brand-secondary hover:underline">
                                                {course.phone}
                                            </a>
                                            .
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <LifeBuoy01 className="mt-0.5 size-5 shrink-0 text-fg-brand-primary" aria-hidden="true" />
                                    <div>
                                        <p className="text-sm font-semibold text-primary">Help with this receipt or your account</p>
                                        <p className="mt-1 text-sm text-tertiary">
                                            Reach TenFore support 24/7 —{" "}
                                            <a href="#" className="font-medium text-brand-secondary hover:underline">
                                                get support
                                            </a>
                                            .
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            <SiteFooter />
        </div>
    );
};

export const Default: Story = { name: "Confirmation - Purchase", render: () => <PurchaseConfirmationScreen /> };
