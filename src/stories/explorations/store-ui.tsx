import { Heart, Star01 } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { SagamoreLogo } from "@/components/foundations/sagamore/sagamore-logo";
import { cx } from "@/utils/cx";
import type { StoreProduct } from "@/components/store/store-catalog";

/**
 * Shared UI for the Sagamore Pro Shop screens — money formatting, a star-rating
 * with half-star support, the product card, and the shop brand lockup. Re-skinned
 * with the design-system tokens (no literal store colors).
 */

export const money = (n: number) => `$${n.toFixed(2)}`;

// Brand logos served via the store-images staticDir. Titles don't name a brand, so we
// assign one by hash — but only from a bucket of brands that actually make that product
// type (no club/launch-monitor brand on a t-shirt, etc.).
const hashId = (s: string) => {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
};

export interface BrandLogo {
    src: string;
    name: string;
}
const b = (file: string, name: string) => ({ file, name });

const LOGO_BUCKETS: Record<string, { file: string; name: string }[]> = {
    "apparel/mens": [
        b("OriginalPenguin_ELEVATED-MAINLINE-LOGO-ba042017d1.webp", "Original Penguin"),
        b("REDVANLY-LOGO-50345d4390.webp", "Redvanly"),
        b("ashworth-golfman-logo-01-065f4aac2a.webp", "Ashworth"),
        b("logo-JLindeberg_001-49e0d0d5de.webp", "J.Lindeberg"),
        b("logo-JohnnieO-70fe23ac65.webp", "Johnnie-O"),
        b("logo-Peter-Millar-8a36b6699a.webp", "Peter Millar"),
        b("logo-GFORE-94bda6d0d9.webp", "G/FORE"),
        b("logo-PGA-TOUR-Apparel-8c13ef62d0.webp", "PGA TOUR"),
        b("sundayred4-d1cec7cc08.webp", "Sunday Red"),
        b("fila_clipped_rev_1-1-3714ee1c86.webp", "FILA"),
        b("adidas_Logo-35ce49f60e.webp", "adidas"),
        b("logo-Nike-ca117a106f.webp", "Nike"),
        b("logo-PUMA-5a1f394b3b.webp", "PUMA"),
        b("GOATLANE-LOGO-BLACK-1f624e31e5.webp", "Goat Lane"),
    ],
    "apparel/womens": [
        b("LillyPulitzer_Logo-Secondary_Black-9795c24b0c.webp", "Lilly Pulitzer"),
        b("FPMovement_Logo-black-1-ea2cdedf4f.webp", "FP Movement"),
        b("beyondyoga_logo-c1499b2a01.webp", "Beyond Yoga"),
        b("varley-logo-8fe24fa55a.webp", "Varley"),
        b("lucky-in-love-logo-e625ed957d.webp", "Lucky in Love"),
        b("Logo_Final_Turtles_and_Tees_300x_clipped_rev_1-215cd41926.webp", "Turtles & Tees"),
        b("logo-PGA-TOUR-Apparel-dff1845b44.webp", "PGA TOUR"),
        b("adidas_Logo-395c24decd.webp", "adidas"),
        b("logo-Nike-eaba0e9255.webp", "Nike"),
        b("logo-PUMA-7d1990d67a.webp", "PUMA"),
    ],
    "shoes/golf-shoes": [
        b("24_FJ_Jewel_K_3-063a2db0f2.webp", "FootJoy"),
        b("adidas_Logo-cdf1b1e41c.webp", "adidas"),
        b("logo-Nike-ca117a106f.webp", "Nike"),
        b("logo-PUMA-5a1f394b3b.webp", "PUMA"),
        b("OluKai-94f241e7e3.webp", "OluKai"),
        b("Birkenstock1-a48b3b2aa6.webp", "Birkenstock"),
        b("logo-GFORE-94bda6d0d9.webp", "G/FORE"),
        b("sundayred4-d1cec7cc08.webp", "Sunday Red"),
    ],
    "equipment/golf-balls": [
        b("logo-Titleist-5191ae6257.webp", "Titleist"),
        b("logo-Callaway-1361699423.webp", "Callaway"),
        b("logo-TaylorMade-2f17ac4849.webp", "TaylorMade"),
        b("logo-Bridgestone-f255386e56.webp", "Bridgestone"),
        b("logo-Srixon-8c85331b79.webp", "Srixon"),
        b("logo-Wilson-191b062a9b.webp", "Wilson"),
        b("logo-Mizuno-727c9d8d93.webp", "Mizuno"),
        b("logo-COBRA-111ec06575.webp", "Cobra"),
        b("PXG-Shadow-Black-c6e8303caf.webp", "PXG"),
    ],
    "equipment/accessories-and-training": [
        b("logo-launchmonitor-skytrak-ba9732a2d1.webp", "SkyTrak"),
        b("Rapsodo_Logo_1200x1200_clipped_rev_1-c18b6c2dbf.webp", "Rapsodo"),
        b("Full-Swing_clipped_rev_1-5729190e47.webp", "Full Swing"),
        b("logo-Garmin-2a8d606082.webp", "Garmin"),
        b("logo-Bushnell-1c8ff2bc7e.webp", "Bushnell"),
        b("blue-tees-golf-logo-jpg_50fddbcdf1bc5728890207d304f83f3a_clipped_rev_1-0cbd336d23.webp", "Blue Tees"),
        b("whoop-logo-png_seeklogo-472254-e39fbea7ec.webp", "WHOOP"),
        b("CarlsPlace_Logo_Black-18bcd41d71.webp", "Carl's Place"),
        b("logo-PING-3f87d394b0.webp", "PING"),
        b("logo-LAB-Golf-9b9bf42472.webp", "L.A.B. Golf"),
        b("uskidsgolf-primary-2025-8f82ea3f5c.webp", "U.S. Kids Golf"),
    ],
};

