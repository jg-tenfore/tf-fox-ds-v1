import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { proto } from "../start-here/tokens";
import { B, Block, type Change, Changes, Links, List, SummaryPage } from "./summary-kit";

/** Sep 23, 2026: MCG Prototype 3, the hybrid, plus Austin's two fixes for Prototypes 1 and 2 (PR #19). */

const P3 = "mcg-prototype-3-instruction--";

const BUILT = (): Change[] => [
    {
        title: "One search step",
        body: "Pick courses, formats, days of the week and skill sets, plus a date range with quick presets. The search is kept in the address, so nothing is asked twice and a link reopens the same results.",
        links: [
            [`${P3}search`, "Search"],
            [`${P3}search-multi-course`, "Two courses"],
            [`${P3}search-date-range`, "Date range"],
            [`${P3}search-empty`, "Nothing matches"],
        ],
    },
    {
        title: "Services or instructors, then pick one or “any”",
        body: "The Services / Instructors toggle sits above the search. After the search, pick an instructor or let any available one take the lesson.",
        links: [
            [`${P3}search-by-instructor`, "By instructor"],
            [`${P3}choose-instructor`, "Choose an instructor"],
        ],
    },
    {
        title: "Prototype 1's time board and waitlist",
        body: "The time board comes back, filled in from the search, with open times tinted. The waitlist adds a date range, times of day and days of the week.",
        links: [
            [`${P3}choose-time`, "Time board"],
            [`${P3}choose-time-any-instructor`, "Any instructor"],
            [`${P3}waitlist`, "Waitlist"],
        ],
    },
    {
        title: "An account to book",
        body: (
            <>
                Sign-in sits <B>inside</B> checkout, so nothing chosen is lost. The Extras step is gone; extras are a dropdown at checkout.
            </>
        ),
        links: [
            [`${P3}checkout`, "Checkout"],
            [`${P3}checkout-with-extras`, "With extras"],
        ],
    },
    {
        title: "Formats and sample programs",
        body: "Private lessons, group clinics, junior camps, junior league and Op 36. Three are programs MCG doesn't run today, so each carries a gray “Sample program” badge.",
        links: [
            ["mcg-prototype-3-programs--per-session-clinic", "Group clinic"],
            ["mcg-prototype-3-programs--junior-league", "Junior league"],
            ["mcg-prototype-3-programs--op-36", "Op 36"],
            ["mcg-prototype-3-programs--junior-camp", "Junior camp"],
        ],
    },
    {
        title: "Packages",
        body: "A banner on Instruction, a short “how credits work”, a pack chooser for each instructor that shows the saving, and a “you'd save $X with a pack” prompt after booking. A pack is always its own purchase. This part has no story yet; open it in the app.",
        links: [[proto(3, "/instruction/packages/"), "Packages in Prototype 3"]],
    },
];

const FIXES: Change[] = [
    {
        title: "“Buy 3, get 50% off” comes off the whole registration",
        body: "Austin asked for the discount to cover the whole sign-up, not one session. It now reads “Registration discount” on the cart, checkout and receipt.",
        links: [["mcg-prototype-events-clinics--clinic-per-session-discount", "The discount"]],
    },
    {
        title: "Gender never blocks a sign-up",
        body: "Gender is a label now (Male, Female or Any), and golfers describe themselves. Age is the only hard block.",
        links: [["mcg-prototype-events-clinics--clinic-registration-blocked", "Blocked by age"]],
    },
];

function Sep23Summary() {
    return (
        <SummaryPage
            eyebrow="Sep 23, 2026 · MCG and Austin"
            title="MCG Prototype 3, the hybrid"
            intro="MCG looked at Prototypes 1 and 2 and asked for a mix of both. Prototype 3 is that mix, built as its own copy so neither earlier prototype changed. Austin's two Academy fixes went into Prototypes 1 and 2 at the same time."
            meta={["Pull request #19", "Prototype 3 · 15 screens", "Its own app at /prototype-3/"]}
        >
            <Block title="What was asked">
                <List
                    items={[
                        <>
                            <B>MCG:</B> one search step that gathers everything, Prototype 2's tiles and pricing, Prototype 1's time board and waitlist, and an
                            account to book.
                        </>,
                        <>
                            <B>Austin:</B> “Buy 3, get 50% off” should come off the whole registration, not one session.
                        </>,
                        <>
                            <B>Austin:</B> gender shouldn't block a sign-up.
                        </>,
                    ]}
                />
            </Block>

            <Block title="What was built: Prototype 3">
                <p>A copy of Prototype 2, at its own address. Open it as a site, or story by story:</p>
                <Links
                    links={[
                        [proto(3, "/instruction/"), "Open Prototype 3"],
                        [`${P3}search`, "Start at the search"],
                    ]}
                />
                <Changes items={BUILT()} />
            </Block>

            <Block title="What was built: fixes in Prototypes 1 and 2">
                <Changes items={FIXES} />
            </Block>

            <Block title="Still open">
                <List
                    items={[
                        "The eight decisions in Linear project P-WJ-118, listed on Start Here › Process & roadmap.",
                        "A few small gaps in Prototype 3.",
                        "Who builds the golfer screens. Since Nov 11, Crane Web replaces Fox as the live golfer web app, so the golfer tickets in P-WJ-118 need to move there.",
                    ]}
                />
                <Links links={[["start-here-process-roadmap--docs", "Open decisions"]]} />
            </Block>

            <Block title="What happened next">
                <p>
                    On Nov 3, Prototype 3 became Linear project P-WJ-118, “Instructors – CoachNow Replacement”, with 67 tickets. Many of them link to the
                    screens above, which is why every story here keeps its id.
                </p>
            </Block>
        </SummaryPage>
    );
}

const meta = {
    title: "Reviews/Sep 23 – MCG Prototype 3/Summary",
    id: "sep-23-2026-summary",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Summary: Story = { render: () => <Sep23Summary /> };
