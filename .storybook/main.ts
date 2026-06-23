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
    // Serve Sagamore brand imagery at a stable URL (sagamore-images/...) in both
    // dev and static builds, independent of Vite asset resolution.
    { "from": "../images/sagamore", "to": "/sagamore-images" },
    // Kettle Hills Golf Course imagery served at kettle-hills-images/...
    { "from": "../images/kettleHills", "to": "/kettle-hills-images" },
    // FloGolf Lounge imagery served at flogolf-images/...
    { "from": "../images/flogolf", "to": "/flogolf-images" },
    // Card-brand logos (Visa, Mastercard, …) served at card-images/...
    { "from": "../creditCards", "to": "/card-images" }
  ],
  // When building for GitHub Pages the site is served from a repo subpath, so
  // the production bundle needs that base. Dev stays at root.
  viteFinal: async (viteConfig, { configType }) => {
    if (configType === "PRODUCTION") {
      viteConfig.base = "/tf-fox-ds-v1/";
    }
    return viteConfig;
  },
};
export default config;