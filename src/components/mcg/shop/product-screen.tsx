"use client";

/**
 * `/shop/[slug]` — a single product.
 *
 * The variant model is deliberately loose: a product declares whichever of sizes,
 * colours and denominations it actually has, and the page renders only those. A dozen
 * balls has a pack size and no colour; a cap has a colour and one size; a gift card has
 * a dollar value that *is* the price. One screen covers all three rather than three
 * screens covering one each.
 *
 * Adding to the cart writes through `useSession`, so the nav badge and `/cart` update
 * the moment the button is pressed.
 */

import { type ReactNode, useMemo, useState } from "react";
import { ArrowLeft, Check, CheckCircle, ChevronRight, Heart, MarkerPin01, RefreshCcw01, ShoppingBag03 } from "@untitledui/icons";
import Link from "next/link";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { mcgPhotography } from "@/components/foundations/mcg/mcg-assets";
import { McgLogo } from "@/components/foundations/mcg/mcg-logo";
import { McgPage, McgShell } from "@/components/mcg/mcg-chrome";
import { useSession } from "@/components/mcg/session";
import { CATEGORY_LABEL, type ShopProduct, badgesFor, money, money0, productBySlug, relatedTo } from "@/components/mcg/shop-catalog";
import { StarRating } from "@/stories/explorations/store-ui";
import { cx } from "@/utils/cx";
import { BrandRow, PriceLine, ProductMedia, ProductTile, QtyStepper } from "./shop-ui";

/* ------------------------------------------------------------------ */
/* Gallery                                                             */
/* ------------------------------------------------------------------ */

interface GalleryView {
    id: string;
    label: string;
    /** Absent on the MCG logo tile, which is drawn rather than photographed. */
    src?: string;
}

/**
 * The product shot first, then whatever course photography we hold — a muni shop's
 * catalog has one angle per item, so the gallery earns its thumbnails by showing the
 * item in context rather than by inventing angles that don't exist.
 */
/**
 * The thumbnail rail.
 *
 * A product with real gallery photography shows that and nothing else — several shots
 * of the actual thing beat one shot padded out with scenery. Course photography is the
 * fallback for items that have a single image (or none, like a gift card), where an
 * otherwise empty rail would look broken.
 */
const viewsFor = (product: ShopProduct): GalleryView[] => {
    const gallery = product.gallery ?? [];
    if (gallery.length > 1) {
        return gallery.map((src, i) => ({ id: src, label: i === 0 ? "Product" : `View ${i + 1}`, src }));
    }
    return [
        { id: "product", label: product.image ? "Product" : "MCG crest", src: product.image },
        ...mcgPhotography.map((photo) => ({ id: photo.src, label: photo.name, src: photo.src })),
    ];
};

/* ------------------------------------------------------------------ */
/* Option pickers                                                      */
/* ------------------------------------------------------------------ */

const OptionRow = ({ label, value, children }: { label: string; value?: string; children: ReactNode }) => (
    <div className="flex flex-col gap-2">
        <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-primary">{label}</span>
            {value && <span className="text-sm text-tertiary">{value}</span>}
        </div>
        <div className="flex flex-wrap gap-2">{children}</div>
    </div>
);

