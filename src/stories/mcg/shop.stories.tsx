import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MCG_LOGO_PRODUCTS, SHOP_PRODUCTS } from "@/components/mcg/shop-catalog";
import { CartScreen } from "@/components/mcg/shop/cart-screen";
import { CheckoutScreen } from "@/components/mcg/shop/checkout-screen";
import { ConfirmationScreen } from "@/components/mcg/shop/confirmation-screen";
import { DEMO_CART_LINES, DEMO_ORDER } from "@/components/mcg/shop/order";
import { ProductScreen } from "@/components/mcg/shop/product-screen";
import { ShopScreen } from "@/components/mcg/shop/shop-screen";

/**
 * "MCG Prototype / Shop" — the Pro Shop path, end to end.
 *
 * Every story renders the same component the routed page renders, so what you see here
 * is literally what `/shop`, `/shop/[slug]`, `/cart`, `/cart/checkout` and
 * `/cart/confirmation` serve. There is no story-only markup anywhere in this file.
 *
 * Outside the prototype's `SessionProvider`, `useSession` returns an inert session — so
 * the cart screens take an optional fixture prop to show a populated state. The routed
 * pages never pass it.
 */
const meta: Meta = {
    title: "MCG Prototype/Shop",
    parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

/* ------------------------------------------------------------------ */
/* Storefront                                                          */
/* ------------------------------------------------------------------ */

export const Storefront: Story = {
    name: "1. Storefront",
    render: () => <ShopScreen />,
};

export const StorefrontLogoShop: Story = {
    name: "1b. Storefront — MCG logo shelf",
    render: () => <ShopScreen initialCategory="mcg-logo" />,
};

export const StorefrontSearch: Story = {
    name: "1c. Storefront — search",
    render: () => <ShopScreen initialQuery="glove" />,
};

/* ------------------------------------------------------------------ */
/* Product detail                                                      */
/* ------------------------------------------------------------------ */

/**
 * The logo-tile treatment.
 *
 * The Shop no longer lists a physical product without a photograph, so the MCG mark
 * on a green panel is reserved for offerings that have nothing to photograph — gift
 * cards, passes, lesson packs and services. A lesson pack is the clearest example:
 * real money, real terms, nothing to shoot.
 */
export const ProductMcgLogo: Story = {
    name: "2. Product — logo tile (lesson pack)",
    render: () => <ProductScreen slug={MCG_LOGO_PRODUCTS.find((p) => p.slug === "mcg-lesson-pack-5")?.slug ?? MCG_LOGO_PRODUCTS[0].slug} />,
};

/** A pass: the same tile treatment, priced from the real green-fee data. */
export const ProductPass: Story = {
    name: "2c. Product — resident play pack",
    render: () => <ProductScreen slug={MCG_LOGO_PRODUCTS.find((p) => p.slug === "mcg-ten-round-pack-resident")?.slug ?? MCG_LOGO_PRODUCTS[0].slug} />,
};

/** A photographed item with a pack-size option and no colourway. */
export const ProductBalls: Story = {
    name: "2b. Product — golf balls",
    render: () => <ProductScreen slug="callaway-supersoft-dozen" />,
};

/** The denomination path — the "size" is a dollar value that sets the price. */
export const ProductGiftCard: Story = {
    name: "2c. Product — gift card",
    render: () => <ProductScreen slug="mcg-gift-card" />,
};

/** Out of stock, so the buy button is disabled and the badge takes over. */
export const ProductOutOfStock: Story = {
    name: "2d. Product — out of stock",
    render: () => <ProductScreen slug={SHOP_PRODUCTS.find((p) => !p.inStock)!.slug} />,
};

/* ------------------------------------------------------------------ */
/* Cart                                                                */
/* ------------------------------------------------------------------ */

export const Cart: Story = {
    name: "3. Cart",
    render: () => <CartScreen lines={DEMO_CART_LINES} />,
};

export const CartEmpty: Story = {
    name: "3b. Cart — empty",
    render: () => <CartScreen lines={[]} />,
};

/* ------------------------------------------------------------------ */
/* Checkout and receipt                                                */
/* ------------------------------------------------------------------ */

export const Checkout: Story = {
    name: "4. Checkout",
    render: () => <CheckoutScreen lines={DEMO_CART_LINES} />,
};

export const Confirmation: Story = {
    name: "5. Confirmation",
    render: () => <ConfirmationScreen order={DEMO_ORDER} />,
};
