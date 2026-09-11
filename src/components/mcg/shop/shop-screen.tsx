"use client";

/**
 * `/shop` — the MCG Pro Shop storefront.
 *
 * One catalog, four controls: a search field, category chips, a price range and a sort.
 * They compose rather than replace each other, so "MCG logo, under $30, top rated" is a
 * single state the URL-free prototype can reach in three clicks.
 *
 * The MCG-logo shelf sits above the grid whenever the golfer hasn't narrowed anything
 * down. That ordering is the point of a county shop: the crest merchandise is the
 * reason people walk in, and the Titleist wall is the reason they walk out with more.
 */

import { useMemo, useState } from "react";
import { Heart, MarkerPin01, SearchLg, ShoppingBag03, Tag01, XClose } from "@untitledui/icons";
import Link from "next/link";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";
import { Slider } from "@/components/base/slider/slider";
import { mcgCourses } from "@/components/foundations/mcg/mcg-assets";
import { McgHero, McgPage, McgShell } from "@/components/mcg/mcg-chrome";
import { useSession } from "@/components/mcg/session";
import {
    MCG_LOGO_PRODUCTS,
    PRICE_MAX,
    PRICE_MIN,
    SHOP_CATEGORIES,
    SHOP_PRODUCTS,
    type ShopCategoryId,
    type ShopProduct,
    money0,
} from "@/components/mcg/shop-catalog";
import { cx } from "@/utils/cx";
import { ProductTile } from "./shop-ui";

/* ------------------------------------------------------------------ */
/* Filter state                                                        */
/* ------------------------------------------------------------------ */

type CategoryFilter = ShopCategoryId | "all" | "mcg-logo";
type SortId = "featured" | "price-asc" | "price-desc" | "rating" | "name";

const SORTS: { id: SortId; label: string }[] = [
    { id: "featured", label: "Featured" },
    { id: "price-asc", label: "Price — low to high" },
    { id: "price-desc", label: "Price — high to low" },
    { id: "rating", label: "Top rated" },
    { id: "name", label: "Name A–Z" },
];

const CHIPS: { id: CategoryFilter; label: string }[] = [
    { id: "all", label: "Everything" },
    { id: "mcg-logo", label: "MCG logo" },
    ...SHOP_CATEGORIES.map((c) => ({ id: c.id as CategoryFilter, label: c.label })),
];

/** Featured order: MCG merchandise first, then by review volume. */
const featuredRank = (product: ShopProduct) => (product.mcgLogo ? 0 : 1) * 10_000 - product.reviews;

const sortProducts = (products: ShopProduct[], sort: SortId): ShopProduct[] => {
    const out = [...products];
    switch (sort) {
        case "price-asc":
            return out.sort((a, b) => a.price - b.price);
        case "price-desc":
            return out.sort((a, b) => b.price - a.price);
        case "rating":
            return out.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
        case "name":
            return out.sort((a, b) => a.name.localeCompare(b.name));
        default:
            return out.sort((a, b) => featuredRank(a) - featuredRank(b));
    }
};

/* ------------------------------------------------------------------ */
/* Chip                                                                */
/* ------------------------------------------------------------------ */

