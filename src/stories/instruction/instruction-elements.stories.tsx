import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Calendar, Clock, MarkerPin01, Users01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { mcgCourses } from "@/components/foundations/mcg/mcg-assets";
import { clubBrandStyle } from "@/stories/explorations/tenfore-chrome";
import {
    ANY_INSTRUCTOR,
    BALANCE_AFTER_REDEMPTION,
    CATALOG_FILTERS,
    COACHES,
    COURSE_NAME,
    CREDIT_BALANCES,
    EDGE_BALANCES,
    GROUP_SERVICES,
    MCG_GREEN,
    PACKAGES,
    PRIVATE_SERVICES,
    anyInstructorDay,
    coachById,
    coachDay,
    coachesAtCourse,
    fromPrice,
    nextOpening,
    servicePrice,
} from "@/components/instruction/instruction-catalog";
import { DEFAULT_DATE } from "@/stories/explorations/tee-search-popovers";
import {
    AcademyHero,
    AudienceBadge,
    CapacityMeter,
    CoachAvatar,
    CoachCard,
    CoachColumn,
    CourseChip,
    CourseStrip,
    CredentialList,
    CreditCardPanel,
    CreditPips,
    DaypartSlots,
    ExitConfirm,
    FilterChips,
    MenuItemRow,
    MetaLine,
    MicroLabel,
    PolicyList,
    Rating,
    SavingNote,
    SectionTitle,
    ServiceCard,
    SlotButton,
    StepRail,
    SummaryLine,
} from "@/components/instruction/instruction-ui";
import { useState } from "react";

/**
 * "Instruction / Elements" — the design-system layer under both Instruction flows.
 *
 * Everything here is composed from the existing Fox base components (Button, Badge,
 * Input, Radio, Toggle) and the Global Nav / Tee Time Checkout / Shop Checkout
 * patterns. The MCG skin is not a new palette: it's `clubBrandStyle(MCG_GREEN)`
 * re-pointing the brand-derived tokens, exactly as Kettle Hills and FloGolf do with
 * their own colors.
 *
 * Several pieces come from the Sagamore booking prototype — the service card, the
 * capacity meter, daypart-sectioned slots, the any-instructor card, the policy triad,
 * and the exit guard.
 */
const meta: Meta = {
    title: "Instruction/Elements",
    parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

/** Wraps a specimen group with the MCG brand token override. */
const Sheet = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-dvh bg-secondary px-6 py-10 sm:px-8" style={clubBrandStyle(MCG_GREEN)}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">{children}</div>
    </div>
);

const Spec = ({ title, note, children }: { title: string; note: string; children: React.ReactNode }) => (
    <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1 border-b border-secondary pb-3">
            <h2 className="text-lg font-semibold text-primary">{title}</h2>
            <p className="max-w-3xl text-sm text-tertiary">{note}</p>
        </div>
        {children}
    </section>
);

const mikeKenny = coachById("mike-kenny")!;
const dougHamilton = coachById("doug-hamilton")!;
const dustinStearns = coachById("dustin-stearns")!;
const private45 = PRIVATE_SERVICES.find((s) => s.id === "private-45")!;

const FilterDemo = () => {
    const [v, setV] = useState("all");
    return <FilterChips options={CATALOG_FILTERS.map((f) => ({ id: f.id, label: f.label }))} value={v} onChange={setV} />;
};

const SlotDemo = () => {
    const [sel, setSel] = useState<number | null>(10 * 60 + 30);
    return <DaypartSlots slots={coachDay("doug-hamilton", "laytonsville", DEFAULT_DATE)} price={90} selected={sel} onSelect={setSel} />;
};

const ExitDemo = () => {
    const [open, setOpen] = useState(false);
    return (
        <div className="rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset">
            <Button size="md" color="secondary" onClick={() => setOpen(true)}>
                Show the exit guard
            </Button>
            <ExitConfirm open={open} onStay={() => setOpen(false)} onLeave={() => setOpen(false)} />
        </div>
    );
};

