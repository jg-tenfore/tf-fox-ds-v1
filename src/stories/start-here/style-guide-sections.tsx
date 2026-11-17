import heroArt from "./art/hero-terrace.jpg";
import shotKettle from "./screens/club-kettle-hills.jpg";
import shotSettings from "./screens/p1-settings.jpg";
import shotShop from "./screens/p1-shop.jpg";
import { DOCS, story } from "./tokens";
import { CardGrid, Code, Cta, CtaRow, Hero, MiniCard, Points, Split } from "./ui";

/**
 * Start Here › Style guide — Fox's rules, each linked to the Design System page that shows
 * it, and the bigger ones beside a screen that follows them. Every rule was checked
 * against the code it describes:
 *   src/styles/theme.css                         the fairway-green brand ramp, Inter
 *   src/stories/explorations/tenfore-chrome.tsx  clubBrandStyle()
 *   src/components/instruction-3/*.ts            MCG_GREEN, the badge colors
 *   src/components/mcg/account/account-settings.tsx  the two-step reset
 *   .storybook/main.ts                           staticDirs (the image folders)
 */

export const StyleHero = () => (
    <Hero
        size="page"
        eyebrow="Style guide"
        title="The rules every Fox screen follows."
        lead="Short on purpose. Each rule links to the Design System page that shows it, and the big ones sit beside a screen that follows them. Every rule was checked against the code."
        chips={["Tokens", "Type", "Club colorways", "Badges", "Buttons", "One screen, one file", "Sample data"]}
        art={heroArt}
        actions={
            <CtaRow>
                <Cta kind="primary" href={story("foundations-colors--brand")}>
                    Colors and tokens
                </Cta>
                <Cta kind="secondary" href={story("mcg-prototype-3-instruction--search")}>
                    See it in Prototype 3
                </Cta>
            </CtaRow>
        }
    />
);

/** The brand ramp from src/styles/theme.css: [step, hex]. */
const RAMP: [string, string][] = [
    ["25", "#F6FCF8"],
    ["50", "#ECFAF1"],
    ["100", "#D1F2DD"],
    ["200", "#A6E4BC"],
    ["300", "#74D098"],
    ["400", "#4AB675"],
    ["500", "#339C5D"],
    ["600", "#227C48"],
    ["700", "#1B643B"],
    ["800", "#185031"],
    ["900", "#144229"],
    ["950", "#0A2617"],
];

const Ramp = () => (
    <div className="mt-3 grid grid-cols-12 overflow-hidden rounded-lg ring-1 ring-secondary">
        {RAMP.map(([step, hex]) => (
            <div key={step} className="h-9" style={{ background: hex }} title={`brand-${step} ${hex}`}>
                <span className={`block pt-1 text-center text-[10px] font-semibold ${Number(step) >= 500 ? "text-white" : "text-secondary"}`}>{step}</span>
            </div>
        ))}
    </div>
);

