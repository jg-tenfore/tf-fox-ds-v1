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
    // Serve Sagamore brand imagery at a stable absolute URL (/sagamore-images/...)
    // in both dev and static builds, independent of Vite asset resolution.
    { "from": "../images/sagamore", "to": "/sagamore-images" }
  ]
};
export default config;