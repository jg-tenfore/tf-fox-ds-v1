import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { proto } from "../start-here/tokens";
import { B, Block, type Change, Changes, Links, List, SummaryPage } from "./summary-kit";

/** Sep 11, 2026: MCG Prototype 1, the Instruction flows and the real Academy roster (PR #16). */

const BUILT = (): Change[] => [
    {
        title: "A clickable county site",
        body: "The whole Montgomery County Golf site at its own address, built from the same screens as these stories. All nine courses, with Rattlewood and Sligo Creek added.",
        links: [
            [proto(1, "/"), "Open Prototype 1"],
            ["mcg-prototype-home--landing", "Home"],
        ],
    },
    {
        title: "Tee times",
        body: "One board for all nine courses, sorted by the clock, with resident rates, an electric caddy as a fourth way to get around, and a hold timer at checkout.",
        links: [
            ["mcg-prototype-tee-times--tee-sheet", "Tee sheet"],
            ["mcg-prototype-tee-times--resident-rates", "Resident rates"],
            ["mcg-prototype-tee-times--checkout-hold-expiring", "Hold running out"],
        ],
    },
    {
        title: "Shop, Grill, Events and Account",
        body: "A pro shop of 95 products (real photos for physical goods, the MCG mark for the rest), course grills with 112 items and 18 offers, events, clinics and a calendar, and an account shown in every state.",
        links: [
            ["mcg-prototype-shop--storefront", "Shop"],
            ["mcg-prototype-grill--courses", "Grill"],
            ["mcg-prototype-events-clinics--browse-events", "Events"],
            ["mcg-prototype-account--account", "Account"],
        ],
    },
    {
        title: "The MCG Academy",
        body: (
            <>
                The <B>23 real instructors</B> from MCG's public Academy pages, with their profiles. Lessons can be booked with “any available instructor”, on a
                facility calendar, or by joining a waitlist.
            </>
        ),
        links: [
            ["mcg-prototype-academy--instructors", "Instructors"],
            ["mcg-prototype-instructor-profile--director", "A profile"],
            ["instruction-book-a-lesson--any-available-instructor", "Any instructor"],
            ["instruction-book-a-lesson--facility-calendar", "Facility calendar"],
            ["instruction-book-a-lesson--join-the-waitlist", "Waitlist"],
        ],
    },
    {
        title: "Three ways to sell lesson packages",
        body: "A credit book, a volume discount and a monthly plan, side by side, with a page that compares them.",
        links: [
            ["instruction-packages-credits--browse-packages", "Packages"],
            ["instruction-model-comparison--comparison", "Model comparison"],
            ["instruction-elements--pricing-model", "Pricing model"],
        ],
    },
];

function Sep11Summary() {
    return (
        <SummaryPage
            eyebrow="Sep 11, 2026 · the first MCG build"
            title="MCG Prototype 1"
            intro="MCG wants to replace the lesson-booking software its Academy uses today. Prototype 1 is a full clickable county site to put in front of them, and an answer to whether TenFore can run a 23-instructor academy. It built on the MCG course logos and photos added on Jul 27."
            meta={["Pull request #16", "Prototype 1 · 128 screens", "Its own app at /prototype/"]}
        >
            <Block title="What was asked">
                <List
                    items={[
                        "A clickable county site to show MCG, not just separate screens.",
                        "Whether TenFore can run lessons for an academy of 23 instructors across nine courses.",
                    ]}
                />
            </Block>

            <Block title="What was built">
                <Changes items={BUILT()} />
            </Block>

            <Block title="Still open">
                <List
                    items={[
                        "The club color helper leaves the lightest brand tints green.",
                        "Hampshire Greens' instructors weren't captured in the roster pass, so that course shows an empty Academy.",
                        "Six Breadcrumbs stories were already failing before this round.",
                    ]}
                />
                <Links links={[["mcg-prototype-academy--instructors-empty-course", "The empty course"]]} />
            </Block>

            <Block title="What happened next">
                <p>Austin reviewed the Academy four days later, and Weston asked for a second take on lessons. Both landed on Sep 15.</p>
                <Links
                    links={[
                        ["sep-15-2026-academy-feedback-summary--summary", "Austin's feedback"],
                        ["sep-15-2026-prototype-2-summary--summary", "MCG Prototype 2"],
                    ]}
                />
            </Block>
        </SummaryPage>
    );
}

const meta = {
    title: "Reviews/Sep 11 – MCG Prototype 1/Summary",
    id: "sep-11-2026-summary",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Summary: Story = { render: () => <Sep11Summary /> };
