import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { proto } from "../start-here/tokens";
import { B, Block, type Change, Changes, Links, List, SummaryPage } from "./summary-kit";

/**
 * Sep 15, 2026: MCG Prototype 2, from the check-in with Weston (PR #18). Prototype 2 was
 * built as its own app and has no stories, so this Summary links into the app.
 */

const BUILT = (): Change[] => [
    {
        title: "A separate copy",
        body: "Prototype 2 is its own app, with its own screens and its own session. Prototype 1 didn't change, so the two can be compared side by side.",
        links: [
            [proto(2, "/"), "Prototype 2 home"],
            [proto(1, "/"), "Prototype 1 home"],
        ],
    },
    {
        title: "One Instruction tab, with Clinics folded in",
        body: "Lessons and clinics live in one tab. The old Clinics address opens Instruction, filtered to group clinics.",
        links: [
            [proto(2, "/instruction/"), "Instruction"],
            [proto(2, "/clinics/"), "Clinics"],
        ],
    },
    {
        title: "One catalog",
        body: "Academy private lessons, Academy programs and county clinics in one list, each with its type, format, instructors, courses and skill set.",
        links: [[proto(2, "/instruction/"), "The catalog"]],
    },
    {
        title: "Browse by service or by instructor",
        body: (
            <>
                A strip of courses, then <B>Services | Instructors</B>, then private or group and skill-set filters. The filters are kept in the address. An
                instructor's profile opens with what they offer.
            </>
        ),
        links: [[proto(2, "/instruction/"), "Try the filters"]],
    },
    {
        title: "A private lesson, one step at a time",
        body: "An appointment-style flow: the service, then the instructor (“any available” by default), then extras, then the date and time (a week strip, times of day, next available, or the waitlist), then checkout. A lesson summary with edit links stays beside every step.",
        links: [[proto(2, "/instruction/book/"), "Book a lesson"]],
    },
];

function Sep15Prototype2Summary() {
    return (
        <SummaryPage
            eyebrow="Sep 15, 2026 · check-in with Weston"
            title="MCG Prototype 2"
            intro="At the Sep 15 check-in, Weston asked for a different take on lessons: one place for lessons and clinics, and a step-by-step booking flow. Prototype 2 tries that as a separate copy, so Prototype 1 stays as it was."
            meta={["Pull request #18", "App only, no stories", "Its own app at /prototype-2/"]}
        >
            <Block title="What was asked">
                <List
                    items={[
                        "Put Instruction and Clinics in one place.",
                        "Let golfers browse by service or by instructor.",
                        "Try a step-by-step, appointment-style booking for private lessons.",
                        "Do all of it without changing Prototype 1.",
                    ]}
                />
            </Block>

            <Block title="What was built">
                <p>
                    Prototype 2 has no stories. Every link below opens a page in the app. Locally, run <B>npm run dev:2</B> first.
                </p>
                <Changes items={BUILT()} />
            </Block>

            <Block title="Compare it with Prototype 1">
                <p>The same page in each prototype:</p>
                <Links
                    links={[
                        [proto(1, "/instruction/"), "Instruction · Prototype 1"],
                        [proto(2, "/instruction/"), "Instruction · Prototype 2"],
                        [proto(1, "/clinics/"), "Clinics · Prototype 1"],
                        [proto(2, "/clinics/"), "Clinics · Prototype 2"],
                    ]}
                />
            </Block>

            <Block title="Still open, then">
                <List items={["Which flow MCG preferred. Answered on Sep 23: a hybrid of Prototypes 1 and 2, which became Prototype 3."]} />
                <Links links={[["sep-23-2026-summary--summary", "Sep 23 Summary"]]} />
            </Block>

            <Block title="A note on the pull request">
                <p>Pull request #18 also carries #17's change (Austin's Academy feedback), because its branch was cut from that one.</p>
            </Block>
        </SummaryPage>
    );
}

const meta = {
    title: "Reviews/Sep 15 – MCG Prototype 2/Summary",
    id: "sep-15-2026-prototype-2-summary",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Summary: Story = { render: () => <Sep15Prototype2Summary /> };
