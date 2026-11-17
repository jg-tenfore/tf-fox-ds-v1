import type { StorybookConfig } from '@storybook/nextjs-vite';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-mcp"
  ],
  "framework": "@storybook/nextjs-vite",
  "staticDirs": [
    "../public",
    // legacy-redirects.js (sends links to moved docs pages to their new id, loaded by
    // manager-head.html and preview-head.html) and tf-logo.svg (the sidebar brand).
    "./static",
    // Serve Sagamore brand imagery at a stable URL (sagamore-images/...) in both
    // dev and static builds, independent of Vite asset resolution.
    { "from": "../images/sagamore", "to": "/sagamore-images" },
    // Kettle Hills Golf Course imagery served at kettle-hills-images/...
    { "from": "../images/kettleHills", "to": "/kettle-hills-images" },
    // FloGolf Lounge imagery served at flogolf-images/...
    { "from": "../images/flogolf", "to": "/flogolf-images" },
    // Montgomery County Golf (MCG) course brand imagery served at mcg-images/...
    { "from": "../images/mcg", "to": "/mcg-images" },
    // Sagamore Pro Shop product imagery served at store-images/...
    { "from": "../images/store/images", "to": "/store-images" },
    // Card-brand logos (Visa, Mastercard, …) served at card-images/...
    { "from": "../creditCards", "to": "/card-images" },
    // Event imagery served at events-images/...
    { "from": "../images/events", "to": "/events-images" },
    // MCG Golf Academy instructor headshots + Academy lockup, at mcg-academy-images/...
    { "from": "../images/mcg-academy", "to": "/mcg-academy-images" },
    // Pro Shop product photography (balls + hard goods), at mcg-shop-images/...
    { "from": "../images/mcg-shop", "to": "/mcg-shop-images" }
  ],
  // When building for GitHub Pages the site is served from a repo subpath, so
  // the production bundle needs that base. Dev stays at root.
  viteFinal: async (viteConfig, { configType }) => {
    if (configType === "PRODUCTION") {
      viteConfig.base = "/tf-fox-ds-v1/";
    }
    // The Next.js framework copies next.config.mjs `env` into the stories, which sets
    // NEXT_PUBLIC_ASSET_BASE to "/" and makes `asset()` build root-absolute URLs
    // (/mcg-images/...). Those break under the /tf-fox-ds-v1/ base on GitHub Pages.
    // Empty keeps them relative to iframe.html, which works at any base. It has to be a
    // post plugin: the framework sets `define` in its own config hook, after viteFinal.
    viteConfig.plugins = [
      ...(viteConfig.plugins ?? []),
      {
        name: "fox-relative-asset-base",
        enforce: "post",
        config: () => ({ define: { "process.env.NEXT_PUBLIC_ASSET_BASE": JSON.stringify("") } }),
      },
    ];
    return viteConfig;
  },
};
export default config;