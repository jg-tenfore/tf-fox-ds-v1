/**
 * Direct logo URLs for each club, independent of the `import.meta.glob` asset
 * indexes.
 *
 * Those indexes are a Vite feature, so anything importing them can only be built by
 * Storybook. The logos are reached from the shared chrome, which the Next prototype
 * also uses — so the one file every bundler must agree on gets its own module with
 * no glob in it. The wider `*-assets.ts` indexes stay exactly as they are for the
 * Storybook-only galleries.
 */
import { asset } from "@/utils/asset";

export const sagamoreLogoSrc = asset("sagamore-images/sagamore-logo.jpeg");
export const kettleHillsLogoSrc = asset("kettle-hills-images/kettleHills-logo.png");
export const flogolfLogoSrc = asset("flogolf-images/flogolf-logo.png");
