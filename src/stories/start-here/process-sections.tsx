import heroArt from "./art/hero-academy.jpg";
import { DOCS, SUMMARIES, story } from "./tokens";
import { Callout, CardGrid, Cta, CtaRow, Hero, MiniCard, Points, Proposal, Shipped, type ShippedItem, Steps } from "./ui";

/**
 * Start Here › Process & roadmap — how a review becomes screens, what has shipped, what is
 * still open, and the handover to Crane Web. The shipped list is `git log --first-parent
 * origin/main` (pull request merges), one plain line each, newest first. The open decisions
 * are the eight in Linear project P-WJ-118 (WJ team), Nov 3, 2026. The page is public, so
 * it names the project, not its URL.
 */

const SHIPPED: ShippedItem[] = [
    { date: "2026-09-23", pr: 19, title: "MCG Prototype 3, the hybrid, plus Austin's discount and gender fixes", href: story(SUMMARIES.sep23) },
    {
        date: "2026-09-15",
        pr: 18,
        title: "MCG Prototype 2: one Instruction tab, and lesson booking one step at a time",
        href: story(SUMMARIES.sep15Prototype2),
    },
    { date: "2026-09-15", pr: 17, title: "Austin's Academy feedback: reviews, group pricing, sign-up rules", href: story(SUMMARIES.sep15Academy) },
    { date: "2026-09-11", pr: 16, title: "MCG Prototype 1, the Instruction flows and the real Academy roster", href: story(SUMMARIES.sep11) },
    {
        date: "2026-07-27",
        pr: 15,
        title: "MCG course logos and photos, and one tee sheet for every course",
        href: story("global-nav-tee-times-mcg-courses--default"),
    },
    { date: "2026-07-13", pr: 14, title: "Components sorted into six groups" },
    { date: "2026-07-10", pr: 13, title: "Tee time details for 1, 2 and 4 golfers, and numbered shop checkout steps" },
    { date: "2026-07-09", pr: 12, title: "Shop checkout, gift and punch cards, and shop badges", href: story("shop-checkout-1-cart--default") },
    { date: "2026-07-06", pr: 11, title: "Events, clinics, the calendar and the member profile", href: story("global-nav-events-browse-events--default") },
    { date: "2026-07-01", pr: 10, title: "An introduction page, and Storybook on port 6017" },
    { date: "2026-06-25", pr: 9, title: "Colorways and color theory, all WCAG AA", href: story("design-systems-overview--overview") },
    { date: "2026-06-23", pr: 8, title: "Pro shop and restaurant, and a colorway for each club" },
    { date: "2026-06-23", pr: 7, title: "README updated" },
    { date: "2026-06-23", pr: 6, title: "Each booking screen as its own component, and course imagery" },
    { date: "2026-06-22", pr: 5, title: "Confirmation page rebuilt, carousel dots fixed" },
    { date: "2026-06-20", pr: 4, title: "Account sign-in, the tee-time flow and confirmation" },
    { date: "2026-06-19", pr: 3, title: "Early booking stories hidden from the sidebar" },
    { date: "2026-06-19", pr: 2, title: "Two early tee-time search studies" },
    { date: "2026-06-17", title: "Fox set up: Next.js, Untitled UI React and Storybook 10" },
];

export const ProcessHero = () => (
    <Hero
        size="page"
        eyebrow="Process & roadmap"
        title="From an MCG review to a live prototype."
        lead="Each round starts with feedback from MCG or a check-in with Weston. It becomes a prototype change and a dated Reviews folder, and goes live when it merges to main. Since Nov 11, new golfer-web work happens in Crane Web."
        chips={[`${SHIPPED.length} changes shipped since Jun 17, 2026`, "Latest build: Sep 23", "8 open decisions", "Crane Web takes over"]}
        art={heroArt}
        actions={
            <CtaRow>
                <Cta kind="primary" href={story(SUMMARIES.sep23)}>
                    The newest review
                </Cta>
                <Cta kind="secondary" href={story(DOCS.howToReview)}>
                    How to review
                </Cta>
            </CtaRow>
        }
    />
);

export const ProcessSteps = () => (
    <Steps
        items={[
            {
                label: "Ask",
                title: "MCG feedback or a check-in",
                body: "Austin sends Academy feedback, or Weston walks through what MCG asked for.",
                meta: "MCG, Weston and Justin",
            },
            {
                label: "Write it down",
                title: "A dated review folder",
                body: "A new folder in Reviews, opening on a Summary: what was asked, built and still open.",
                meta: "Reviews",
            },
            {
                label: "Build",
                title: "Screens in a prototype",
                body: "A big change gets its own copy (Prototype 2, Prototype 3), so the earlier one stays as it was.",
                meta: "Prototypes",
            },
            {
                label: "Merge",
                title: "A pull request to main",
                body: "Each round is one branch and one pull request, merged when it's ready to show.",
                meta: "GitHub",
            },
            { label: "Share", title: "Live on GitHub Pages", body: "Storybook and all three prototypes rebuild on every merge to main.", meta: "Pages" },
        ]}
    />
);