/** A stable, category-appropriate brand logo (src + name) for a product. */
export const logoFor = (product: Pick<StoreProduct, "id" | "category" | "subcategory">): BrandLogo | null => {
    const bucket = LOGO_BUCKETS[`${product.category}/${product.subcategory}`] ?? [];
    if (bucket.length === 0) return null;
    const pick = bucket[hashId(product.id) % bucket.length];
    return { src: `store-images/logos/${pick.file}`, name: pick.name };
};

/** One star with a clipped fill (0–1) so half-stars render cleanly. */
const FillStar = ({ fill }: { fill: number }) => (
    <span className="relative inline-block size-3.5 shrink-0">
        <Star01 className="absolute inset-0 size-3.5 text-utility-yellow-200" aria-hidden="true" />
        <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
            <Star01 className="size-3.5 fill-utility-yellow-400 text-utility-yellow-400" aria-hidden="true" />
        </span>
    </span>
);

export const StarRating = ({ rating, count, className }: { rating: number; count?: number; className?: string }) => {
    const r = Math.round(rating * 2) / 2;
    return (
        <span className={cx("flex items-center gap-1.5", className)}>
            <span className="flex items-center gap-0.5">
                {[0, 1, 2, 3, 4].map((i) => (
                    <FillStar key={i} fill={Math.max(0, Math.min(1, r - i))} />
                ))}
            </span>
            {count !== undefined && <span className="text-xs text-tertiary tabular-nums">({count})</span>}
        </span>
    );
};

/** A product tile — image, wishlist heart, sale/sold-out badge, title, rating, price. */
export const ProductCard = ({
    product,
    onOpen,
    saved,
    onToggleSave,
}: {
    product: StoreProduct;
    onOpen?: () => void;
    saved?: boolean;
    onToggleSave?: () => void;
}) => {
    const logo = logoFor(product);
    return (
        <div className="group flex flex-col">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-primary ring-1 ring-secondary transition duration-100 ease-linear ring-inset hover:ring-brand">
                <button
                    type="button"
                    onClick={onOpen}
                    aria-label={product.title}
                    className="block size-full focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus-ring"
                >
                    <img src={product.src} alt={product.title} className="size-full object-contain p-5" loading="lazy" />
                </button>
                {!product.inStock ? (
                    <span className="absolute top-3 left-3">
                        <Badge color="gray" size="sm" type="pill-color">
                            Sold out
                        </Badge>
                    </span>
                ) : product.onSale ? (
                    <span className="absolute top-3 left-3">
                        <Badge color="error" size="sm" type="pill-color">
                            Sale
                        </Badge>
                    </span>
                ) : null}
                {/* Wishlist heart — blurred dark circle, red when saved */}
                <button
                    type="button"
                    aria-label={saved ? "Remove from saved" : "Save to wishlist"}
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

            {/* Brand — logo in a white circle + name */}
            {logo && (
                <div className="mt-3 flex items-center gap-2">
                    <span className="flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary ring-1 ring-secondary ring-inset">
                        <img src={logo.src} alt="" className="max-h-3.5 max-w-3.5 object-contain" loading="lazy" />
                    </span>
                    <span className="truncate text-xs font-medium text-secondary">{logo.name}</span>
                </div>
            )}
            <p className="mt-1.5 truncate text-sm font-semibold tracking-wide text-primary uppercase">{product.title}</p>
            <StarRating rating={product.rating} count={product.reviews} className="mt-1" />
            <p className="mt-1 text-sm">
                {product.onSale && product.salePrice ? (
                    <>
                        <span className="font-semibold text-primary tabular-nums">{money(product.salePrice)}</span>{" "}
                        <span className="text-tertiary line-through tabular-nums">{money(product.price)}</span>
                    </>
                ) : (
                    <span className="font-semibold text-primary tabular-nums">{money(product.price)}</span>
                )}
            </p>
        </div>
    );
};

/** Shop brand lockup — Sagamore mark + name. */
export const ShopBrand = ({ subtitle }: { subtitle?: string }) => (
    <div className="flex items-center gap-2.5">
        <span className="flex size-8 items-center justify-center rounded-full bg-primary-solid p-1.5">
            <SagamoreLogo className="h-full w-auto" />
        </span>
        <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-wide text-primary uppercase">Sagamore Pro Shop</span>
            {subtitle && <span className="text-xs text-tertiary">{subtitle}</span>}
        </div>
    </div>
);
