import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { ArrowRight, Plus } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import type { StoreProduct } from "@/components/store/store-catalog";
import { CartHeader, INITIAL_LINES, type Line, money, priceOf, RECOMMENDED, ShipProgress, subtotalOf } from "./cart-shared";
import { badgesFor, logoFor } from "./store-ui";
import { SiteFooter } from "./tenfore-chrome";

/**
 * "Cart / Add More" — the interim step between cart and checkout: a "you might also
 * like" grid of Pro Shop products the golfer can add, with an "add $X for free
 * shipping" progress bar and a running cart summary. Continues to checkout.
 */
const meta: Meta = { title: "Shop Checkout/Add More", parameters: { layout: "fullscreen" } };
export default meta;
type Story = StoryObj;

const AddOnCard = ({ product, onAdd }: { product: StoreProduct; onAdd: () => void }) => {
    const logo = logoFor(product);
    return (
        <div className="flex flex-col">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-primary ring-1 ring-secondary ring-inset">
                <img src={product.src} alt={product.title} className="size-full object-contain p-5" loading="lazy" />
                <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
                    {badgesFor(product).map((b) => (
                        <Badge key={b.label} color={b.color} size="sm" type="pill-color">
                            {b.label}
                        </Badge>
                    ))}
                </div>
            </div>
            {logo && (
                <div className="mt-3 flex items-center gap-2">
                    <span className="flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary ring-1 ring-secondary ring-inset">
                        <img src={logo.src} alt="" className="max-h-3.5 max-w-3.5 object-contain" loading="lazy" />
                    </span>
                    <span className="truncate text-xs font-medium text-secondary">{logo.name}</span>
                </div>
            )}
            <p className="mt-1.5 truncate text-sm font-semibold tracking-wide text-primary uppercase">{product.title}</p>
            <p className="mt-1 text-sm font-semibold text-primary tabular-nums">{money(priceOf(product))}</p>
            <Button color="secondary" size="sm" iconLeading={Plus} className="mt-2.5 w-full" onClick={onAdd}>
                Add to cart
            </Button>
        </div>
    );
};

const AddMoreScreen = () => {
    const [lines, setLines] = useState<Line[]>(INITIAL_LINES);
    const add = (product: StoreProduct) =>
        setLines((ls) => {
            const i = ls.findIndex((l) => l.product.id === product.id);
            if (i >= 0) return ls.map((l, idx) => (idx === i ? { ...l, qty: l.qty + 1 } : l));
            return [...ls, { product, variant: "", qty: 1 }];
        });

    const subtotal = subtotalOf(lines);

    return (
        <div className="flex min-h-dvh flex-col bg-secondary">
            <CartHeader />
            <main className="mx-auto w-full max-w-[1080px] flex-1 px-6 pt-10 pb-20">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                    {/* Left — recommendations */}
                    <div>
                        <h1 className="text-display-sm font-semibold text-primary">Add more to your order</h1>
                        <p className="mt-2 text-md text-tertiary">You might also like these Pro Shop picks — add a few before you check out.</p>
                        <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3">
                            {RECOMMENDED.map((p) => (
                                <AddOnCard key={p.id} product={p} onAdd={() => add(p)} />
                            ))}
                        </div>
                    </div>

                    {/* Right — running summary */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-6 flex flex-col gap-4">
                            <section className="flex flex-col rounded-xl bg-primary ring-1 ring-secondary ring-inset">
                                <header className="border-b border-secondary px-5 py-4">
                                    <h3 className="text-md font-semibold text-primary">Your cart</h3>
                                </header>
                                <div className="divide-y divide-secondary px-5">
                                    {lines.map((l) => (
                                        <div key={l.product.id} className="flex items-center gap-3 py-3">
                                            <div className="size-12 shrink-0 overflow-hidden rounded-lg bg-secondary ring-1 ring-secondary ring-inset">
                                                <img src={l.product.src} alt="" className="size-full object-contain p-1" loading="lazy" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium text-primary">{l.product.title}</p>
                                                <p className="text-xs text-tertiary">Qty {l.qty}</p>
                                            </div>
                                            <span className="shrink-0 text-sm font-semibold text-primary tabular-nums">{money(priceOf(l.product) * l.qty)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-secondary px-5 py-4">
                                    <ShipProgress subtotal={subtotal} />
                                    <div className="mt-4 flex items-center justify-between text-sm">
                                        <span className="font-semibold text-primary">Subtotal</span>
                                        <span className="font-semibold text-primary tabular-nums">{money(subtotal)}</span>
                                    </div>
                                </div>
                            </section>

                            <Button color="primary" size="lg" iconTrailing={ArrowRight} className="w-full">
                                Continue to checkout
                            </Button>
                            <button type="button" className="text-center text-sm font-semibold text-secondary underline underline-offset-2">
                                Back to cart
                            </button>
                        </div>
                    </aside>
                </div>
            </main>
            <SiteFooter />
        </div>
    );
};

export const Default: Story = { name: "Add More", render: () => <AddMoreScreen /> };
