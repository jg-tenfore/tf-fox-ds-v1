import { ArrowLeft } from "@untitledui/icons";
import { course } from "@/components/booking/sagamore-data";
import { STORE_PRODUCTS, type StoreProduct } from "@/components/store/store-catalog";
import { SagamoreLogo } from "@/components/foundations/sagamore/sagamore-logo";
import { cx } from "@/utils/cx";

/** Shared bits for the Cart / Add-ons / Checkout flow. */

export const money = (n: number) => `$${n.toFixed(2)}`;
export const priceOf = (p: StoreProduct) => (p.onSale && p.salePrice ? p.salePrice : p.price);

export interface Line {
    product: StoreProduct;
    variant: string;
    qty: number;
}

const pick = (cat: string) => STORE_PRODUCTS.find((p) => p.category === cat)!;

export const INITIAL_LINES: Line[] = [
    { product: pick("apparel"), variant: "White · L", qty: 1 },
    { product: pick("shoes"), variant: "Size 10.5", qty: 1 },
    { product: pick("equipment"), variant: "Dozen", qty: 2 },
];

/** Products suggested in the interim "add more" step (not already in the cart). */
export const RECOMMENDED: StoreProduct[] = STORE_PRODUCTS.filter((p) => p.inStock && !INITIAL_LINES.some((l) => l.product.id === p.id)).slice(0, 8);

/** Free-shipping threshold for the progress bar. */
export const FREE_SHIP = 500;

export const subtotalOf = (lines: Line[]) => lines.reduce((s, l) => s + priceOf(l.product) * l.qty, 0);
export const countOf = (lines: Line[]) => lines.reduce((n, l) => n + l.qty, 0);

/** Black header bar — matches the Checkout screen. */
export const CartHeader = () => (
    <header className="relative flex flex-col items-center gap-2 bg-primary-solid px-6 py-6 text-center">
        <button type="button" aria-label="Back" className="absolute top-1/2 left-6 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition duration-100 ease-linear hover:bg-white/20">
            <ArrowLeft className="size-5" aria-hidden="true" />
        </button>
        <SagamoreLogo className="h-12 w-auto" />
        <span className="text-base font-semibold text-white">{course.name}</span>
    </header>
);

/** Free-shipping progress bar + prompt. */
export const ShipProgress = ({ subtotal }: { subtotal: number }) => {
    const remaining = Math.max(0, FREE_SHIP - subtotal);
    return (
        <div>
            <p className={cx("text-sm font-medium", remaining > 0 ? "text-brand-secondary" : "text-success-primary")}>
                {remaining > 0 ? `Add ${money(remaining)} for free shipping` : "You've unlocked free shipping!"}
            </p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-quaternary">
                <div className="h-full rounded-full bg-brand-solid transition-all duration-300 ease-out" style={{ width: `${Math.min(1, subtotal / FREE_SHIP) * 100}%` }} />
            </div>
        </div>
    );
};
