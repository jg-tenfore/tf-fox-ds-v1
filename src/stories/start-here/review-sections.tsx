import heroArt from "./art/hero-clinic.jpg";
import shotPickTime from "./screens/p1-pick-time.jpg";
import shotTime from "./screens/p3-time.jpg";
import { DOCS, PAGES, SUMMARIES, proto, story } from "./tokens";
import { CardGrid, Code, Compare, Cta, CtaRow, Hero, MiniCard, Steps } from "./ui";

/**
 * Start Here › How to review — for Weston, MCG and developers: where to start, how to share
 * a screen, how to compare the three prototypes, where feedback goes, and where it all lives.
 * The prototype links use proto() from ./tokens (carried over from the old Introduction), so
 * they open the local dev servers locally and the GitHub Pages copies when deployed.
 */

export const ReviewHero = () => (
    <Hero
        size="page"
        eyebrow="How to review"
        title="Start at the newest Summary, then click through."
        lead="For Weston, MCG and developers. Every review round opens on a one-page Summary that links to each screen it changed. Feedback goes in Linear, with the screen's link."
        chips={["For product and developers", "A link for every screen", "Three prototypes to compare", "Sample data only"]}
        art={heroArt}
        actions={
            <CtaRow>
                <Cta kind="primary" href={story(SUMMARIES.sep23)}>
                    Open the newest Summary
                </Cta>
                <Cta kind="secondary" href={story(DOCS.screenIndex)}>
                    Screen index
                </Cta>
            </CtaRow>
        }
    />
);

export const ReviewSteps = () => (
    <Steps
        items={[
            {
                label: "Open",
                title: "The newest Reviews folder",
                body: "Reviews are listed newest first. Today that's Sep 23 – MCG Prototype 3.",
                meta: "Sidebar › Reviews",
            },
            { label: "Read", title: "Its Summary", body: "What was asked, what was built, and what is still open.", meta: "One page" },
            {
                label: "Click",
                title: "Into each screen",
                body: "Every screen in a Summary is a link. Or open the prototype itself: each one is a full site.",
                meta: "Prototypes",
            },
            { label: "Reply", title: "In Linear", body: "One issue per point, with the screen's link pasted in.", meta: "Weston & Justin team (WJ)" },
        ]}
    />
);

export const SidebarGuide = () => (
    <CardGrid min={290}>
        <MiniCard eyebrow="Everyone" title="Start Here" href={story(DOCS.overview)} cta="Overview" tone="subtle">
            What Fox is, its rules, the roadmap, and this page.
        </MiniCard>
        <MiniCard eyebrow="Product" title="Reviews" href={story(SUMMARIES.sep23)} cta="Newest summary" tone="subtle">
            One folder per round, newest first, each opening on a Summary. The place to start a review.
        </MiniCard>
        <MiniCard eyebrow="Product and developers" title="Prototypes" href={story(DOCS.screenIndex)} cta="Screen index" tone="subtle">
            The MCG prototypes, screen by screen, then the golfer web for sample clubs.
        </MiniCard>
        <MiniCard eyebrow="Developers" title="Design System" href={story(DOCS.styleGuide)} cta="Style guide" tone="subtle">
            Styles, components, account login and the club themes: the parts every screen is built from.
        </MiniCard>
        <MiniCard eyebrow="Background" title="Research" href={story("design-systems-color-theory-analogous--rose")} cta="Color theory" tone="subtle">
            Early concept studies and color theory. Useful background; nothing to review.
        </MiniCard>
        <MiniCard eyebrow="Reference" title="Archive" href={story(DOCS.archive)} cta="About the archive" tone="subtle">
            Superseded work. Starts collapsed; nothing in it needs a review.
        </MiniCard>
    </CardGrid>
);

export const Links = () => (
    <CardGrid min={220}>
        <MiniCard eyebrow="Share a screen" title="Copy the address bar">
            Every story has its own address, ending in <Code>?path=/story/…</Code> (pages end in <Code>?path=/docs/…</Code>). Paste it into Linear or Slack and
            it opens that exact screen on GitHub Pages.
        </MiniCard>
        <MiniCard eyebrow="Links last" title="Moving a story doesn't break its link">
            A link comes from the story's id, not its place in the sidebar. When the folders were reorganized on Nov 17, every story kept its id. That's why the
            links in the P-WJ-118 tickets still open.
        </MiniCard>
        <MiniCard eyebrow="Share a prototype page" title="Copy its address" href={proto(3, "/instruction/")} cta="Prototype 3 Instruction">
            Prototype pages have real addresses. A search is kept in the address too, so a link to Prototype 3's results opens those results.
        </MiniCard>
        <MiniCard eyebrow="Full screen" title="See a screen without Storybook around it">
            Use “Open in isolation mode” at the top right of a story, or press <Code>⌥ F</Code> for full screen. Press <Code>/</Code> to search the sidebar.
        </MiniCard>
    </CardGrid>
);

