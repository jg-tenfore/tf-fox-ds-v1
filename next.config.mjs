/** @type {import('next').NextConfig} */

// The prototype ships as a static export to GitHub Pages, alongside the Storybook
// build. Storybook owns the site root; the prototype lives under /prototype/.
//   https://jg-tenfore.github.io/tf-fox-ds-v1/            → Storybook
//   https://jg-tenfore.github.io/tf-fox-ds-v1/prototype/  → this app
//
// PAGES=1 switches on the subpath. Local `npm run dev` stays at "/".
const isPages = process.env.PAGES === "1";
const basePath = isPages ? "/tf-fox-ds-v1/prototype" : "";

const nextConfig = {
    output: "export",
    // GitHub Pages serves directories, so every route needs its own index.html.
    trailingSlash: true,
    basePath,
    // No image optimizer on a static host.
    images: { unoptimized: true },
    env: {
        // Consumed by `asset()` so brand imagery resolves from any route depth.
        NEXT_PUBLIC_ASSET_BASE: `${basePath}/`,
    },
    experimental: {
        optimizePackageImports: ["@untitledui/icons"],
    },
};

export default nextConfig;
