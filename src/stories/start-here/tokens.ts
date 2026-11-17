import type { StaticImageData } from "next/image";

/**
 * Link helpers and shared facts for Storybook's Start Here pages (see ./ui.tsx).
 * Colours come from Fox's semantic Tailwind tokens, not from here.
 */

/** A Storybook page or story by id: docs ids end in `--docs`. */
export const story = (id: string) => `./?path=/${id.endsWith("--docs") ? "docs" : "story"}/${id}`;

/** Where this Storybook is published. GitHub Pages rebuilds it, and all three prototypes, on every merge to main. */
export const PAGES = "https://jg-tenfore.github.io/tf-fox-ds-v1/";

/**
 * A static image import as a URL. Storybook's Next.js framework hands back an
 * image object ({ src, width, height }); plain Vite hands back a string.
 */
export type ImageSource = string | StaticImageData;
export const src = (img: ImageSource) => (typeof img === "string" ? img : img.src);

/* --------------------------------------------------------------- Prototypes --- */

/**
 * The three MCG prototypes are siblings of this Storybook. Deployed, they sit at
 * /prototype/, /prototype-2/ and /prototype-3/ on the same GitHub Pages site; locally
 * each is its own dev server (npm run dev, dev:2, dev:3). Carried over from the old
 * Introduction page.
 */
export const PROTOTYPES = {
    1: { folder: "prototype", port: 3000 },
    2: { folder: "prototype-2", port: 3001 },
    3: { folder: "prototype-3", port: 3002 },
} as const;

export type PrototypeNumber = keyof typeof PROTOTYPES;

/** The base address of a prototype, for wherever this Storybook is running. */
export const protoBase = (which: PrototypeNumber = 1) => {
    const { folder, port } = PROTOTYPES[which];
    if (typeof window === "undefined") return `${PAGES}${folder}`;
    const { origin, pathname } = window.location;
    // Deployed, or previewed from a static build: the prototype is a sibling of this
    // Storybook under the same base path, whatever that base is.
    const i = pathname.indexOf("/iframe.html");
    const base = i > 0 ? pathname.slice(0, i + 1) : "/";
    if (base !== "/") return `${origin}${base}${folder}`;
    // Storybook's dev server at the domain root: each prototype is its own dev server.
    return `http://localhost:${port}`;
};

/** A page in a prototype. Routes end in a slash (the prototypes use trailingSlash). */
export const proto = (which: PrototypeNumber, path = "/") => `${protoBase(which)}${path}`;

/* ------------------------------------------------------------------- Pages --- */

/** The Start Here pages and the other docs pages they point at. */
export const DOCS = {
    overview: "start-here-overview--docs",
    styleGuide: "start-here-style-guide--docs",
    process: "start-here-process-roadmap--docs",
    howToReview: "start-here-how-to-review--docs",
    screenIndex: "prototypes-screen-index--docs",
    archive: "archive-about-the-archive--docs",
} as const;

/** Each review round's Summary, newest first. */
export const SUMMARIES = {
    sep23: "sep-23-2026-summary--summary",
    sep15Prototype2: "sep-15-2026-prototype-2-summary--summary",
    sep15Academy: "sep-15-2026-academy-feedback-summary--summary",
    sep11: "sep-11-2026-summary--summary",
} as const;

/**
 * Story counts, taken from Storybook's index.json on Nov 17, 2026, after the sidebar
 * was regrouped. "MCG screens" is MCG Prototype 3 + MCG Prototype 1 + Instruction.
 */
export const COUNTS = {
    mcgScreens: 143,
    prototype3: 15,
    prototype1: 95,
    instruction: 33,
    golferWeb: 51,
    prototypes: 3,
    reviews: 4,
    areas: 7,
    courses: 9,
    instructors: 23,
    // Area cards on the Overview
    academy: 25,
    teeTimes: 7,
    shop: 12,
    events: 15,
    grill: 18,
    account: 18,
    // Other folders
    designSystem: 351,
    archive: 9,
} as const;