export const ComparePrototypes = () => (
    <CardGrid min={260}>
        <MiniCard eyebrow="Prototype 1 · 128 screens" title="The original" href={proto(1, "/instruction/")} cta="Open Prototype 1">
            Pick an instructor first, then a lesson, a time and checkout. Clinics have their own tab.
        </MiniCard>
        <MiniCard eyebrow="Prototype 2 · app only" title="One tab, one step at a time" href={proto(2, "/instruction/")} cta="Open Prototype 2">
            Instruction and Clinics in one tab and one catalog. A private lesson is booked one step at a time, with a summary that follows you. It has no
            stories.
        </MiniCard>
        <MiniCard eyebrow="Prototype 3 · 15 screens" title="MCG's hybrid" href={proto(3, "/instruction/")} cta="Open Prototype 3" tone="brand">
            One search step up front, Prototype 2's result tiles, Prototype 1's time board and waitlist, extras at checkout, and an account to book.
        </MiniCard>
    </CardGrid>
);

const SAME_PAGES: [string, string][] = [
    ["Instruction", "/instruction/"],
    ["Lesson booking", "/instruction/book/"],
    ["Packages", "/instruction/packages/"],
    ["Clinics", "/clinics/"],
    ["Tee Times", "/tee-times/"],
];

/** The same page in all three prototypes, one card per page. */
export const SamePage = () => (
    <CardGrid min={170}>
        {SAME_PAGES.map(([label, path]) => (
            <MiniCard
                key={path}
                eyebrow="Open in prototype"
                title={label}
                tone="subtle"
                links={[
                    ["1", proto(1, path)],
                    ["2", proto(2, path)],
                    ["3", proto(3, path)],
                ]}
            >
                <span className="break-all">{path}</span>
            </MiniCard>
        ))}
    </CardGrid>
);

export const CompareBooking = () => (
    <Compare
        items={[
            {
                img: shotPickTime,
                label: "Prototype 1 · Pick an instructor first",
                note: "Start from one instructor's page, then pick a time on their board.",
                href: story("mcg-prototype-lesson-booking--pick-a-time"),
                cta: "Open Prototype 1",
            },
            {
                img: shotTime,
                label: "Prototype 3 · Search first",
                note: "Search once, then the same time board opens filled in from the search.",
                href: story("mcg-prototype-3-instruction--choose-time"),
                cta: "Open Prototype 3",
            },
        ]}
    />
);

export const Feedback = () => (
    <CardGrid min={220}>
        <MiniCard eyebrow="Where" title="Linear, Weston & Justin team" tone="brand">
            All Fox feedback goes in Linear on the WJ team. Instruction feedback goes on project P-WJ-118. Tag Justin on any design change.
        </MiniCard>
        <MiniCard eyebrow="What to include" title="The link, the name and the prototype" tone="brand">
            Paste the story link, name the screen as the sidebar does, and say which prototype (1, 2 or 3).
        </MiniCard>
        <MiniCard eyebrow="How" title="One point per issue" tone="brand">
            Keep it, change it, or a question. For a choice between prototypes, say which one and why.
        </MiniCard>
        <MiniCard eyebrow="New ideas" title="Golfer-web ideas go to Crane Web" tone="brand">
            Crane Web replaces Fox as the live golfer web app, so new golfer-web ideas belong there, not here.
        </MiniCard>
    </CardGrid>
);

export const SampleData = () => (
    <CardGrid min={300}>
        <MiniCard eyebrow="Sample data" title="Golfers and numbers are invented">
            Golfers, orders, prices and totals are made up. This repo and Storybook are public. The 23 instructors are MCG's real public roster, and nothing
            about them is invented beyond what MCG publishes.
        </MiniCard>
        <MiniCard
            eyebrow="Clickable, not connected"
            title="Nothing reaches a server"
            href={story("mcg-prototype-account--settings")}
            cta="Reset prototype data"
        >
            Each prototype keeps a session in your browser, so carts and bookings carry from page to page. Account › Settings › Reset prototype data starts
            over.
        </MiniCard>
    </CardGrid>
);

export const Hosted = () => (
    <CardGrid min={300}>
        <MiniCard eyebrow="This Storybook" title="GitHub Pages">
            Rebuilt on every merge to main. Locally, <Code>npm run storybook</Code> serves it on port 6017.
            <div className="mt-3">
                <CtaRow className="gap-x-4 gap-y-1">
                    <Cta href={PAGES}>GitHub Pages</Cta>
                </CtaRow>
            </div>
        </MiniCard>
        <MiniCard eyebrow="The prototypes" title="Three sites beside it">
            At <Code>/prototype/</Code>, <Code>/prototype-2/</Code> and <Code>/prototype-3/</Code> on the same site. Locally: <Code>npm run dev</Code> (3000),{" "}
            <Code>dev:2</Code> (3001) and <Code>dev:3</Code> (3002). <Code>npm run build:pages</Code> builds all four the way CI does.
            <div className="mt-3">
                <CtaRow className="gap-x-4 gap-y-1">
                    <Cta href={proto(1)}>Prototype 1</Cta>
                    <Cta href={proto(2)}>Prototype 2</Cta>
                    <Cta href={proto(3)}>Prototype 3</Cta>
                </CtaRow>
            </div>
        </MiniCard>
    </CardGrid>
);