export const ShippedList = () => <Shipped items={SHIPPED} />;

export const OpenDecisions = () => (
    <CardGrid min={420}>
        <Proposal
            code="D-1"
            title="Which package model?"
            answer="A credit book (Model A): golfers buy a pack of lesson credits."
            unblocks="packages and credits"
            links={[["Compare the models", story("instruction-model-comparison--comparison")]]}
        />
        <Proposal
            code="D-2"
            title="Extend clinics, or add new tables?"
            answer="Extend clinics. A private lesson is a clinic session with one seat and an instructor."
            unblocks="most of the backend work"
            links={[["The offering catalog", story("mcg-prototype-3-instruction--search")]]}
        />
        <Proposal
            code="D-3"
            title="Do instructors log in to Buck?"
            answer="Yes, with limits: their own hours, time off and schedule, but not prices."
            unblocks="instructor login"
        />
        <Proposal
            code="D-4"
            title="The money rules"
            answer="Pay at the lesson, switched on per lesson. One cancel window per course (say 24 hours) that staff can override. An optional no-show fee. “Buy 3” is worked out again after a refund. A credit pays for the whole lesson."
            unblocks="checkout, cancel and refund"
            links={[["Per-session clinic", story("mcg-prototype-3-programs--per-session-clinic")]]}
        />
        <Proposal
            code="D-5"
            title="Book a bay and an instructor together in v1?"
            answer="Later. For now, staff block the bay by hand."
            unblocks="moves bay-and-instructor booking out of v1"
        />
        <Proposal
            code="D-6"
            title="What moves over from today's lesson software, and when?"
            answer="Instructors, hours, students, future lessons and unused credits, in one hard cutover during a slow month. The date isn't picked."
            unblocks="the data import"
        />
        <Proposal
            code="D-7"
            title="How does a waitlist offer work?"
            answer="A text with a claim window (say 2 hours, shorter when the lesson is soon). Nobody pays until they claim."
            unblocks="the waitlist"
            links={[["The waitlist", story("mcg-prototype-3-instruction--waitlist")]]}
        />
        <Proposal
            code="D-8"
            title="Reviews in v1?"
            answer="Hidden for v1. They come back once there are real lessons and a plan for checking them."
            unblocks="moves the lesson-review tickets out of v1"
            links={[["Reviews, collecting", story("mcg-prototype-instructor-profile--reviews-collecting")]]}
        />
    </CardGrid>
);

export const AlsoOpen = () => (
    <Points
        items={[
            [
                "Who builds the golfer side?",
                "P-WJ-118 still plans its golfer tickets as Fox Web and Fox Mobile. Since Nov 11, Crane Web replaces Fox, so those tickets need to move to Crane Web, or be confirmed with Weston.",
            ],
            ["Colorway light tints.", "The club helper leaves the lightest brand tints green. Open since Sep 11."],
            [
                "Hampshire Greens instructors",
                "weren't captured in the Sep 11 roster pass, so that course shows an empty Academy. The link out of it was fixed on Sep 15.",
            ],
            ["Sample programs.", "Junior camp, junior league and Op 36 are invented. MCG doesn't run them today, and each is labelled “Sample program”."],
            [
                "Settled Sep 23:",
                "“Buy 3, get 50% off” comes off the whole registration. Gender is a label and never blocks a sign-up; age is the only hard block.",
            ],
        ]}
    />
);

export const ComingUp = () => (
    <>
        <CardGrid min={260}>
            <MiniCard eyebrow="1" title="Fox stops growing" tone="subtle">
                New golfer-web screens are designed in Crane Web. Fox keeps the MCG prototypes, so the links in Linear keep working.
            </MiniCard>
            <MiniCard eyebrow="2" title="Crane Web builds from Fox" tone="subtle" href={story("shop-checkout-1-cart--default")} cta="Fox's shop checkout">
                Crane Web's shop starts from Fox's pro shop and shop checkout screens. Lessons are expected to follow Prototype 3, the design MCG picked.
            </MiniCard>
            <MiniCard eyebrow="3" title="P-WJ-118 goes ahead" tone="subtle" href={story(SUMMARIES.sep23)} cta="Prototype 3 summary">
                Decisions first, then Buck's screens for staff and instructors, then the golfer screens. In Fox, only small gaps in Prototype 3 are left.
            </MiniCard>
        </CardGrid>
        <Callout tone="gray">
            <b>Timing isn't confirmed.</b> It depends on Weston confirming the eight decisions, starting with D-2.
        </Callout>
    </>
);
