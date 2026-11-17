import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { B, Block, type Change, Changes, List, SummaryPage } from "./summary-kit";

/** Sep 15, 2026: Austin's feedback on the MCG Academy in Prototype 1 (PR #17). */

const EC = "mcg-prototype-events-clinics--";
const LR = "mcg-prototype-lesson-review--";

const BUILT: Change[] = [
    {
        title: "Two bugs fixed",
        body: "On a course with no instructors, “See instructors at the other courses” now clears the filter instead of going nowhere. And the whole lesson row is a link now, not just a small link inside it.",
        links: [["mcg-prototype-academy--instructors-empty-course", "Empty course"]],
    },
    {
        title: "Verified reviews after a lesson",
        body: (
            <>
                Reviews come from TenFore's own prompt after a lesson, and an instructor can switch them off. No rating shows until there are <B>5</B> verified
                reviews (“Collecting reviews · 3 of 5”). A finished lesson gets “Leave a review” in Activity.
            </>
        ),
        links: [
            ["mcg-prototype-instructor-profile--reviews-collecting", "Collecting"],
            ["mcg-prototype-instructor-profile--reviews-off", "Switched off"],
            [`${LR}prompt`, "The prompt"],
            [`${LR}submitted`, "Submitted"],
            [`${LR}instructor-opted-out`, "Instructor opted out"],
        ],
    },
    {
        title: "Price by group size",
        body: "The Academy sets a total price for 1, 2, 3 and 4 golfers, and an instructor can set their own. A small price table shows on every lesson row.",
        links: [["mcg-prototype-instructor-profile--director", "See the price table"]],
    },
    {
        title: "Sign-up rules for clinics and lessons",
        body: "One set of rules for both: an age range, a gender limit (softened on Sep 23), custom questions, and a buy-N discount like “Buy 3, get 50% off”.",
        links: [
            [`${EC}clinic-per-session`, "Per-session clinic"],
            [`${EC}clinic-per-session-nudge`, "Buy 3 nudge"],
            [`${EC}clinic-registration-sheet`, "Questions"],
            [`${EC}clinic-registration-blocked`, "Blocked"],
            ["instruction-book-a-lesson--junior-lesson-ineligible", "Lesson age rule"],
        ],
    },
];

function Sep15AcademySummary() {
    return (
        <SummaryPage
            eyebrow="Sep 15, 2026 · feedback from Austin, MCG Academy"
            title="Austin's Academy feedback"
            intro="Austin, who runs lessons for the MCG Academy, went through Prototype 1. He found two bugs and asked about reviews, prices for groups and sign-up rules. All of it was built into Prototype 1."
            meta={["Pull request #17", "Prototype 1"]}
        >
            <Block title="What was asked">
                <List
                    items={[
                        "Two bugs: the empty-course link went nowhere, and only a small link on a lesson row was clickable.",
                        "Where reviews come from, and when a rating shows.",
                        "Lesson prices that change with the size of the group.",
                        "Sign-up rules for clinics and lessons: age, gender, questions and discounts.",
                    ]}
                />
            </Block>

            <Block title="What was built">
                <Changes items={BUILT} />
            </Block>

            <Block title="Open questions, then">
                <List
                    items={[
                        <>
                            Is “Buy 3, get 50% off” 50% off every session, or just the third? <B>Answered Sep 23:</B> it comes off the whole registration.
                        </>,
                        <>
                            How should gender limits work? “Women on Course” was set to women and non-binary golfers, and Girls Golf to girls.{" "}
                            <B>Answered Sep 23:</B> gender is a label and never blocks; age is the only hard block.
                        </>,
                    ]}
                />
            </Block>
        </SummaryPage>
    );
}

const meta = {
    title: "Reviews/Sep 15 – Austin's Academy feedback/Summary",
    id: "sep-15-2026-academy-feedback-summary",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Summary: Story = { render: () => <Sep15AcademySummary /> };