/** The full element set on one page — how the two flows are actually assembled. */
export const AllElements: Story = {
    name: "All Elements",
    render: () => (
        <Sheet>
            <Spec
                title="Service card"
                note="A private lesson and a scheduled program render as the same card, because structurally they are the same object with different capacity. This is what folding lessons into the clinics catalog buys you."
            >
                <FilterDemo />
                <div className="mt-1 grid items-start gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {[PRIVATE_SERVICES[0], PRIVATE_SERVICES[4], GROUP_SERVICES[0], GROUP_SERVICES[6]].map((s) => (
                        <ServiceCard key={s.id} service={s} />
                    ))}
                </div>
            </Spec>

            <Spec
                title="Capacity"
                note="Seats left in a scheduled program. Full becomes a waitlist prompt rather than a dead card — a flat “0 spots” tells the golfer nothing to do next."
            >
                <div className="grid gap-4 rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset sm:grid-cols-3">
                    {[GROUP_SERVICES[2], GROUP_SERVICES[5], GROUP_SERVICES[6]].map((s) => (
                        <div key={s.id} className="flex flex-col gap-2">
                            <span className="truncate text-sm font-semibold text-primary">{s.name}</span>
                            <CapacityMeter service={s} />
                        </div>
                    ))}
                </div>
            </Spec>

            <Spec
                title="Instructor card"
                note="Priced for the selected service, so the per-instructor adjustment shows at the moment it matters. “Any available instructor” leads the list — the fix for landing on an empty calendar, applied before the golfer commits to a person."
            >
                <div className="grid items-start gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <CoachCard
                        coach={ANY_INSTRUCTOR}
                        service={private45}
                        price={servicePrice(private45, ANY_INSTRUCTOR, 1)}
                        nextOpen={anyInstructorDay("laytonsville", DEFAULT_DATE).find((s) => s.status === "open")?.label ?? "—"}
                    />
                    {[mikeKenny, dougHamilton, dustinStearns].map((c) => (
                        <CoachCard key={c.id} coach={c} service={private45} price={servicePrice(private45, c, 1)} nextOpen={nextOpening(c.id, DEFAULT_DATE)} />
                    ))}
                </div>
                <p className="text-sm text-tertiary">
                    Martin is <span className="font-semibold text-secondary">+$20</span> on the academy rate, Dustin <span className="font-semibold text-secondary">−$20</span>.
                    One catalog, seven instructors — not seven catalogs.
                </p>
            </Spec>

            <Spec
                title="Lesson menu row"
                note="The academy menu priced for one instructor. Guardrails belong to the service — “Weekends only”, “9 AM – 12 PM” — so they narrow the calendar, not the other way round."
            >
                <div className="flex flex-col gap-3">
                    {PRIVATE_SERVICES.slice(0, 4).map((s) => (
                        <MenuItemRow key={s.id} service={s} coach={mikeKenny} onBook={() => {}} />
                    ))}
                </div>
            </Spec>

            <Spec title="Course identity" note="Nine MCG courses, each with its brand logo. Chips label a booking; the strip switches which course a cross-course instructor is teaching at.">
                <div className="flex flex-col gap-5">
                    <div className="flex flex-wrap gap-2">
                        {Object.keys(COURSE_NAME).map((slug) => (
                            <CourseChip key={slug} slug={slug} size="md" />
                        ))}
                    </div>
                    <CourseStrip slugs={dougHamilton.courseSlugs} activeSlug={dougHamilton.courseSlugs[0]} />
                </div>
            </Spec>

            <Spec title="Availability" note="Open, booked and blocked all stay visible so a day reads honestly. Twenty cells in a flat grid is a wall; three labelled blocks is a schedule.">
                <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
                        <SlotButton label="8:00 AM" status="open" price={110} />
                        <SlotButton label="8:30 AM" status="open" price={110} selected />
                        <SlotButton label="9:00 AM" status="open" note="Doug Hamilton" />
                        <SlotButton label="9:30 AM" status="booked" />
                        <SlotButton label="12:00 PM" status="blocked" blockedReason="Unavailable" />
                        <SlotButton label="1:00 PM" status="blocked" blockedReason="Not offered" />
                    </div>
                    <div className="rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset">
                        <SlotDemo />
                    </div>
                    <div>
                        <MicroLabel>Facility calendar column</MicroLabel>
                        <div className="mt-2.5 flex gap-4 overflow-x-auto pb-2">
                            {coachesAtCourse("laytonsville").map((c) => (
                                <CoachColumn
                                    key={c.id}
                                    coach={c}
                                    courseSlug="laytonsville"
                                    slots={coachDay(c.id, "laytonsville", DEFAULT_DATE).filter((s) => s.minutes >= 8 * 60 && s.minutes <= 12 * 60)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </Spec>

            <Spec title="Credits" note="Pips read faster than “3 of 5”. The balance panel is the golfer's wallet view and, read the other way, the Academy's outstanding liability for that instructor.">
                <div className="flex flex-col gap-5">
                    <div className="flex flex-wrap items-center gap-8 rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset">
                        {[
                            { label: "Full", n: 5 },
                            { label: "Partly spent", n: 2 },
                            { label: "Used up", n: 0 },
                        ].map((s) => (
                            <div key={s.label} className="flex flex-col gap-2">
                                <MicroLabel>{s.label}</MicroLabel>
                                <CreditPips total={5} remaining={s.n} />
                            </div>
                        ))}
                    </div>
                    <div className="grid items-start gap-4 lg:grid-cols-2">
                        <CreditCardPanel balance={CREDIT_BALANCES[0]} action={<Button size="sm" color="primary">Book with these credits</Button>} />
                        <CreditCardPanel balance={BALANCE_AFTER_REDEMPTION} />
                        <CreditCardPanel balance={CREDIT_BALANCES[1]} />
                        <CreditCardPanel balance={EDGE_BALANCES[1]} expired />
                    </div>
                </div>
            </Spec>

            <Spec
                title="Policy as data"
                note="The howItWorks / included / restrictions triad from the Sagamore prototype. Expiry, transferability and refund terms stop being prose and become fields the Academy sets per package."
            >
                <div className="grid gap-6 rounded-2xl bg-primary p-6 ring-1 ring-secondary ring-inset lg:grid-cols-3">
                    <PolicyList title="How it works" items={PACKAGES[0].howItWorks} tone="good" />
                    <PolicyList title="What's included" items={PACKAGES[0].included} tone="good" />
                    <PolicyList title="Restrictions" items={PACKAGES[0].restrictions} tone="limit" />
                </div>
            </Spec>

            <Spec title="Checkout pieces" note="The Shop Checkout order-summary lines and the credit-applied callout, reused for lessons and for packages.">
                <div className="grid items-start gap-4 lg:grid-cols-2">
                    <div className="flex flex-col rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset">
                        <SummaryLine label="45-Minute Private" value="$110.00" />
                        <SummaryLine label="Lesson credit applied" value="−$110.00" />
                        <SummaryLine label="Facility fee" value="$4.00" muted />
                        <div className="mt-2 border-t border-secondary pt-2.5">
                            <SummaryLine label="Due now" value="$4.00" strong />
                        </div>
                    </div>
                    <SavingNote>One credit applied — $110.00 covered. That leaves 4 lessons with Mike Kenny, good through December 31, 2026.</SavingNote>
                </div>
            </Spec>

            <Spec title="Progress rail" note="Five stages for a private lesson, three for a program. Numbered because the steps really are a sequence.">
                <div className="flex flex-col gap-4 rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset">
                    {[0, 1, 2, 3, 4].map((i) => (
                        <StepRail key={i} steps={["Lesson", "Instructor", "Time", "Details", "Payment"]} current={i} />
                    ))}
                    <div className="border-t border-secondary pt-4">
                        <StepRail steps={["Program", "Details", "Payment"]} current={1} />
                    </div>
                </div>
            </Spec>

            <Spec title="Exit guard" note="A half-filled booking is worth confirming before it's thrown away — and the slot goes back to the calendar.">
                <ExitDemo />
            </Spec>

            <Spec title="Typography, meta and badges" note="Section headings, icon meta lines, audience pills and credentials — the small type system both flows share.">
                <div className="grid items-start gap-4 lg:grid-cols-2">
                    <div className="flex flex-col gap-4 rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset">
                        <SectionTitle sub="Supporting line under a section heading.">Section title</SectionTitle>
                        <div className="flex flex-col gap-1.5">
                            <MetaLine icon={Calendar}>Fri, Jun 19, 2026</MetaLine>
                            <MetaLine icon={Clock}>10:30 AM · 45 min</MetaLine>
                            <MetaLine icon={MarkerPin01}>Falls Road</MetaLine>
                            <MetaLine icon={Users01}>1 golfer</MetaLine>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <AudienceBadge audience="adult" />
                            <AudienceBadge audience="junior" />
                            <AudienceBadge audience="senior" />
                        </div>
                        <Rating value={4.9} reviews={186} />
                    </div>
                    <div className="flex flex-col gap-4 rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset">
                        <SectionTitle>Credentials</SectionTitle>
                        <CredentialList items={mikeKenny.credentials} />
                        <div className="flex items-center gap-4 border-t border-secondary pt-4">
                            {COACHES.slice(0, 5).map((c) => (
                                <CoachAvatar key={c.id} coach={c} size="sm" />
                            ))}
                            <CoachAvatar coach={ANY_INSTRUCTOR} />
                        </div>
                    </div>
                </div>
            </Spec>
        </Sheet>
    ),
};

/** The page hero band, on its own so the MCG lockup can be checked in isolation. */
export const Hero: Story = {
    name: "Academy Hero",
    render: () => (
        <div style={clubBrandStyle(MCG_GREEN)}>
            <AcademyHero
                title="Golf lessons & clinics"
                blurb="Private lessons, playing lessons, multi-week clinics and junior camps across all nine MCG courses — in one place."
                right={
                    <div className="flex gap-3">
                        <div className="rounded-xl bg-secondary_subtle px-4 py-3 ring-1 ring-secondary ring-inset">
                            <MicroLabel>Instructors</MicroLabel>
                            <p className="text-display-xs font-semibold text-primary tabular-nums">{COACHES.length}</p>
                        </div>
                        <div className="rounded-xl bg-secondary_subtle px-4 py-3 ring-1 ring-secondary ring-inset">
                            <MicroLabel>Courses</MicroLabel>
                            <p className="text-display-xs font-semibold text-primary tabular-nums">{mcgCourses.length}</p>
                        </div>
                    </div>
                }
            />
        </div>
    ),
};

/** Instructor pricing as one catalog plus an adjustment — the model the prototype argues for. */
export const PricingModel: Story = {
    name: "Pricing Model",
    render: () => (
        <Sheet>
            <Spec
                title="One academy menu, adjusted per instructor"
                note="The alternative to a private catalog per pro. A club publishes one lesson menu and marks its producers up; MCG's rate bands fall out of the adjustment. This is the direct answer to whether per-instructor pricing generalizes beyond a county system."
            >
                <div className="overflow-x-auto rounded-2xl ring-1 ring-secondary ring-inset">
                    <table className="w-full min-w-[560px] bg-primary">
                        <thead>
                            <tr className="border-b border-secondary bg-secondary_subtle">
                                <th className="px-5 py-3 text-left text-xs font-semibold tracking-wide text-quaternary uppercase">Instructor</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold tracking-wide text-quaternary uppercase">Adjustment</th>
                                {PRIVATE_SERVICES.slice(0, 4).map((s) => (
                                    <th key={s.id} className="px-5 py-3 text-right text-xs font-semibold tracking-wide text-quaternary uppercase">
                                        {s.name}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary">
                            <tr>
                                <td className="px-5 py-3 text-sm font-semibold text-primary">Academy base</td>
                                <td className="px-5 py-3 text-sm text-tertiary">—</td>
                                {PRIVATE_SERVICES.slice(0, 4).map((s) => (
                                    <td key={s.id} className="px-5 py-3 text-right text-sm text-tertiary tabular-nums">
                                        ${s.basePrice}
                                    </td>
                                ))}
                            </tr>
                            {COACHES.map((c) => (
                                <tr key={c.id}>
                                    <td className="px-5 py-3 text-sm font-semibold text-primary">{c.name}</td>
                                    <td className="px-5 py-3 text-sm text-secondary tabular-nums">
                                        {c.priceAdj > 0 ? `+$${c.priceAdj}` : c.priceAdj < 0 ? `−$${Math.abs(c.priceAdj)}` : "$0"}
                                    </td>
                                    {PRIVATE_SERVICES.slice(0, 4).map((s) => (
                                        <td key={s.id} className="px-5 py-3 text-right text-sm font-semibold text-primary tabular-nums">
                                            ${servicePrice(s, c, 1)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="text-sm text-tertiary">
                    Seven instructors × six services would be 42 hand-maintained menu items. Here it&rsquo;s six services and seven numbers — and the &ldquo;from&rdquo; price on
                    any card is {`$${fromPrice("dustin-stearns")}`}, computed rather than typed.
                </p>
            </Spec>
        </Sheet>
    ),
};
