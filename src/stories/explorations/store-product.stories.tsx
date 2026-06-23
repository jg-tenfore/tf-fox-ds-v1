import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useEffect, useState } from "react";
import { ArrowLeft, ChevronDown, ChevronLeft, ChevronRight, DotsHorizontal, Heart, InfoCircle, LinkExternal01, SearchLg, Share07, ShoppingCart01, ThumbsUp, XClose } from "@untitledui/icons";
import { Avatar } from "@/components/base/avatar/avatar";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { STORE_PRODUCTS, type StoreProduct } from "@/components/store/store-catalog";
import { cx } from "@/utils/cx";
import { logoFor, money, StarRating } from "./store-ui";
import { SAGAMORE_CLUB, SiteFooter, TopNav } from "./tenfore-chrome";

/**
 * "Tenfore Fox / Pro Shop / Product" — the product-detail experience for a
 * Sagamore Pro Shop item: image, brand, rating, price/stock state, actions,
 * description, and a reviews block. Re-skinned with the design-system tokens.
 */
const meta: Meta = {
    title: "Tenfore Fox/Pro Shop/Product",
    parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

const DESCRIPTIONS: Record<string, string[]> = {
    "apparel/mens": ["Moisture-wicking performance fabric", "4-way stretch for an unrestricted swing", "UPF 30 sun protection", "Tailored athletic fit", "Machine washable"],
    "apparel/womens": ["Soft moisture-wicking knit", "4-way stretch with a flattering fit", "UPF 30 sun protection", "Breathable, lightweight feel", "Machine washable"],
    "shoes/golf-shoes": ["Waterproof construction", "Spikeless multi-directional traction", "Cushioned, responsive midsole", "Breathable engineered upper", "All-day on-course comfort"],
    "equipment/golf-balls": ["Tour-level distance and control", "Soft urethane cover for greenside spin", "Low long-game spin for straighter flight", "Consistent, penetrating ball flight", "One dozen per box"],
    "equipment/accessories-and-training": ["Builds tempo and consistency", "Portable, range-ready design", "Durable, premium build", "Quick setup, no tools needed", "Great for all skill levels"],
};

const ALL_REVIEWS = [
    { initial: "A", author: "Antonio", date: "January 11, 2025", stars: 5, title: "Amazing", text: "Exactly as pictured and the quality is excellent. Shipped fast too." },
    { initial: "C", author: "CarlJason", date: "May 16, 2025", stars: 5, title: "Love it", text: "Comfortable and looks sharp out on the course. Would buy again." },
    { initial: "M", author: "Maria", date: "March 3, 2025", stars: 4, title: "Solid pick", text: "Good value for the price. Runs slightly large — size down if between." },
    { initial: "D", author: "Dontae", date: "May 5, 2025", stars: 5, title: "Stands out", text: "Great feel and gets compliments every round. Highly recommend." },
    { initial: "E", author: "Edward", date: "April 27, 2025", stars: 5, title: "Top notch", text: "Premium feel and performs exactly as advertised. No complaints." },
    { initial: "S", author: "Sera", date: "April 18, 2025", stars: 2, title: "Slow shipping", text: "Product is nice but it took far longer to arrive than expected." },
    { initial: "F", author: "Frank", date: "March 25, 2025", stars: 5, title: "Great quality", text: "Amazing quality. Great look, great feel — worth every penny." },
    { initial: "P", author: "Priya", date: "February 14, 2025", stars: 4, title: "Happy with it", text: "Holds up well after several rounds. Color is true to the photos." },
];

// A fixed, believable star distribution for the breakdown bars (5★ → 1★).
const DISTRIBUTION = [0.72, 0.19, 0.05, 0.025, 0.015];

// Multi-view gallery for the featured golf shoe (served via the store-images staticDir).
const SHOE_GALLERY = [
    "252e3653-7463-4a15-91f8-37e0799da622_350x.jpg",
    "424f03d4-3cda-4d55-bf3b-47c7dfac2e4f_350x.jpg",
    "5811573e-a0ad-4f67-81df-765428bb7db3_350x.jpg",
    "72534f2a-5994-40ac-969b-312904f84c1a_350x.jpg",
    "7cee94ba-4a27-4c90-83f6-0886fce32496_350x.jpg",
    "a0a89103-fae1-47bd-9672-b04a1626d960_350x.jpg",
    "fa374b89-bf46-421f-852a-9b2fa562d57b_350x.jpg",
].map((f) => `store-images/apparel/shoes/${f}`);

const galleryArrow =
    "flex size-9 items-center justify-center rounded-full bg-primary text-fg-secondary shadow-md ring-1 ring-primary transition duration-100 ease-linear hover:bg-primary_hover";

const Thumb = ({ src, index, active, onClick }: { src: string; index: number; active: boolean; onClick: () => void }) => (
    <button
        type="button"
        onClick={onClick}
        aria-label={`View ${index + 1}`}
        className={cx(
            "flex size-16 items-center justify-center overflow-hidden rounded-xl bg-primary transition duration-100 ease-linear ring-inset",
            active ? "ring-2 ring-brand" : "ring-1 ring-secondary hover:ring-brand",
        )}
    >
        <img src={src} alt="" className="size-full object-contain p-1.5" loading="lazy" />
    </button>
);

// Directional swipe + scale/fade as the active image changes (keyed remount replays it).
const transitionFor = (dir: number) => cx("animate-in fade-in zoom-in-95 duration-300", dir > 0 ? "slide-in-from-right-4" : "slide-in-from-left-4");

/** Full-screen lightbox opened by clicking the main image. */
const Lightbox = ({
    images,
    active,
    dir,
    title,
    onSelect,
    onGo,
    onClose,
}: {
    images: string[];
    active: number;
    dir: number;
    title: string;
    onSelect: (i: number) => void;
    onGo: (d: number) => void;
    onClose: () => void;
}) => (
    <div className="fixed inset-0 z-50 flex flex-col bg-primary p-4 sm:p-6">
        {/* Top bar — close (its own row so it never overlays the image) */}
        <div className="flex shrink-0 justify-end pb-3">
            <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="flex size-10 items-center justify-center rounded-full text-fg-secondary ring-1 ring-secondary transition duration-100 ease-linear hover:bg-secondary_hover"
            >
                <XClose className="size-5" aria-hidden="true" />
            </button>
        </div>

        {/* Middle — thumbnails + the (shorter) image box */}
        <div className="flex min-h-0 flex-1 gap-4">
            {images.length > 1 && (
                <div className="flex shrink-0 flex-col gap-3 self-center">
                    {images.map((src, i) => (
                        <Thumb key={src} src={src} index={i} active={i === active} onClick={() => onSelect(i)} />
                    ))}
                </div>
            )}
            <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-2xl bg-primary ring-1 ring-secondary ring-inset">
                <img key={active} src={images[active]} alt={title} className={cx("max-h-full max-w-full object-contain p-8", transitionFor(dir))} />
            </div>
        </div>

        {/* Bottom bar — arrows in their own row */}
        {images.length > 1 && (
            <div className="flex shrink-0 justify-end gap-3 pt-3">
                <button type="button" aria-label="Previous image" onClick={() => onGo(-1)} className={galleryArrow}>
                    <ChevronLeft className="size-5" aria-hidden="true" />
                </button>
                <button type="button" aria-label="Next image" onClick={() => onGo(1)} className={galleryArrow}>
                    <ChevronRight className="size-5" aria-hidden="true" />
                </button>
            </div>
        )}
    </div>
);

/** Product image gallery — thumbnail rail + main image (hover arrows, click to expand). */
const Gallery = ({ images, title, onSale }: { images: string[]; title: string; onSale: boolean }) => {
    const [active, setActive] = useState(0);
    const [dir, setDir] = useState(1);
    const [open, setOpen] = useState(false);
    const select = (i: number) => {
        setDir(i >= active ? 1 : -1);
        setActive(i);
    };
    const go = (delta: number) => {
        setDir(delta > 0 ? 1 : -1);
        setActive((a) => (a + delta + images.length) % images.length);
    };

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
            else if (e.key === "ArrowRight") go(1);
            else if (e.key === "ArrowLeft") go(-1);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, images.length]);

    return (
        <>
            <div className="flex gap-3">
                {images.length > 1 && (
                    <div className="flex shrink-0 flex-col gap-3">
                        {images.map((src, i) => (
                            <Thumb key={src} src={src} index={i} active={i === active} onClick={() => select(i)} />
                        ))}
                    </div>
                )}
                <div className="group relative flex-1 overflow-hidden rounded-2xl bg-primary ring-1 ring-secondary ring-inset">
                    <button type="button" onClick={() => setOpen(true)} aria-label="Expand image" className="block w-full cursor-zoom-in">
                        <img key={active} src={images[active]} alt={title} className={cx("aspect-square w-full object-contain p-10", transitionFor(dir))} />
                    </button>
                    {onSale && (
                        <span className="absolute top-4 left-4">
                            <Badge color="error" size="md" type="pill-color">
                                Sale
                            </Badge>
                        </span>
                    )}
                    {images.length > 1 && (
                        <>
                            <button
                                type="button"
                                aria-label="Previous image"
                                onClick={() => go(-1)}
                                className={cx(galleryArrow, "absolute top-1/2 left-3 -translate-y-1/2 opacity-0 group-hover:opacity-100")}
                            >
                                <ChevronLeft className="size-5" aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                aria-label="Next image"
                                onClick={() => go(1)}
                                className={cx(galleryArrow, "absolute top-1/2 right-3 -translate-y-1/2 opacity-0 group-hover:opacity-100")}
                            >
                                <ChevronRight className="size-5" aria-hidden="true" />
                            </button>
                        </>
                    )}
                </div>
            </div>
            {open && <Lightbox images={images} active={active} dir={dir} title={title} onSelect={select} onGo={go} onClose={() => setOpen(false)} />}
        </>
    );
};

