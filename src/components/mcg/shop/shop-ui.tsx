"use client";

/**
 * Shared furniture for the MCG Pro Shop screens — the product tile, the media frame
 * that stands in for photography on MCG-badged goods, the quantity stepper and the
 * order-summary rows.
 *
 * Every screen in this folder renders its own `McgShell`, so these pieces are pure
 * content: no chrome, no routing, no session reads. That keeps a Storybook story and
 * the routed page rendering exactly the same markup.
 */

import type { ReactNode } from "react";
import { Heart, Minus, Plus } from "@untitledui/icons";
import Link from "next/link";
import { Badge } from "@/components/base/badges/badges";
import { McgLogo } from "@/components/foundations/mcg/mcg-logo";
import { type ShopProduct, badgesFor, money } from "@/components/mcg/shop-catalog";
import { StarRating } from "@/stories/explorations/store-ui";
import { useSession } from "@/components/mcg/session";
import { cx } from "@/utils/cx";

/* ------------------------------------------------------------------ */
/* Media                                                               */
/* ------------------------------------------------------------------ */

/**
 * A product's picture. MCG-badged merchandise has no photography — a logo tile is the
 * honest stand-in, and it doubles as the shelf's visual signature on the storefront.
 */
export const ProductMedia = ({ product, className, markClassName }: { product: ShopProduct; className?: string; markClassName?: string }) => {
    if (product.image) {
        return <img src={product.image} alt={product.name} className={cx("size-full object-contain p-5", className)} loading="lazy" />;
    }
    return (
        <span className={cx("flex size-full flex-col items-center justify-center gap-2 bg-brand-secondary", className)}>
            <McgLogo className={cx("h-14 w-auto", markClassName)} />
            <span className="px-6 text-center text-xs font-semibold tracking-wide text-brand-secondary uppercase">Montgomery County Golf</span>
        </span>
    );
};

/* ------------------------------------------------------------------ */
/* Price                                                               */
/* ------------------------------------------------------------------ */

/**
 * Price, leading with the one that applies to this golfer.
 *
 * A pass costs two different amounts depending on county residency, so the card
 * shows both rather than splitting into two near-identical SKUs. Whichever the
 * session says you are is the big number; the other sits beside it as context.
 */
export const PriceLine = ({ product, className }: { product: ShopProduct; className?: string }) => {
    const { isResident } = useSession();
    const hasResidentRate = typeof product.residentPrice === "number" && product.residentPrice !== product.price;
    const lead = hasResidentRate && isResident ? product.residentPrice! : product.price;
    const other = hasResidentRate ? (isResident ? product.price : product.residentPrice!) : null;

    return (
        <p className={cx("flex flex-wrap items-baseline gap-x-2 gap-y-0.5", className)}>
            <span className="font-semibold text-primary tabular-nums">{money(lead)}</span>
            {hasResidentRate ? (
                <span className="text-tertiary tabular-nums">
                    {isResident ? "resident" : "non-resident"} · {money(other!)} {isResident ? "non-resident" : "resident"}
                </span>
            ) : (
                product.compareAt && <span className="text-tertiary tabular-nums line-through">{money(product.compareAt)}</span>
            )}
        </p>
    );
};

/* ------------------------------------------------------------------ */
/* Brand row                                                           */
/* ------------------------------------------------------------------ */

/** Brand mark in a white circle plus the name — matching the Sagamore shop card. */
export const BrandRow = ({ product }: { product: ShopProduct }) => (
    <div className="flex items-center gap-2">
        <span className="flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary ring-1 ring-secondary ring-inset">
            {product.brandLogo ? (
                <img src={product.brandLogo} alt="" className="max-h-3.5 max-w-3.5 object-contain" loading="lazy" />
            ) : (
                <McgLogo className="max-h-4 max-w-4 object-contain" />
            )}
        </span>
        <span className="truncate text-xs font-medium text-secondary">{product.brand}</span>
    </div>
);

/* ------------------------------------------------------------------ */
/* Product tile                                                        */
/* ------------------------------------------------------------------ */

