import { type IndexArea, SCREEN_INDEX } from "./screen-index-data";
import { COUNTS, proto, story } from "./tokens";
import { CardGrid, Code, Cta, CtaRow, Hero, LinkCard, MiniCard } from "./ui";

/**
 * Prototypes › Screen index — every prototype story, grouped by prototype and area in the
 * sidebar's order. The list comes from ./screen-index-data.ts, which
 * scripts/build-screen-index.mjs generates from Storybook's index.json. Re-run it after a
 * prototype story is added, renamed or moved.
 */

const count = (prototype: string) => SCREEN_INDEX.find((p) => p.prototype === prototype)?.areas.reduce((n, a) => n + a.screens.length, 0) ?? 0;

const total = SCREEN_INDEX.reduce((n, p) => n + count(p.prototype), 0);

export const IndexHero = () => (
    <Hero
        size="page"
        eyebrow="Prototypes"
        title="Every prototype screen, by prototype and area."
        lead="One card per area, in the sidebar's order. Each screen opens as its own story. Prototype 2 has no stories, so its card links to the app."
        chips={[`${total} screens`, `${COUNTS.mcgScreens} for MCG`, `${COUNTS.golferWeb} for sample clubs`, "Sample data only"]}
        actions={
            <CtaRow>
                <Cta kind="primary" href={story("mcg-prototype-3-instruction--search")}>
                    Start with Prototype 3
                </Cta>
                <Cta kind="secondary" href={proto(3, "/")}>
                    Open the Prototype 3 site
                </Cta>
            </CtaRow>
        }
    />
);

const toLinks = (screens: [string, string][]) => screens.map(([label, id]) => [label, story(id)] as [string, string]);

/**
 * Small neighbouring areas shown as one card, so each prototype fills whole rows of three.
 * Display only: the generated data keeps every area apart.
 */
const MERGES: Record<string, [string[], string][]> = {
    "MCG Prototype 1": [[["Home", "Tee Times"], "Home & Tee Times"]],
    Instruction: [[["Elements", "Model Comparison"], "Elements & Model Comparison"]],
};

const mergeAreas = (prototype: string, areas: IndexArea[]): IndexArea[] =>
    (MERGES[prototype] ?? []).reduce((list, [names, title]) => {
        const parts = list.filter((a) => names.includes(a.area));
        if (parts.length < 2) return list;
        const merged: IndexArea = {
            area: title,
            // A lone screen gets its area's name, so "Landing" reads as "Home — Landing".
            screens: parts.flatMap((a) =>
                a.screens.map(([label, id]) => [a.screens.length === 1 && label !== a.area ? `${a.area} — ${label}` : label, id] as [string, string]),
            ),
        };
        const at = list.indexOf(parts[0]);
        return [...list.slice(0, at), merged, ...list.slice(at).filter((a) => !parts.includes(a))];
    }, areas);

/** One prototype's areas as link cards. */
export const PrototypeAreas = ({ prototype }: { prototype: string }) => {
    const p = SCREEN_INDEX.find((x) => x.prototype === prototype);
    if (!p) return null;
    return (
        <CardGrid min={280}>
            {mergeAreas(prototype, p.areas).map((a, i) => (
                <LinkCard key={a.area} eyebrow={String(i + 1)} title={a.area} links={toLinks(a.screens)} />
            ))}
        </CardGrid>
    );
};

const P2_PAGES: [string, string][] = [
    ["Home", "/"],
    ["Instruction", "/instruction/"],
    ["Lesson booking", "/instruction/book/"],
    ["Packages", "/instruction/packages/"],
    ["Clinics (opens Instruction)", "/clinics/"],
    ["Tee Times", "/tee-times/"],
    ["Shop", "/shop/"],
    ["Grill", "/grill/"],
    ["Account", "/account/"],
];

export const PrototypeTwo = () => (
    <CardGrid min={280}>
        <MiniCard eyebrow="App only" title="MCG Prototype 2" links={P2_PAGES.map(([label, path]) => [label, proto(2, path)] as [string, string])}>
            A separate copy of Prototype 1 with one Instruction tab and step-by-step lesson booking. It was built as its own app at <Code>/prototype-2/</Code>,
            so it has routes but no stories. Prototype 3 was copied from it.
        </MiniCard>
    </CardGrid>
);

export const counts = {
    p3: count("MCG Prototype 3"),
    p1: count("MCG Prototype 1"),
    instruction: count("Instruction"),
    golfer: count("Golfer web · Sagamore & clubs"),
};
