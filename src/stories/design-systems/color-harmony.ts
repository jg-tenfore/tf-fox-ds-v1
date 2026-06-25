/**
 * Color-theory helpers for the design-system combo guides. The chromatic Tailwind
 * families are placed on the wheel by their real OKLCH hue (the `h` of each
 * family's `-500` token), so analogous / complementary / triadic partners are
 * derived against the same perceptual space the palette is authored in, then
 * snapped to the nearest available named family ("curated" combos that stay
 * 100% on-system). Neutrals (gray/zinc/neutral/slate/stone) are excluded as
 * bases — they have no meaningful hue partners.
 */

export interface Family {
    key: string;
    label: string;
    /** OKLCH hue of the family's -500 token. */
    hue: number;
}

/** Chromatic families, ordered around the wheel by OKLCH hue. */
export const WHEEL: Family[] = [
    { key: "rose", label: "Rose", hue: 16.4 },
    { key: "red", label: "Red", hue: 25.3 },
    { key: "orange", label: "Orange", hue: 47.6 },
    { key: "amber", label: "Amber", hue: 70.1 },
    { key: "yellow", label: "Yellow", hue: 86.0 },
    { key: "lime", label: "Lime", hue: 130.9 },
    { key: "green", label: "Green", hue: 149.6 },
    { key: "emerald", label: "Emerald", hue: 162.5 },
    { key: "teal", label: "Teal", hue: 182.5 },
    { key: "cyan", label: "Cyan", hue: 215.2 },
    { key: "sky", label: "Sky", hue: 237.3 },
    { key: "blue", label: "Blue", hue: 259.8 },
    { key: "indigo", label: "Indigo", hue: 277.1 },
    { key: "violet", label: "Violet", hue: 292.7 },
    { key: "purple", label: "Purple", hue: 303.9 },
    { key: "fuchsia", label: "Fuchsia", hue: 322.2 },
    { key: "pink", label: "Pink", hue: 354.3 },
];

export type Theory = "analogous" | "complementary" | "triadic";

export const THEORIES: Record<Theory, { label: string; blurb: string }> = {
    analogous: { label: "Analogous", blurb: "Neighbors on the wheel (~±30°) — calm, cohesive, low contrast." },
    complementary: { label: "Complementary", blurb: "Opposite on the wheel (~180°) — high contrast, vivid pairing." },
    triadic: { label: "Triadic", blurb: "Three points ~120° apart — balanced and lively." },
};

const norm = (a: number): number => ((a % 360) + 360) % 360;
const dist = (a: number, b: number): number => {
    const d = Math.abs(norm(a) - norm(b));
    return Math.min(d, 360 - d);
};

/** Nearest family to a target hue, skipping any already-chosen keys. */
const nearest = (target: number, exclude: string[]): Family =>
    WHEEL.filter((f) => !exclude.includes(f.key)).reduce((best, f) => (dist(f.hue, target) < dist(best.hue, target) ? f : best));

/** The base family plus its harmony partners, snapped to named families. */
export const harmony = (baseKey: string, theory: Theory): Family[] => {
    const base = WHEEL.find((f) => f.key === baseKey);
    if (!base) throw new Error(`Unknown base family: ${baseKey}`);

    const offsets = theory === "analogous" ? [30, -30] : theory === "complementary" ? [180] : [120, -120];
    const picks: Family[] = [base];
    for (const offset of offsets) {
        picks.push(nearest(base.hue + offset, picks.map((p) => p.key)));
    }
    return picks;
};

/** A CSS reference to a family's shade, e.g. tone("blue", 700). */
export const tone = (key: string, shade: number): string => `var(--color-${key}-${shade})`;