const OptionButton = ({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) => (
    <button
        type="button"
        onClick={onClick}
        aria-pressed={isActive}
        className={cx(
            "min-w-12 rounded-lg px-3 py-2 text-sm font-semibold transition duration-100 ease-linear",
            isActive ? "bg-brand-solid text-white" : "bg-primary text-secondary ring-1 ring-primary ring-inset hover:bg-primary_hover",
        )}
    >
        {label}
    </button>
);

/* ------------------------------------------------------------------ */
/* Screen                                                              */
/* ------------------------------------------------------------------ */

export interface ProductScreenProps {
    slug: string;
}

export const ProductScreen = ({ slug }: ProductScreenProps) => {
    const product = productBySlug(slug);
    const { addToCart, saved, toggleSaved } = useSession();

    const [viewId, setViewId] = useState("product");
    const [size, setSize] = useState<string | undefined>(product?.sizes?.[0]);
    const [color, setColor] = useState<string | undefined>(product?.colors?.[0]?.name);
    // Gift cards open on the face value the catalog prices them at, when it's offered.
    const [denomination, setDenomination] = useState<number | undefined>(
        product?.denominations?.includes(product?.price ?? -1) ? product?.price : product?.denominations?.[0],
    );
    const [qty, setQty] = useState(1);
    const [added, setAdded] = useState(false);

    const views = useMemo(() => (product ? viewsFor(product) : []), [product]);
    const related = useMemo(() => (product ? relatedTo(product) : []), [product]);

    if (!product) {
        return (
            <McgShell>
                <McgPage width="3xl">
                    <div className="flex flex-col items-center gap-3 rounded-2xl bg-primary px-6 py-16 text-center ring-1 ring-secondary ring-inset">
                        <h1 className="text-xl font-semibold text-primary">We don't carry that</h1>
                        <p className="max-w-md text-sm text-tertiary">That item isn't in the Pro Shop catalog. It may have sold through for the season.</p>
                        <Button href="/shop" color="primary" size="md" className="mt-2">
                            Back to the Pro Shop
                        </Button>
                    </div>
                </McgPage>
            </McgShell>
        );
    }

    const unitPrice = denomination ?? product.price;
    const isSaved = saved.includes(product.slug);
    const view = views.find((v) => v.id === viewId) ?? views[0];
    const variant = [size, color, denomination ? money0(denomination) : undefined].filter(Boolean).join(" · ");

    const add = () => {
        addToCart({
            // Variant is part of the identity — a Medium green cap is not a Large navy one.
            id: [product.slug, size, color, denomination].filter(Boolean).join("--"),
            kind: "product",
            name: product.name,
            detail: variant || undefined,
            image: product.image,
            unitPrice,
            qty,
            href: `/shop/${product.slug}`,
        });
        setAdded(true);
    };

    return (
        <McgShell>
            <McgPage>
                {/* Breadcrumb */}
                <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-tertiary">
                    <Link href="/shop" className="transition duration-100 ease-linear hover:text-secondary">
                        Pro Shop
                    </Link>
                    <ChevronRight className="size-3.5 text-fg-quaternary" aria-hidden="true" />
                    <span>{CATEGORY_LABEL[product.category]}</span>
                    <ChevronRight className="size-3.5 text-fg-quaternary" aria-hidden="true" />
                    <span className="text-secondary">{product.name}</span>
                </nav>

                <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
                    {/* ------------------------------ Gallery ------------------------------ */}
                    <div className="flex flex-col gap-4">
                        <div className="relative aspect-square overflow-hidden rounded-2xl bg-primary ring-1 ring-secondary ring-inset">
                            {view?.src ? (
                                <img
                                    src={view.src}
                                    alt={`${product.name} — ${view.label}`}
                                    className={cx("size-full", view.id === "product" ? "object-contain p-10" : "object-cover")}
                                />
                            ) : (
                                <ProductMedia product={product} markClassName="h-28" />
                            )}
                            <div className="pointer-events-none absolute top-4 left-4 flex flex-col items-start gap-1.5">
                                {badgesFor(product).map((badge) => (
                                    <Badge key={badge.label} color={badge.color} size="md" type="pill-color">
                                        {badge.label}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {views.map((thumb) => (
                                <button
                                    key={thumb.id}
                                    type="button"
                                    onClick={() => setViewId(thumb.id)}
                                    aria-label={thumb.label}
                                    aria-pressed={thumb.id === viewId}
                                    className={cx(
                                        "size-20 overflow-hidden rounded-xl bg-primary ring-1 transition duration-100 ease-linear ring-inset",
                                        thumb.id === viewId ? "ring-2 ring-brand" : "ring-secondary hover:ring-primary",
                                    )}
                                >
                                    {thumb.src ? (
                                        <img
                                            src={thumb.src}
                                            alt=""
                                            className={cx("size-full", thumb.id === "product" ? "object-contain p-2" : "object-cover")}
                                            loading="lazy"
                                        />
                                    ) : (
                                        <span className="flex size-full items-center justify-center bg-brand-secondary">
                                            <McgLogo className="h-8 w-auto" />
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ------------------------------ Buy box ------------------------------ */}
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-3">
                            <BrandRow product={product} />
                            <h1 className="text-display-xs font-semibold text-primary">{product.name}</h1>
                            <StarRating rating={product.rating} count={product.reviews} />
                            <PriceLine product={product} className="text-xl" />
                            <p className="text-md text-tertiary">{product.blurb}</p>
                        </div>

                        {/* Variants */}
                        <div className="flex flex-col gap-5">
                            {product.denominations && (
                                <OptionRow label="Amount" value={denomination ? money0(denomination) : undefined}>
                                    {product.denominations.map((value) => (
                                        <OptionButton
                                            key={value}
                                            label={money0(value)}
                                            isActive={value === denomination}
                                            onClick={() => setDenomination(value)}
                                        />
                                    ))}
                                </OptionRow>
                            )}

                            {product.sizes && product.sizes.length > 1 && (
                                <OptionRow label={product.category === "shoes" ? "Size (US)" : "Size"} value={size}>
                                    {product.sizes.map((value) => (
                                        <OptionButton key={value} label={value} isActive={value === size} onClick={() => setSize(value)} />
                                    ))}
                                </OptionRow>
                            )}

                            {product.colors && (
                                <OptionRow label="Colour" value={color}>
                                    {product.colors.map((swatch) => (
                                        <button
                                            key={swatch.name}
                                            type="button"
                                            onClick={() => setColor(swatch.name)}
                                            aria-label={swatch.name}
                                            aria-pressed={swatch.name === color}
                                            className={cx(
                                                "flex size-9 items-center justify-center rounded-full ring-1 transition duration-100 ease-linear ring-inset",
                                                swatch.name === color ? "ring-2 ring-brand" : "ring-secondary hover:ring-primary",
                                            )}
                                        >
                                            <span
                                                className="flex size-6 items-center justify-center rounded-full ring-1 ring-black/10 ring-inset"
                                                style={{ backgroundColor: swatch.swatch }}
                                            >
                                                {swatch.name === color && <Check className="size-3.5 text-white mix-blend-difference" aria-hidden="true" />}
                                            </span>
                                        </button>
                                    ))}
                                </OptionRow>
                            )}

                            <OptionRow label="Quantity">
                                <QtyStepper qty={qty} onChange={setQty} max={12} />
                                <span className="self-center text-sm text-tertiary tabular-nums">{money(unitPrice * qty)} total</span>
                            </OptionRow>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3">
                            {added ? (
                                <div className="flex flex-col gap-3 rounded-xl bg-success-primary p-4">
                                    <p className="flex items-center gap-2 text-sm font-semibold text-success-primary">
                                        <CheckCircle className="size-4" aria-hidden="true" />
                                        Added to your cart{variant && ` — ${variant}`}
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        <Button href="/cart" color="primary" size="md" iconLeading={ShoppingBag03}>
                                            View cart
                                        </Button>
                                        <Button color="secondary" size="md" onClick={() => setAdded(false)}>
                                            Keep shopping
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <Button color="primary" size="xl" iconLeading={ShoppingBag03} className="w-full" isDisabled={!product.inStock} onClick={add}>
                                    {product.inStock ? `Add to cart — ${money(unitPrice * qty)}` : "Out of stock"}
                                </Button>
                            )}
                            <Button
                                color="secondary"
                                size="lg"
                                className="w-full"
                                iconLeading={<Heart data-icon className={cx("size-5", isSaved && "fill-current text-fg-brand-primary")} />}
                                onClick={() => toggleSaved(product.slug)}
                            >
                                {isSaved ? "Saved" : "Save for later"}
                            </Button>
                        </div>

                        {/* Pickup + returns */}
                        <div className="flex flex-col gap-4 rounded-xl bg-primary p-5 ring-1 ring-secondary ring-inset">
                            <div className="flex gap-3">
                                <MarkerPin01 className="mt-0.5 size-5 shrink-0 text-fg-brand-primary" aria-hidden="true" />
                                <div>
                                    <p className="text-sm font-semibold text-primary">Collect at any MCG pro shop</p>
                                    <p className="mt-1 text-sm text-tertiary">
                                        Choose your course at checkout. Most orders are ready the same day; we'll text you when it's on the counter.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3 border-t border-secondary pt-4">
                                <RefreshCcw01 className="mt-0.5 size-5 shrink-0 text-fg-brand-primary" aria-hidden="true" />
                                <div>
                                    <p className="text-sm font-semibold text-primary">30 days to return it</p>
                                    <p className="mt-1 text-sm text-tertiary">
                                        Unused, with the receipt, at any county shop. Gift cards and special orders are final.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Details */}
                        <div>
                            <h2 className="text-md font-semibold text-primary">Details</h2>
                            <ul className="mt-3 flex flex-col gap-2">
                                {product.details.map((detail) => (
                                    <li key={detail} className="flex gap-2.5 text-sm text-tertiary">
                                        <Check className="mt-0.5 size-4 shrink-0 text-fg-brand-primary" aria-hidden="true" />
                                        {detail}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* ---------------------------- Related ---------------------------- */}
                {related.length > 0 && (
                    <section className="mt-14 border-t border-secondary pt-10">
                        <div className="flex items-end justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold text-primary">Also on the shelf</h2>
                                <p className="mt-1 text-sm text-tertiary">
                                    More {CATEGORY_LABEL[product.category].toLowerCase()} and county-crest merchandise.
                                </p>
                            </div>
                            <Button href="/shop" color="link-color" size="md" iconLeading={ArrowLeft}>
                                Back to the shop
                            </Button>
                        </div>
                        <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:grid-cols-4">
                            {related.map((item) => (
                                <ProductTile key={item.slug} product={item} saved={saved.includes(item.slug)} onToggleSave={() => toggleSaved(item.slug)} />
                            ))}
                        </div>
                    </section>
                )}
            </McgPage>
        </McgShell>
    );
};
