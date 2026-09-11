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

const MAP = [
    ["images/sagamore", "public/sagamore-images"],
    ["images/kettleHills", "public/kettle-hills-images"],
    ["images/flogolf", "public/flogolf-images"],
    ["images/mcg", "public/mcg-images"],
    ["images/store/images", "public/store-images"],
    ["creditCards", "public/card-images"],
    ["images/events", "public/events-images"],
    ["images/mcg-academy", "public/mcg-academy-images"],
    ["images/mcg-shop", "public/mcg-shop-images"],
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
