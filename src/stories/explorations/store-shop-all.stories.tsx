import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Check, ChevronDown, FilterLines, Heart } from "@untitledui/icons";
import { STORE_PRODUCTS, type StoreCategory } from "@/components/store/store-catalog";
import { cx } from "@/utils/cx";
import { ProductCard } from "./store-ui";
import { SAGAMORE_CLUB, SiteFooter, TopNav } from "./tenfore-chrome";

/**
 * "Tenfore Fox / Pro Shop / Shop All" — a product-grid storefront for the
 * Sagamore Pro Shop, modeled on a modern shop layout (filter bar + responsive
 * card grid) but re-skinned with the design-system tokens. Filters and sort are
 * functional over the real golf-product catalog.
 */
const meta: Meta = {
    title: "Tenfore Fox/Pro Shop/Shop All",
    parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

const effectivePrice = (p: (typeof STORE_PRODUCTS)[number]) => (p.onSale && p.salePrice ? p.salePrice : p.price);

const CATEGORIES: { key: "all" | StoreCategory; label: string }[] = [
    { key: "all", label: "All products" },
    { key: "apparel", label: "Apparel" },
    { key: "shoes", label: "Golf shoes" },
    { key: "equipment", label: "Equipment" },
];

type SortKey = "featured" | "price-asc" | "price-desc" | "rating" | "reviews";
const SORTS: { key: SortKey; label: string }[] = [
    { key: "featured", label: "Featured" },
    { key: "price-asc", label: "Price: low to high" },
    { key: "price-desc", label: "Price: high to low" },
    { key: "rating", label: "Top rated" },
    { key: "reviews", label: "Most reviewed" },
];

type PriceKey = "u50" | "50-100" | "100-200" | "200p";
const PRICES: { key: PriceKey; label: string; test: (n: number) => boolean }[] = [
    { key: "u50", label: "Under $50", test: (n) => n < 50 },
    { key: "50-100", label: "$50 – $100", test: (n) => n >= 50 && n < 100 },
    { key: "100-200", label: "$100 – $200", test: (n) => n >= 100 && n < 200 },
    { key: "200p", label: "$200 & up", test: (n) => n >= 200 },
];

/* ------------------------------------------------------------------ */
/* Filter-bar primitives                                               */
/* ------------------------------------------------------------------ */

const Pill = ({
    active,
    open,
    chevron,
    onClick,
    children,
}: {
    active?: boolean;
    open?: boolean;
    chevron?: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) => (
    <button
        type="button"
        onClick={onClick}
        className={cx(
            "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold ring-1 transition duration-100 ease-linear ring-inset",
            active ? "bg-primary-solid text-white ring-transparent" : "bg-primary text-secondary ring-secondary hover:bg-primary_hover",
        )}
    >
        {children}
        {chevron && <ChevronDown className={cx("size-4 transition duration-100 ease-linear", open && "rotate-180")} aria-hidden="true" />}
    </button>
);

const Menu = ({ open, onClose, align = "left", children }: { open: boolean; onClose: () => void; align?: "left" | "right"; children: React.ReactNode }) =>
    open ? (
        <>
            <button type="button" aria-hidden tabIndex={-1} onClick={onClose} className="fixed inset-0 z-40 cursor-default" />
            <div className={cx("absolute top-full z-50 mt-2 min-w-52 rounded-xl bg-primary p-1.5 shadow-lg ring-1 ring-secondary", align === "right" ? "right-0" : "left-0")}>
                {children}
            </div>
        </>
    ) : null;

const MenuItem = ({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
        type="button"
        onClick={onClick}
        className={cx(
            "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition duration-100 ease-linear",
            selected ? "bg-active font-medium text-primary" : "text-secondary hover:bg-primary_hover",
        )}
    >
        {children}
        {selected && <Check className="size-4 shrink-0 text-fg-brand-primary" aria-hidden="true" />}
    </button>
);

/* ------------------------------------------------------------------ */
/* Screen                                                              */
/* ------------------------------------------------------------------ */

const ShopAllScreen = () => {
    const [openMenu, setOpenMenu] = useState<null | "filter" | "sort" | "price">(null);
    const [category, setCategory] = useState<"all" | StoreCategory>("all");
    const [sort, setSort] = useState<SortKey>("featured");
    const [onSale, setOnSale] = useState(false);
    const [inStock, setInStock] = useState(false);
    const [showSaved, setShowSaved] = useState(false);
    const [price, setPrice] = useState<PriceKey | null>(null);
    // A handful are pre-saved so the Saved filter has something to show.
    const [saved, setSaved] = useState<Set<string>>(() => new Set(STORE_PRODUCTS.filter((_, i) => i % 8 === 3).map((p) => p.id)));
    const toggleSave = (id: string) =>
        setSaved((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    const close = () => setOpenMenu(null);
    const toggle = (k: "filter" | "sort" | "price") => setOpenMenu((p) => (p === k ? null : k));

    let list = STORE_PRODUCTS.slice();
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (onSale) list = list.filter((p) => p.onSale);
    if (inStock) list = list.filter((p) => p.inStock);
    if (showSaved) list = list.filter((p) => saved.has(p.id));
    if (price) {
        const test = PRICES.find((p) => p.key === price)!.test;
        list = list.filter((p) => test(effectivePrice(p)));
    }
    if (sort === "price-asc") list.sort((a, b) => effectivePrice(a) - effectivePrice(b));
    else if (sort === "price-desc") list.sort((a, b) => effectivePrice(b) - effectivePrice(a));
    else if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    else if (sort === "reviews") list.sort((a, b) => b.reviews - a.reviews);

    const priceLabel = price ? PRICES.find((p) => p.key === price)!.label : "Price";
    const categoryLabel = CATEGORIES.find((c) => c.key === category)!.label;

    return (
        <div className="flex min-h-dvh flex-col bg-secondary">
            <TopNav active="Shop" club={SAGAMORE_CLUB} />
            <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10">
                {/* Filter bar */}
                <div className="flex flex-wrap items-center gap-2.5">
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => toggle("filter")}
                            aria-label="Filter by category"
                            className={cx(
                                "flex size-10 items-center justify-center rounded-full ring-1 transition duration-100 ease-linear ring-inset",
                                category !== "all" ? "bg-primary-solid text-white ring-transparent" : "bg-primary text-fg-secondary ring-secondary hover:bg-primary_hover",
                            )}
                        >
                            <FilterLines className="size-5" aria-hidden="true" />
                        </button>
                        <Menu open={openMenu === "filter"} onClose={close} align="left">
                            <p className="px-3 py-1.5 text-xs font-semibold tracking-wide text-quaternary uppercase">Category</p>
                            {CATEGORIES.map((c) => (
                                <MenuItem key={c.key} selected={category === c.key} onClick={() => { setCategory(c.key); close(); }}>
                                    {c.label}
                                </MenuItem>
                            ))}
                        </Menu>
                    </div>

                    <div className="relative">
                        <Pill chevron open={openMenu === "sort"} onClick={() => toggle("sort")}>
                            Sort by
                        </Pill>
                        <Menu open={openMenu === "sort"} onClose={close}>
                            {SORTS.map((s) => (
                                <MenuItem key={s.key} selected={sort === s.key} onClick={() => { setSort(s.key); close(); }}>
                                    {s.label}
                                </MenuItem>
                            ))}
                        </Menu>
                    </div>

                    <Pill active={onSale} onClick={() => setOnSale((v) => !v)}>
                        On sale
                    </Pill>

                    <div className="relative">
                        <Pill active={!!price} chevron open={openMenu === "price"} onClick={() => toggle("price")}>
                            {priceLabel}
                        </Pill>
                        <Menu open={openMenu === "price"} onClose={close}>
                            <MenuItem selected={!price} onClick={() => { setPrice(null); close(); }}>
                                Any price
                            </MenuItem>
                            {PRICES.map((pr) => (
                                <MenuItem key={pr.key} selected={price === pr.key} onClick={() => { setPrice(pr.key); close(); }}>
                                    {pr.label}
                                </MenuItem>
                            ))}
                        </Menu>
                    </div>

                    <Pill active={inStock} onClick={() => setInStock((v) => !v)}>
                        In-stock
                    </Pill>

                    <Pill active={showSaved} onClick={() => setShowSaved((v) => !v)}>
                        <Heart className={cx("size-4", showSaved && "fill-current")} aria-hidden="true" /> Saved
                    </Pill>
                </div>

                <p className="mt-4 text-sm text-tertiary">
                    {list.length} {list.length === 1 ? "item" : "items"}
                    {category !== "all" && <span> · {categoryLabel}</span>}
                </p>

                {/* Product grid */}
                {list.length > 0 ? (
                    <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {list.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                saved={saved.has(product.id)}
                                onToggleSave={() => toggleSave(product.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="mt-16 flex flex-col items-center gap-2 text-center">
                        <p className="text-md font-semibold text-primary">No products match your filters</p>
                        <p className="text-sm text-tertiary">Try clearing a filter to see more.</p>
                    </div>
                )}
            </main>
            <SiteFooter club={SAGAMORE_CLUB} />
        </div>
    );
};

export const Default: Story = {
    name: "Shop All",
    render: () => <ShopAllScreen />,
};