/** A storefront tile. The whole image is the link; the heart sits above it. */
export const ProductTile = ({ product, saved, onToggleSave }: { product: ShopProduct; saved?: boolean; onToggleSave?: () => void }) => (
    <div className="group flex flex-col">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-primary ring-1 ring-secondary transition duration-100 ease-linear ring-inset hover:ring-brand">
            <Link
                href={`/shop/${product.slug}`}
                aria-label={product.name}
                className="block size-full focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus-ring"
            >
                <ProductMedia product={product} />
            </Link>
            <div className="pointer-events-none absolute top-3 left-3 flex flex-col items-start gap-1.5">
                {badgesFor(product).map((badge) => (
                    <Badge key={badge.label} color={badge.color} size="sm" type="pill-color">
                        {badge.label}
                    </Badge>
                ))}
            </div>
            <button
                type="button"
                aria-label={saved ? `Remove ${product.name} from saved` : `Save ${product.name}`}
                aria-pressed={saved}
                onClick={onToggleSave}
                className={cx(
                    "absolute right-3 bottom-3 flex size-9 items-center justify-center rounded-full text-white transition duration-100 ease-linear",
                    saved ? "bg-brand-solid hover:bg-brand-solid_hover" : "bg-black/40 backdrop-blur-sm hover:bg-black/55",
                )}
            >
                <Heart strokeWidth={2.5} className={cx("size-4.5", saved && "fill-current")} aria-hidden="true" />
            </button>
        </div>

        <div className="mt-3">
            <BrandRow product={product} />
        </div>
        <Link
            href={`/shop/${product.slug}`}
            className="mt-1.5 text-sm font-semibold text-primary transition duration-100 ease-linear hover:text-brand-secondary"
        >
            {product.name}
        </Link>
        <StarRating rating={product.rating} count={product.reviews} className="mt-1" />
        <PriceLine product={product} className="mt-1 text-sm" />
    </div>
);

/* ------------------------------------------------------------------ */
/* Quantity                                                            */
/* ------------------------------------------------------------------ */

export const QtyStepper = ({
    qty,
    onChange,
    min = 1,
    max = 20,
    label = "Quantity",
}: {
    qty: number;
    onChange: (qty: number) => void;
    min?: number;
    max?: number;
    label?: string;
}) => (
    <div className="flex items-center gap-1.5" role="group" aria-label={label}>
        <button
            type="button"
            aria-label="Decrease quantity"
            disabled={qty <= min}
            onClick={() => onChange(qty - 1)}
            className="flex size-8 items-center justify-center rounded-full ring-1 ring-secondary transition duration-100 ease-linear ring-inset hover:bg-primary_hover disabled:cursor-not-allowed disabled:opacity-50"
        >
            <Minus className="size-3.5 text-fg-secondary" aria-hidden="true" />
        </button>
        <span className="w-7 text-center text-sm font-semibold text-primary tabular-nums">{qty}</span>
        <button
            type="button"
            aria-label="Increase quantity"
            disabled={qty >= max}
            onClick={() => onChange(qty + 1)}
            className="flex size-8 items-center justify-center rounded-full ring-1 ring-secondary transition duration-100 ease-linear ring-inset hover:bg-primary_hover disabled:cursor-not-allowed disabled:opacity-50"
        >
            <Plus className="size-3.5 text-fg-secondary" aria-hidden="true" />
        </button>
    </div>
);

/* ------------------------------------------------------------------ */
/* Summary                                                             */
/* ------------------------------------------------------------------ */

/** A card with a titled header bar — the container every summary panel uses. */
export const Panel = ({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) => (
    <section className="flex flex-col rounded-xl bg-primary ring-1 ring-secondary ring-inset">
        <header className="flex items-center justify-between gap-3 border-b border-secondary px-5 py-4">
            <h2 className="text-md font-semibold text-primary">{title}</h2>
            {action}
        </header>
        {children}
    </section>
);

export const SummaryRow = ({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "credit" | "total" }) => (
    <div className={cx("flex items-baseline justify-between gap-4", tone === "total" && "mt-1 border-t border-secondary pt-3")}>
        <span className={cx(tone === "total" ? "text-md font-semibold text-primary" : "text-tertiary")}>{label}</span>
        <span
            className={cx(
                "tabular-nums",
                tone === "total" && "text-md font-semibold text-primary",
                tone === "credit" && "font-medium text-success-primary",
                tone === "default" && "font-medium text-primary",
            )}
        >
            {value}
        </span>
    </div>
);

/** Small uppercase label used above a block of receipt detail. */
export const MicroLabel = ({ children }: { children: ReactNode }) => (
    <p className="text-xs font-semibold tracking-wide text-quaternary uppercase">{children}</p>
);
