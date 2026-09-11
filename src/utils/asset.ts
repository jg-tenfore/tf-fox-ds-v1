/**
 * Resolve a static brand asset (course logos, product shots, card marks).
 *
 * Storybook serves these at the site root via `staticDirs`, so a bare relative path
 * resolves correctly from `iframe.html`. The Next prototype is served from a nested
 * basePath with trailing-slash routes, where a relative path would resolve against
 * the current route instead. `NEXT_PUBLIC_ASSET_BASE` is set by next.config.mjs and
 * is undefined under Storybook, so the same call works in both.
 */
const BASE = process.env.NEXT_PUBLIC_ASSET_BASE ?? "";

export const asset = (path: string): string => `${BASE}${path.replace(/^\//, "")}`;