export const TokenRule = () => (
    <CardGrid min={300}>
        <MiniCard
            eyebrow="1 · Color"
            title="Semantic tokens only"
            links={[
                ["Brand", story("foundations-colors--brand")],
                ["All colors", story("foundations-colors--all-colors")],
            ]}
        >
            Style with what a color is for: <Code>text-primary</Code>, <Code>bg-secondary</Code>, <Code>fg-brand-primary</Code>, <Code>border-secondary</Code>.
            Never a raw shade like <Code>text-gray-900</Code>. The brand is a fairway green. <Code>brand-600</Code> (#227C48) is the primary interactive color,
            dark enough for white text.
            <Ramp />
        </MiniCard>
        <MiniCard
            eyebrow="2 · Type"
            title="Inter, everywhere"
            links={[
                ["Font families", story("foundations-typography--font-families")],
                ["Type scale", story("foundations-typography--scale")],
            ]}
        >
            Body and display text are both Inter, with system fonts as backup. The prototypes load it with <Code>next/font</Code>. Code uses the system mono
            font.
        </MiniCard>
    </CardGrid>
);

export const ColorwayRule = () => (
    <Split
        n={3}
        eyebrow="Club colorways"
        title="One helper re-skins a whole screen"
        shot={shotKettle}
        caption="Tee Times for a three-course club, in its blue"
        actions={
            <CtaRow className="gap-x-4 gap-y-1">
                <Cta href={story("design-systems-overview--overview")}>Club Themes</Cta>
                <Cta href={story("design-systems-colorways--brand")}>Colorways</Cta>
                <Cta href={story("global-nav-tee-times-3-courses-kettle-hills--default")}>Open this screen</Cta>
            </CtaRow>
        }
    >
        <Points
            items={[
                ["clubBrandStyle(color)", "points the brand tokens at a club's color. The screen's components don't change."],
                [
                    "Four clubs use it:",
                    "Sagamore (near-black nav on the default green), Kettle Hills (#0E319E blue), FloGolf (#143620 dark green) and MCG (#1E8E4E green).",
                ],
                ["Every brand surface uses the -700 shade,", "so white text passes WCAG AA (4.5:1). Each club guide shows its worst contrast."],
                ["Known limit:", "the light brand tints stay green, so a selected row on a blue club still shows a faint green tint."],
            ]}
        />
    </Split>
);

export const BadgeRule = () => (
    <Split
        n={4}
        eyebrow="Badges"
        title="Pill badges, one meaning per color"
        shot={shotShop}
        caption="MCG Pro Shop · logo tiles and Save badges"
        actions={
            <CtaRow className="gap-x-4 gap-y-1">
                <Cta href={story("components-feedback-status-badge--playground")}>Badge</Cta>
                <Cta href={story("mcg-prototype-shop--storefront")}>Open this screen</Cta>
            </CtaRow>
        }
    >
        <Points
            items={[
                ["Brand:", "a private lesson, and goods with the MCG logo."],
                ["Blue:", "group formats (clinics, camps, leagues), and “Best seller”."],
                ["Green:", "“Save $X”, Upcoming, Confirmed, Paid. Amber: “N left” and “$X due at the lesson”."],
                ["Red:", "Waitlist (full) and Cancelled. Gray: “Sample program”, “Out of stock”, Completed."],
                ["Two badges at most", "on a product. “Out of stock” replaces the rest. Small on cards and rows, medium on detail pages."],
            ]}
        />
    </Split>
);

export const ButtonRule = () => (
    <Split
        n={5}
        eyebrow="Buttons"
        title="One primary per step, for the step forward"
        shot={shotSettings}
        caption="Account › Settings · the reset sits at the bottom"
        actions={
            <CtaRow className="gap-x-4 gap-y-1">
                <Cta href={story("components-actions-button--playground")}>Button</Cta>
                <Cta href={story("mcg-prototype-account--settings")}>Open this screen</Cta>
            </CtaRow>
        }
    >
        <Points
            items={[
                ["Primary (solid green)", "moves the golfer forward: “Book lesson”, “Join the waitlist”. One per step."],
                ["Secondary", "for alternatives and going back, like “Back to times”."],
                ["Link-gray", "for small inline actions, like the edit links in a lesson summary."],
                ["Destructive takes two steps.", "“Reset prototype data” opens a confirm, where the red “Yes, reset everything” sits beside Cancel."],
                ["Disabled is 50% opacity", "with a not-allowed cursor. Hovers use a quick 100ms linear transition."],
            ]}
        />
    </Split>
);

export const BuildRules = () => (
    <CardGrid min={300}>
        <MiniCard eyebrow="6 · Code" title="One screen, one file">
            Each prototype screen lives in one file under <Code>src/components/</Code>. Its route and its story both render that file, so a fix in one place is
            a fix in both. Each prototype is its own copy (<Code>mcg</Code>, <Code>mcg-2</Code>, <Code>mcg-3</Code>), so a change to one can't touch another.
        </MiniCard>
        <MiniCard eyebrow="7 · Behavior" title="A session that carries" href={story("mcg-prototype-account--settings")} cta="Reset it in Settings">
            Each prototype keeps one session in the browser. The cart survives a refresh, bookings show in Activity, lesson credits land in the Wallet, and
            county residency reprices every course. Any sign-in works.
        </MiniCard>
    </CardGrid>
);

export const DataRules = () => (
    <CardGrid min={220}>
        <MiniCard eyebrow="8" title="Invented data only" href={story(DOCS.howToReview)} cta="What sample data means">
            Golfers, orders, carts, prices and totals are made up. The 23 instructors are MCG's public roster: names, titles and courses only. Never put a real
            email or phone number on a page.
        </MiniCard>
        <MiniCard eyebrow="9" title="Prototype “today” is June 19, 2026" href={story("mcg-prototype-tee-times--tee-sheet")} cta="Tee Times">
            Every prototype treats Friday, June 19, 2026 as today, so dates and availability read the same on every visit.
        </MiniCard>
        <MiniCard
            eyebrow="10"
            title="Images: one folder per source"
            links={[
                ["MCG imagery", story("foundations-golf-courses-mcg--course-logos")],
                ["Sagamore", story("foundations-golf-courses-sagamore--photography")],
            ]}
        >
            Course, shop and Academy images are served at fixed paths like <Code>/mcg-images</Code>, the same in Storybook and in every prototype.
        </MiniCard>
        <MiniCard eyebrow="11" title="Patterns, not product names">
            When an idea comes from elsewhere, describe the pattern (“an appointment-style booking flow”), never another company's product.
        </MiniCard>
    </CardGrid>
);