const Chip = ({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) => (
    <button
        type="button"
        onClick={onClick}
        aria-pressed={isActive}
        className={cx(
            "rounded-full px-3.5 py-2 text-sm font-semibold whitespace-nowrap transition duration-100 ease-linear",
            isActive ? "bg-brand-solid text-white" : "bg-primary text-secondary ring-1 ring-secondary ring-inset hover:bg-primary_hover",
        )}
    >
        {label}
    </button>
);

/* ------------------------------------------------------------------ */
/* Screen                                                              */
/* ------------------------------------------------------------------ */

export interface ShopScreenProps {
    /** Open the storefront on a category — used by the stories and the logo shelf. */
    initialCategory?: CategoryFilter;
    initialQuery?: string;
}

export const ShopScreen = ({ initialCategory = "all", initialQuery = "" }: ShopScreenProps) => {
    const { saved, toggleSaved, cartCount } = useSession();

    const [category, setCategory] = useState<CategoryFilter>(initialCategory);
    const [query, setQuery] = useState(initialQuery);
    const [sort, setSort] = useState<SortId>("featured");
    const [range, setRange] = useState<number[]>([PRICE_MIN, PRICE_MAX]);

    const isPriceNarrowed = range[0] > PRICE_MIN || range[1] < PRICE_MAX;
    const isNarrowed = category !== "all" || query.trim().length > 0 || isPriceNarrowed;

    const results = useMemo(() => {
        const needle = query.trim().toLowerCase();
        const matched = SHOP_PRODUCTS.filter((product) => {
            if (category === "mcg-logo" && !product.mcgLogo) return false;
            if (category !== "all" && category !== "mcg-logo" && product.category !== category) return false;
            if (product.price < range[0] || product.price > range[1]) return false;
            if (!needle) return true;
            return [product.name, product.brand, product.blurb, ...product.details].join(" ").toLowerCase().includes(needle);
        });
        return sortProducts(matched, sort);
    }, [category, query, sort, range]);

    const activeCategory = SHOP_CATEGORIES.find((c) => c.id === category);
    const savedCount = saved.length;

    const clearAll = () => {
        setCategory("all");
        setQuery("");
        setRange([PRICE_MIN, PRICE_MAX]);
    };

    return (
        <McgShell>
            <McgHero
                title="Pro Shop"
                blurb="Balls, gloves, county-crest merchandise and gift cards. Order online and collect at any of the nine MCG pro shops — we don't ship."
                right={
                    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                        <span className="flex items-center gap-2 rounded-full bg-secondary px-3.5 py-2 text-sm font-medium text-secondary">
                            <Heart className="size-4 text-fg-quaternary" aria-hidden="true" />
                            {savedCount} saved
                        </span>
                        <Button href="/cart" color="secondary" size="md" iconLeading={ShoppingBag03}>
                            {cartCount > 0 ? `Cart · ${cartCount}` : "Cart"}
                        </Button>
                    </div>
                }
            />

            <McgPage>
                {/* MCG logo shelf — the reason people come in. Hidden once a filter narrows the view. */}
                {!isNarrowed && (
                    <section className="mb-10 overflow-hidden rounded-2xl bg-primary ring-1 ring-secondary ring-inset">
                        <header className="flex flex-col gap-3 border-b border-secondary px-6 py-5 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <Badge color="brand" size="sm" type="pill-color">
                                        MCG logo
                                    </Badge>
                                    <span className="text-xs font-semibold tracking-wide text-quaternary uppercase">Sold by the Academy &amp; pro shops</span>
                                </div>
                                <h2 className="mt-2 text-xl font-semibold text-primary">Passes, packs &amp; gift cards</h2>
                                <p className="mt-1 max-w-xl text-sm text-tertiary">
                                    Play packs, range cards, lesson packs and gift cards — bought here, redeemed at any of the nine county courses.
                                </p>
                            </div>
                            <Button color="link-color" size="md" onClick={() => setCategory("mcg-logo")}>
                                See all {MCG_LOGO_PRODUCTS.length} MCG items
                            </Button>
                        </header>
                        <div className="grid grid-cols-2 gap-5 px-6 py-6 sm:grid-cols-3 lg:grid-cols-5">
                            {MCG_LOGO_PRODUCTS.slice(0, 5).map((product) => (
                                <ProductTile
                                    key={product.slug}
                                    product={product}
                                    saved={saved.includes(product.slug)}
                                    onToggleSave={() => toggleSaved(product.slug)}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* Toolbar */}
                <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div className="w-full lg:max-w-sm">
                            <Input
                                aria-label="Search the Pro Shop"
                                icon={SearchLg}
                                placeholder="Search balls, gloves, caps…"
                                value={query}
                                onChange={setQuery}
                            />
                        </div>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                            {/* Price range — two thumbs over the catalog's own bounds. */}
                            <div className="w-full sm:w-64">
                                <div className="mb-2 flex items-baseline justify-between">
                                    <span className="text-sm font-medium text-secondary">Price</span>
                                    <span className="text-sm text-tertiary tabular-nums">
                                        {money0(range[0])} – {money0(range[1])}
                                        {range[1] >= PRICE_MAX && "+"}
                                    </span>
                                </div>
                                <Slider
                                    aria-label="Price range"
                                    minValue={PRICE_MIN}
                                    maxValue={PRICE_MAX}
                                    step={5}
                                    value={range}
                                    onChange={(value) => setRange(Array.isArray(value) ? value : [PRICE_MIN, value])}
                                    labelFormatter={money0}
                                />
                            </div>
                            <div className="w-full sm:w-56">
                                <Select
                                    aria-label="Sort products"
                                    selectedKey={sort}
                                    onSelectionChange={(key) => setSort(key as SortId)}
                                    items={SORTS.map((s) => ({ id: s.id, label: s.label }))}
                                >
                                    {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Category chips */}
                    <div className="flex flex-wrap gap-2">
                        {CHIPS.map((chip) => (
                            <Chip key={chip.id} label={chip.label} isActive={category === chip.id} onClick={() => setCategory(chip.id)} />
                        ))}
                    </div>

                    {/* Result line */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-secondary pt-5">
                        <div>
                            <p className="text-sm font-semibold text-primary">
                                {results.length} {results.length === 1 ? "item" : "items"}
                                {category === "mcg-logo" && " with the county crest"}
                                {activeCategory && ` in ${activeCategory.label.toLowerCase()}`}
                            </p>
                            <p className="mt-0.5 text-sm text-tertiary">
                                {activeCategory?.blurb ??
                                    (category === "mcg-logo" ? "Made for MCG and sold nowhere else." : "Everything the nine MCG pro shops carry.")}
                            </p>
                        </div>
                        {isNarrowed && (
                            <Button color="link-gray" size="md" iconLeading={XClose} onClick={clearAll}>
                                Clear filters
                            </Button>
                        )}
                    </div>
                </div>

                {/* Grid */}
                {results.length === 0 ? (
                    <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl bg-primary px-6 py-16 text-center ring-1 ring-secondary ring-inset">
                        <Tag01 className="size-8 text-fg-quaternary" aria-hidden="true" />
                        <h3 className="text-lg font-semibold text-primary">Nothing matches that</h3>
                        <p className="max-w-md text-sm text-tertiary">
                            Try a wider price range, or call the shop at Needwood on (301) 762-1600 — if it's a special order we can usually get it in a week.
                        </p>
                        <Button color="secondary" size="md" className="mt-2" onClick={clearAll}>
                            Clear filters
                        </Button>
                    </div>
                ) : (
                    <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:grid-cols-4">
                        {results.map((product) => (
                            <ProductTile
                                key={product.slug}
                                product={product}
                                saved={saved.includes(product.slug)}
                                onToggleSave={() => toggleSaved(product.slug)}
                            />
                        ))}
                    </div>
                )}

                {/* Pickup footnote — the county model, stated once on the storefront. */}
                <section className="mt-12 flex flex-col gap-4 rounded-2xl bg-primary p-6 ring-1 ring-secondary ring-inset sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-3">
                        <MarkerPin01 className="mt-0.5 size-5 shrink-0 text-fg-brand-primary" aria-hidden="true" />
                        <div>
                            <p className="text-sm font-semibold text-primary">Collect at any MCG course</p>
                            <p className="mt-1 max-w-2xl text-sm text-tertiary">
                                Orders are held at the pro shop counter you choose at checkout — {mcgCourses.map((c) => c.name).join(", ")}. Most are ready the
                                same day.
                            </p>
                        </div>
                    </div>
                    <Link href="/cart" className="shrink-0 text-sm font-semibold text-brand-secondary transition duration-100 ease-linear hover:underline">
                        Go to cart
                    </Link>
                </section>
            </McgPage>
        </McgShell>
    );
};
