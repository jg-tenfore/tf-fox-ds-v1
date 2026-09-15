/**
 * Mirror the brand-asset folders into `public/` for the Next prototype.
 *
 * Storybook maps these through `staticDirs`; Next needs them under `public/`. Keeping
 * one source of truth in `images/` (and `creditCards/`) means both consume identical
 * files — the mapping below must match `.storybook/main.ts`.
 */
import { cp, mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

// Target `public/` folder: the root prototype by default, or another app's
// (`node scripts/copy-assets.mjs prototype-2/public`).
const PUBLIC = process.argv[2] ?? "public";

const MAP = [
    ["images/sagamore", `${PUBLIC}/sagamore-images`],
    ["images/kettleHills", `${PUBLIC}/kettle-hills-images`],
    ["images/flogolf", `${PUBLIC}/flogolf-images`],
    ["images/mcg", `${PUBLIC}/mcg-images`],
    ["images/store/images", `${PUBLIC}/store-images`],
    ["creditCards", `${PUBLIC}/card-images`],
    ["images/events", `${PUBLIC}/events-images`],
    ["images/mcg-academy", `${PUBLIC}/mcg-academy-images`],
    ["images/mcg-shop", `${PUBLIC}/mcg-shop-images`],
];

for (const [from, to] of MAP) {
    if (!existsSync(from)) {
        console.warn(`skip (missing): ${from}`);
        continue;
    }
    await rm(to, { recursive: true, force: true });
    await mkdir(path.dirname(to), { recursive: true });
    await cp(from, to, { recursive: true });
    console.log(`${from} → ${to}`);
}
