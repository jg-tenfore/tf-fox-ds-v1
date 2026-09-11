import { ALL_PRODUCT_SLUGS } from "@/components/mcg/shop-catalog";
import { ProductScreen } from "@/components/mcg/shop/product-screen";

/**
 * `/shop/[slug]` — one product per catalog entry, prerendered at build time because the
 * prototype ships as a static export.
 */
export const generateStaticParams = async () => ALL_PRODUCT_SLUGS.map((slug) => ({ slug }));

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    return <ProductScreen slug={slug} />;
}
