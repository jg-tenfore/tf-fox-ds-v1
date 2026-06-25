/**
 * WCAG contrast ratios of each brand shade against white (#fff), baked at build
 * time from the OKLCH/RGB token values so the guides can badge compliance without
 * runtime color math. Generated via scripts; re-run if the palette changes.
 * AA normal text = 4.5:1.
 */
export const CONTRAST_VS_WHITE: Record<string, Record<string, number>> = {
    "rose": {
        "600": 4.51,
        "700": 6.06
    },
    "red": {
        "600": 4.76,
        "700": 6.42
    },
    "orange": {
        "600": 3.59,
        "700": 5.23
    },
    "amber": {
        "600": 3.19,
        "700": 5.05
    },
    "yellow": {
        "600": 2.93,
        "700": 4.92
    },
    "lime": {
        "600": 3.06,
        "700": 4.96
    },
    "green": {
        "600": 3.22,
        "700": 4.94
    },
    "emerald": {
        "600": 3.67,
        "700": 5.37
    },
    "teal": {
        "600": 3.66,
        "700": 5.39
    },
    "cyan": {
        "600": 3.6,
        "700": 5.28
    },
    "sky": {
        "600": 4.02,
        "700": 5.85
    },
    "blue": {
        "600": 5.26,
        "700": 6.82
    },
    "indigo": {
        "600": 6.44,
        "700": 8.07
    },
    "violet": {
        "600": 5.88,
        "700": 7.29
    },
    "purple": {
        "600": 5.53,
        "700": 7.07
    },
    "fuchsia": {
        "600": 4.66,
        "700": 6.27
    },
    "pink": {
        "600": 4.54,
        "700": 5.89
    },
    "slate": {
        "600": 7.56,
        "700": 10.34
    },
    "gray": {
        "600": 7.56,
        "700": 10.31
    },
    "zinc": {
        "600": 7.73,
        "700": 10.46
    },
    "neutral": {
        "600": 7.8,
        "700": 10.39
    },
    "stone": {
        "600": 7.64,
        "700": 10.28
    },
    "brand": {
        "600": 5.19,
        "700": 7.16
    }
};

export const AA_NORMAL = 4.5;

/** Contrast of a family/shade against white text-or-fill. */
export const ratioVsWhite = (family: string, shade: number): number => CONTRAST_VS_WHITE[family]?.[String(shade)] ?? 0;
