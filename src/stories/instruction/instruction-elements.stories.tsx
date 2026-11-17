import { useState, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { McgPage, McgShell } from "@/components/mcg-3/mcg-chrome";
import { SessionProvider } from "@/components/mcg-3/session";
import { LESSON_RAIL } from "@/components/mcg-3/instruction/book/book-model";
import {
    CREDIT_BALANCES,
    dateOfIso,
    dayFor,
    instructionHref,
    instructorsFor,
    offeringById,
    packageById,
    serviceById,
    serviceHref,
    servicePrice,
    coachById,
    subscriptionById,
    type Slot,
} from "@/components/mcg-3/instruction/data";
import { InstructorCard, PrivateLessonCard, ProgramCard } from "@/components/mcg-3/instruction/hub/hub-ui";
import { InstructionStoreProvider } from "@/components/mcg-3/instruction/instruction-store";
import { CoachAvatar, CourseChip, DaypartBoard, SlotButton, StarRating, StepRail } from "@/components/mcg-3/instruction/kit";
import { InstructionMemoryNav } from "@/components/mcg-3/instruction/nav";
import { CreditBalanceCard, CreditDots, CreditsExplainer, MonthlyPlanCard, PackCard } from "@/components/mcg-3/instruction/packages";
import { p3Story } from "@/stories/mcg-3/p3-story-kit";

/**
 * "Instruction / Elements" — the pieces the Instruction screens are assembled from.
 *
 * These stories now show **Prototype 3's updated elements (ported from the Crane MCG prototype)**:
 * the shared kit (`src/components/mcg-3/instruction/kit.tsx` — avatars, ratings, course chips, the
 * time board, the step rail), the hub's result and instructor cards (`hub/hub-ui.tsx`) and the
 * packages pieces (`packages/index.ts`). All of it is Fox Untitled UI components and semantic
 * tokens, skinned MCG green by the P3 shell. The story ids are unchanged; the original Flow A/B
 * elements still power Prototype 1's app.
 */
const meta: Meta = {
    title: "Prototypes/Instruction/Elements",
    id: "instruction-elements",
    parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

const noop = () => {};
const GALLERY_NAV = { path: "/instruction", push: noop, replace: noop };

/** P3's MCG shell (brand green, nav, footer) with the session, store and an inert in-memory router, so cards render their links without navigating. */
const Sheet = ({ children }: { children: ReactNode }) => (
    <SessionProvider>
        <InstructionStoreProvider>
            <InstructionMemoryNav value={GALLERY_NAV}>
                <McgShell>
                    <McgPage>
                        <div className="flex flex-col gap-12">{children}</div>
                    </McgPage>
                </McgShell>
            </InstructionMemoryNav>
        </InstructionStoreProvider>
    </SessionProvider>
);

const Spec = ({ title, note, children }: { title: string; note: string; children: ReactNode }) => (
    <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1 border-b border-secondary pb-3">
            <h2 className="text-lg font-semibold text-primary">{title}</h2>
            <p className="max-w-3xl text-sm text-tertiary">{note}</p>
        </div>
        {children}
    </section>
);

const BOARD_DATE = "2026-10-09";
const private45 = serviceById("private-45")!;
const mikeKenny = coachById("mike-kenny")!;
const dougHamilton = coachById("doug-hamilton")!;
const board = dayFor(private45, "mike-kenny", "falls-road", dateOfIso(BOARD_DATE));

const BoardDemo = () => {
    const [sel, setSel] = useState<number | null>(540);
    return <DaypartBoard slots={board} priceFor={() => servicePrice(private45, mikeKenny, 1)} selected={sel} onSelect={(s: Slot) => setSel(s.minutes)} />;
};

const RailDemo = () => {
    const [current, setCurrent] = useState(1);
    return <StepRail steps={LESSON_RAIL} current={current} onStep={(id) => setCurrent(LESSON_RAIL.findIndex((s) => s.id === id))} />;
};

const offerings = ["private-45", "clinic-adult-l2", "ggr-northwest", "junior-league-northwest"].map((id) => offeringById(id)).filter((o) => !!o);
const instructorEntries = instructorsFor(offerings).filter((e) => e.instructor.id === "mike-kenny" || e.instructor.id === "doug-hamilton");

/** The full element set on one page — how the Instruction screens are actually assembled. */
export const AllElements: Story = {
    name: "All Elements",
    render: () => (
        <Sheet>
            <Spec title="People, ratings, courses" note="Headshots (or initials on a tinted disc for “any instructor” and county staff), a half-star rating, and home courses as logo chips.">
                <div className="flex flex-wrap items-center gap-4">
                    {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
                        <CoachAvatar key={size} photo={mikeKenny.photo} initials={mikeKenny.initials} name={mikeKenny.name} size={size} />
                    ))}
                    <CoachAvatar initials="AI" size="lg" />
                    <StarRating rating={4.5} />
                    <StarRating rating={3.8} size="sm" />
                </div>
                <div className="flex flex-wrap gap-2">
                    {dougHamilton.courseSlugs.map((slug) => (
                        <CourseChip key={slug} slug={slug} />
                    ))}
                </div>
            </Spec>

            <Spec title="Result cards" note="A private lesson has no photo (every private would share one); a group program — Academy or county — leads with its art. Both carry badges, skill sets, who teaches and the price.">
                <div className="grid items-start gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {offerings.map((o) =>
                        o.format === "private" ? (
                            <PrivateLessonCard key={o.key} offering={o} href={serviceHref(o.id, "falls-road")} />
                        ) : (
                            <ProgramCard key={o.key} offering={o} href={serviceHref(o.id)} />
                        ),
                    )}
                </div>
            </Spec>

            <Spec title="Instructor cards" note="The Instructors tab: headshot, credential, title, home courses, what they teach that matches, lessons from $, next opening and the sample rating.">
                <div className="grid items-start gap-4 md:grid-cols-2">
                    {instructorEntries.map((e) => (
                        <InstructorCard key={e.instructor.id ?? e.instructor.name} entry={e} />
                    ))}
                </div>
            </Spec>

            <Spec title="Time board" note="Morning / Afternoon / Evening, each with its open count. Open times are white tiles with the price; booked and unavailable times stay visible, struck through.">
                <div className="flex flex-wrap gap-2">
                    {board.slice(0, 4).map((s) => (
                        <div key={s.minutes} className="w-28">
                            <SlotButton slot={s} price={s.status === "open" ? servicePrice(private45, mikeKenny, 1) : undefined} />
                        </div>
                    ))}
                </div>
                <div className="rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset">
                    <BoardDemo />
                </div>
            </Spec>

            <Spec title="Step rail" note="The booking's steps across the top: done steps link back, the current one is green, later ones muted. Under 768 it collapses to “Step 2 of 5” and a bar.">
                <div className="rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset">
                    <RailDemo />
                </div>
            </Spec>

            <Spec title="Packs, plans and credits" note="A pack per instructor (full and compact), a monthly plan (concept), a wallet balance with credit dots and its expiry date, and “How lesson credits work”.">
                <div className="grid items-start gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <PackCard pack={packageById("mike-kenny--pack-5")!} />
                    <PackCard pack={packageById("doug-hamilton--pack-10")!} variant="compact" />
                    <MonthlyPlanCard plan={subscriptionById("mike-kenny--sub-2")!} />
                </div>
                <div className="grid items-start gap-4 md:grid-cols-2">
                    {CREDIT_BALANCES.map((b) => (
                        <CreditBalanceCard key={b.id} balance={b} />
                    ))}
                </div>
                <div className="flex items-center gap-4">
                    <CreditDots total={5} remaining={4} />
                    <CreditDots total={10} remaining={3} size="sm" />
                </div>
                <CreditsExplainer />
            </Spec>
        </Sheet>
    ),
};

/** The hub's compact header, in place: the Instruction landing at its default URL. */
export const Hero: Story = p3Story(instructionHref(), "Prototype 3's Instruction landing — its compact header (eyebrow, title, Services | Instructors) above the search bar and format tiles.", {}, "Academy Hero");

/** Instructor pricing: the private lesson's group-size price table and each instructor's own rate. */
export const PricingModel: Story = p3Story(
    serviceHref("private-45", "falls-road"),
    "The 45-minute private at Falls Road: the price by group size, then each instructor with their own price — one Academy menu, adjusted per instructor.",
    {},
    "Pricing Model",
);