/** Slide-over flyout with the full reviews list, opened from the rating or "Read more reviews". */
const ReviewsFlyout = ({ product, onClose }: { product: StoreProduct; onClose: () => void }) => {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <button type="button" aria-label="Close reviews" onClick={onClose} className="absolute inset-0 bg-overlay/70" />
            <div className="relative flex h-full w-full max-w-md flex-col bg-primary shadow-xl duration-300 animate-in slide-in-from-right">
                <div className="flex-1 overflow-y-auto p-6">
                    <button
                        type="button"
                        aria-label="Close"
                        onClick={onClose}
                        className="flex size-10 items-center justify-center rounded-full text-fg-secondary ring-1 ring-secondary transition duration-100 ease-linear hover:bg-secondary_hover"
                    >
                        <XClose className="size-5" aria-hidden="true" />
                    </button>

                    <h2 className="mt-4 text-display-xs font-semibold text-primary">Reviews</h2>

                    {/* Summary */}
                    <div className="mt-4 flex gap-8">
                        <div className="flex shrink-0 flex-col items-start gap-1">
                            <span className="text-display-sm font-semibold text-primary tabular-nums">{product.rating.toFixed(1)}</span>
                            <StarRating rating={product.rating} />
                            <span className="text-sm text-tertiary">{product.reviews} ratings</span>
                        </div>
                        <div className="flex w-full flex-col justify-center gap-1.5">
                            {DISTRIBUTION.map((frac, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <span className="w-3 text-xs text-tertiary tabular-nums">{5 - i}</span>
                                    <span className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                                        <span className="block h-full rounded-full bg-primary-solid" style={{ width: `${frac * 100}%` }} />
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Search + filters */}
                    <Input icon={SearchLg} placeholder="Search reviews" aria-label="Search reviews" className="mt-5" />
                    <div className="mt-4 flex gap-2.5">
                        <button type="button" className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-secondary ring-1 ring-secondary transition duration-100 ease-linear ring-inset hover:bg-primary_hover">
                            Sort by <ChevronDown className="size-4" aria-hidden="true" />
                        </button>
                        <button type="button" className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-secondary ring-1 ring-secondary transition duration-100 ease-linear ring-inset hover:bg-primary_hover">
                            Rating <ChevronDown className="size-4" aria-hidden="true" />
                        </button>
                    </div>

                    {/* Review list */}
                    <div className="mt-5 flex flex-col gap-3">
                        {ALL_REVIEWS.map((r) => (
                            <div key={r.author} className="rounded-xl bg-secondary p-4 ring-1 ring-secondary ring-inset">
                                <StarRating rating={r.stars} />
                                {r.title && <p className="mt-2 text-sm font-semibold text-primary">{r.title}</p>}
                                <p className="mt-1 text-sm leading-relaxed text-tertiary">{r.text}</p>
                                <div className="mt-3 flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2.5">
                                        <Avatar size="xs" initials={r.initial} />
                                        <span className="text-xs text-tertiary">
                                            {r.author} · {r.date}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button type="button" className="flex items-center gap-1.5 text-xs font-medium text-tertiary transition duration-100 ease-linear hover:text-secondary">
                                            <ThumbsUp className="size-4" aria-hidden="true" /> Helpful
                                        </button>
                                        <button type="button" aria-label="More options" className="text-fg-quaternary transition duration-100 ease-linear hover:text-fg-secondary">
                                            <DotsHorizontal className="size-4" aria-hidden="true" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProductScreen = ({ product, images = [product.src] }: { product: StoreProduct; images?: string[] }) => {
    const bullets = DESCRIPTIONS[`${product.category}/${product.subcategory}`] ?? DESCRIPTIONS["apparel/mens"];
    const logo = logoFor(product);
    const [reviewsOpen, setReviewsOpen] = useState(false);

    return (
        <div className="flex min-h-dvh flex-col bg-secondary">
            <TopNav active="Shop" club={SAGAMORE_CLUB} />
            <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
                <Button color="link-gray" size="md" iconLeading={ArrowLeft} className="mb-6">
                    Back
                </Button>
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
                    {/* Image gallery */}
                    <Gallery images={images} title={product.title} onSale={product.onSale} />

                    {/* Details */}
                    <div className="flex flex-col">
                        {logo && (
                            <div className="mb-3 flex items-center gap-2">
                                <span className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary ring-1 ring-secondary ring-inset">
                                    <img src={logo.src} alt="" className="max-h-4 max-w-4 object-contain" />
                                </span>
                                <span className="text-sm font-medium text-secondary">{logo.name}</span>
                            </div>
                        )}
                        <h1 className="text-display-xs font-semibold tracking-wide text-primary uppercase">{product.title}</h1>
                        <button type="button" onClick={() => setReviewsOpen(true)} className="mt-2 flex w-fit items-center gap-2 text-left">
                            <StarRating rating={product.rating} />
                            <span className="text-sm text-tertiary underline underline-offset-2">{product.reviews} ratings</span>
                        </button>

                        {/* Price + stock */}
                        <div className="mt-4 flex items-center gap-2.5">
                            {product.onSale && product.salePrice ? (
                                <>
                                    <span className="text-xl font-semibold text-primary tabular-nums">{money(product.salePrice)}</span>
                                    <span className="text-md text-tertiary line-through tabular-nums">{money(product.price)}</span>
                                </>
                            ) : (
                                <span className={cx("text-xl font-semibold tabular-nums", product.inStock ? "text-primary" : "text-tertiary line-through")}>{money(product.price)}</span>
                            )}
                            {!product.inStock && <span className="text-md font-medium text-secondary">Sold out</span>}
                        </div>

                        {/* Primary action */}
                        <div className="mt-6">
                            {product.inStock ? (
                                <Button color="primary" size="lg" iconLeading={ShoppingCart01} className="w-full">
                                    Add to cart
                                </Button>
                            ) : (
                                <>
                                    <Button color="primary" size="lg" iconLeading={Heart} className="w-full">
                                        Add to saved items
                                    </Button>
                                    <p className="mt-2.5 flex items-center gap-1.5 text-sm text-tertiary">
                                        <InfoCircle className="size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />
                                        Saving this product will notify you when it's back in stock
                                    </p>
                                </>
                            )}
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-3">
                            <Button color="secondary" size="lg" iconLeading={Heart}>
                                Save
                            </Button>
                            <Button color="secondary" size="lg" iconLeading={Share07}>
                                Share
                            </Button>
                        </div>

                        {/* Description */}
                        <div className="mt-8">
                            <h2 className="text-lg font-semibold text-primary">Description</h2>
                            <ul className="mt-3 flex list-disc flex-col gap-1.5 pl-5 text-sm text-secondary marker:text-fg-quaternary">
                                {bullets.map((b) => (
                                    <li key={b}>{b}</li>
                                ))}
                            </ul>
                            <Button href="#" color="secondary" size="md" iconLeading={LinkExternal01} className="mt-5">
                                More details at PGA TOUR Superstore
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Reviews */}
                <section id="reviews" className="mt-12 scroll-mt-6 rounded-2xl bg-primary p-6 ring-1 ring-secondary ring-inset sm:p-8">
                    <h2 className="text-lg font-semibold text-primary">Reviews</h2>
                    <div className="mt-5 flex flex-col gap-8 sm:flex-row sm:items-center">
                        <div className="flex shrink-0 flex-col items-start gap-1">
                            <span className="text-display-sm font-semibold text-primary tabular-nums">{product.rating.toFixed(1)}</span>
                            <StarRating rating={product.rating} />
                            <span className="text-sm text-tertiary">{product.reviews} ratings</span>
                        </div>
                        <div className="flex w-full max-w-md flex-col gap-1.5">
                            {DISTRIBUTION.map((frac, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <span className="w-3 text-xs text-tertiary tabular-nums">{5 - i}</span>
                                    <span className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                                        <span className="block h-full rounded-full bg-primary-solid" style={{ width: `${frac * 100}%` }} />
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {ALL_REVIEWS.slice(0, 3).map((r) => (
                            <div key={r.author} className="flex flex-col gap-3 rounded-xl bg-secondary p-4 ring-1 ring-secondary ring-inset">
                                <StarRating rating={r.stars} />
                                <p className="text-sm font-semibold text-primary">{r.title}</p>
                                <p className="text-sm leading-relaxed text-tertiary">{r.text}</p>
                                <div className="mt-auto flex items-center gap-2.5 pt-1">
                                    <Avatar size="xs" initials={r.initial} />
                                    <span className="text-xs text-tertiary">
                                        {r.author} · {r.date}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Button color="secondary" size="lg" className="mt-6 w-full" onClick={() => setReviewsOpen(true)}>
                        Read more reviews
                    </Button>
                </section>
            </main>
            <SiteFooter club={SAGAMORE_CLUB} />
            {reviewsOpen && <ReviewsFlyout product={product} onClose={() => setReviewsOpen(false)} />}
        </div>
    );
};

const inStockProduct = STORE_PRODUCTS.find((p) => p.inStock && p.category === "shoes") ?? STORE_PRODUCTS.find((p) => p.inStock)!;
const soldOutProduct = STORE_PRODUCTS.find((p) => !p.inStock) ?? STORE_PRODUCTS[0];

export const Default: Story = {
    name: "Product",
    render: () => <ProductScreen product={inStockProduct} images={SHOE_GALLERY} />,
};

export const SoldOut: Story = {
    name: "Product — Sold Out",
    render: () => <ProductScreen product={soldOutProduct} />,
};
