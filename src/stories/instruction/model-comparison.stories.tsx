import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AlertTriangle, CheckCircle, XClose } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { cx } from "@/utils/cx";
import { clubBrandStyle } from "@/stories/explorations/tenfore-chrome";
import { MCG_GREEN } from "@/components/instruction/instruction-catalog";
import { MicroLabel, SectionTitle } from "@/components/instruction/instruction-ui";

/**
 * "Instruction / *Model Comparison*" — the decision the Packages & Credits flow exists
 * to force, put side by side so it can be made on evidence rather than in the abstract.
 *
 * MCG has to choose before renewing or dropping CoachNow. All three models are built as
 * working stories under "Packages & Credits"; this page is the argument, not the UI.
 * Model C came out of the Sagamore prototype's resource-package step and wasn't
 * considered on the original call.
 */
const meta: Meta = {
    title: "Instruction/*Model Comparison*",
    parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

interface Row {
    dimension: string;
    a: string;
    b: string;
    c: string;
    /** Which models this dimension favors — drives the check / cross marks. */
    favors: ("a" | "b" | "c")[];
}

const ROWS: Row[] = [
    {
        dimension: "Cash up front",
        a: "Full package price at purchase — $495 for five lessons.",
        b: "Nothing up front. Each lesson is paid for as it's taken.",
        c: "One month at a time, every month — $199, indefinitely.",
        favors: ["a", "c"],
    },
    {
        dimension: "Outstanding liability",
        a: "A balance carried until relieved. Reportable per instructor, which is what payroll needs.",
        b: "None. There is nothing owed at any point.",
        c: "None past the current cycle. Two lessons at most.",
        favors: ["b", "c"],
    },
    {
        dimension: "Payroll relief",
        a: "Relieved lesson by lesson as they're taught — matches how MCG pays today.",
        b: "Each lesson pays out when it happens. Nothing to reconcile.",
        c: "Pays out monthly against lessons actually taught that cycle.",
        favors: ["a", "b", "c"],
    },
    {
        dimension: "If an instructor leaves",
        a: "Their unrelieved balance goes with them as a problem. MCG has been burned by this.",
        b: "Nothing to unwind. Progress toward a discount simply stops.",
        c: "Cancel the plan at the next cycle. At most one month to settle.",
        favors: ["b", "c"],
    },
    {
        dimension: "Expiry & refunds",
        a: "Needs a policy, a date, an exceptions process, and staff who can explain it.",
        b: "No expiry to set and nothing to refund.",
        c: "Roll-over window instead of expiry. Cancellation replaces refunds.",
        favors: ["b"],
    },
    {
        dimension: "Commitment from the golfer",
        a: "Five lessons already paid for. Strong pull to come back and use them.",
        b: "A discount to chase, but nothing sunk. Easy to drift away after two.",
        c: "A standing monthly habit — the strongest pull of the three, while it lasts.",
        favors: ["a", "c"],
    },
    {
        dimension: "Predictable revenue",
        a: "Lumpy. A big hit at purchase, then nothing for months.",
        b: "Entirely dependent on booking behavior.",
        c: "Recurring and forecastable — the reason to build it at all.",
        favors: ["c"],
    },
    {
        dimension: "Migration from Thrive",
        a: "Imported balances have somewhere to live — the assigned-package state models this.",
        b: "No natural home for a carried-over balance. Those golfers need a separate answer.",
        c: "Same gap as B. A migrated balance isn't a subscription.",
        favors: ["a"],
    },
    {
        dimension: "Build cost",
        a: "Heaviest. Balances, relief, expiry, refunds, per-instructor reporting.",
        b: "Lightest. A counter and a discount rule.",
        c: "Middling. Recurring billing, renewal notices, cancellation, roll-over.",
        favors: ["b"],
    },
    {
        dimension: "How it's sold",
        a: 'A product a golfer buys — "five lessons with Martin."',
        b: 'A loyalty mechanic — "your fifth lesson is half price." Untested with MCG golfers.',
        c: 'A membership — "two lessons a month." Familiar, but new for instruction.',
        favors: ["a", "c"],
    },
];

const Mark = ({ on }: { on: boolean }) =>
    on ? (
        <CheckCircle className="mt-0.5 size-4 shrink-0 text-fg-success-secondary" aria-label="favors this model" />
    ) : (
        <XClose className="mt-0.5 size-4 shrink-0 text-fg-quaternary" aria-label="does not favor this model" />
    );

/** One model's cell in a comparison row. */
const Cell = ({ text, on }: { text: string; on: boolean }) => (
    <div className="flex items-start gap-2.5">
        <Mark on={on} />
        <span className={cx("text-sm", on ? "text-secondary" : "text-tertiary")}>{text}</span>
    </div>
);

export const Comparison: Story = {
    name: "Model Comparison",
    render: () => (
        <div className="min-h-dvh bg-secondary px-6 py-12 sm:px-8" style={clubBrandStyle(MCG_GREEN)}>
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
                <header className="flex flex-col gap-3">
                    <MicroLabel>MCG Academy · packages decision</MicroLabel>
                    <h1 className="max-w-3xl text-display-sm font-semibold text-primary">Credit book, volume discount, or monthly plan?</h1>
                    <p className="max-w-3xl text-md text-tertiary">
                        MCG sells lesson packages today and relieves the credit one lesson at a time so payroll stays honest. That produces outstanding liability the Academy has
                        been caught by before. The alternative raised on the call drops the pack entirely and discounts the fifth lesson instead. A third option — a monthly
                        plan — came out of the Sagamore prototype and keeps the recurring revenue the discount gives up. All three are built as working stories under{" "}
                        <span className="font-semibold text-secondary">Packages &amp; Credits</span>.
                    </p>
                </header>

                {/* The three positions, stated plainly */}
                <div className="grid items-start gap-4 lg:grid-cols-3">
                    <div className="flex flex-col gap-3 rounded-2xl bg-primary p-6 ring-2 ring-brand ring-inset">
                        <div className="flex flex-wrap items-center gap-2.5">
                            <h2 className="text-lg font-semibold text-primary">A — Credit book</h2>
                            <Badge color="success" size="sm" type="pill-color">
                                Today
                            </Badge>
                        </div>
                        <p className="text-sm text-tertiary">
                            A golfer buys five lessons for $495. A balance is created against that instructor and relieved as each lesson is taught. The golfer sees credits;
                            the Academy sees liability. Same ledger, both ends.
                        </p>
                    </div>
                    <div className="flex flex-col gap-3 rounded-2xl bg-primary p-6 ring-1 ring-secondary ring-inset">
                        <div className="flex flex-wrap items-center gap-2.5">
                            <h2 className="text-lg font-semibold text-primary">B — Volume discount</h2>
                            <Badge color="warning" size="sm" type="pill-color">
                                Untested
                            </Badge>
                        </div>
                        <p className="text-sm text-tertiary">
                            No pack is sold. Lessons ring up at full price and the fifth is half off once four are taken with the same instructor — the grocery-store mechanic
                            from the call. Nothing is ever owed.
                        </p>
                    </div>
                    <div className="flex flex-col gap-3 rounded-2xl bg-primary p-6 ring-1 ring-secondary ring-inset">
                        <div className="flex flex-wrap items-center gap-2.5">
                            <h2 className="text-lg font-semibold text-primary">C — Monthly plan</h2>
                            <Badge color="blue" size="sm" type="pill-color">
                                New
                            </Badge>
                        </div>
                        <p className="text-sm text-tertiary">
                            Two lessons a month for $199, billed on a cycle with auto-renew and a three-day renewal notice. Nothing prepaid past the current month, so no
                            liability — but the revenue is recurring.
                        </p>
                    </div>
                </div>

                {/* Dimension-by-dimension */}
                <section className="flex flex-col gap-4">
                    <SectionTitle sub="A check marks each model the dimension favors. Some rows favor more than one; “Payroll relief” favors all three.">
                        Where they differ
                    </SectionTitle>
                    <div className="overflow-x-auto rounded-2xl ring-1 ring-secondary ring-inset">
                        <div className="min-w-[720px] bg-primary">
                            <div className="grid grid-cols-[150px_1fr_1fr_1fr] border-b border-secondary bg-secondary_subtle">
                                <div className="px-5 py-3">
                                    <MicroLabel>Dimension</MicroLabel>
                                </div>
                                <div className="px-5 py-3">
                                    <MicroLabel>A — credit book</MicroLabel>
                                </div>
                                <div className="px-5 py-3">
                                    <MicroLabel>B — volume discount</MicroLabel>
                                </div>
                                <div className="px-5 py-3">
                                    <MicroLabel>C — monthly plan</MicroLabel>
                                </div>
                            </div>
                            <div className="flex flex-col divide-y divide-secondary">
                                {ROWS.map((r) => (
                                    <div key={r.dimension} className="grid grid-cols-[150px_1fr_1fr_1fr] gap-5 px-5 py-4">
                                        <span className="text-sm font-semibold text-primary">{r.dimension}</span>
                                        <Cell text={r.a} on={r.favors.includes("a")} />
                                        <Cell text={r.b} on={r.favors.includes("b")} />
                                        <Cell text={r.c} on={r.favors.includes("c")} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <p className="text-sm text-tertiary tabular-nums">
                        Tally — A: {ROWS.filter((r) => r.favors.includes("a")).length} · B: {ROWS.filter((r) => r.favors.includes("b")).length} · C:{" "}
                        {ROWS.filter((r) => r.favors.includes("c")).length} of {ROWS.length} dimensions.
                    </p>
                </section>

                {/* What the design work actually says */}
                <section className="flex flex-col gap-4">
                    <SectionTitle>What the screens suggest</SectionTitle>
                    <div className="flex flex-col gap-3 rounded-2xl bg-primary p-6 ring-1 ring-secondary ring-inset">
                        <p className="max-w-3xl text-sm text-secondary">
                            Model A is the heavier build and the one MCG already knows how to operate. Almost all of its cost is in policy rather than interface: expiry,
                            transferability, refunds, and what happens when an instructor leaves. The screens can&rsquo;t answer those — the Academy has to.
                        </p>
                        <p className="max-w-3xl text-sm text-secondary">
                            Model B is dramatically simpler to build and to run, and it removes the liability problem entirely. What it gives up is the cash up front and the
                            commitment that comes with it, which is a commercial question, not a design one.
                        </p>
                        <p className="max-w-3xl text-sm text-secondary">
                            Model C is the one the original call never considered, and on this table it does best — it keeps the revenue and the commitment without accruing
                            the liability. Its weak spots are real but narrow: it has no home for a migrated Thrive balance, and &ldquo;a subscription to lessons&rdquo; is a
                            harder sell than a pack to a golfer who takes four lessons a year.
                        </p>
                        <div className="mt-1 flex items-start gap-2.5 rounded-xl bg-warning-secondary px-4 py-3.5">
                            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-fg-warning-secondary" aria-hidden="true" />
                            <p className="max-w-3xl text-sm text-warning-primary">
                                <span className="font-semibold">The combination worth pricing:</span> Model C as the academy-wide default for regulars, Model A kept only for
                                the handful of producers whose students want to prepay. That contains liability to a few instructors instead of all 25 — at the cost of
                                building and supporting two systems.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="flex flex-col gap-4">
                    <SectionTitle>Still open</SectionTitle>
                    <ul className="flex flex-col gap-2.5">
                        {[
                            "Do credits expire today, and can a pack transfer between family members?",
                            "What happens to an unrelieved balance when an instructor leaves MCG?",
                            "Is a per-instructor pack the general product, or specific to how MCG prices its staff? (The base-rate-plus-adjustment model in Elements is one answer.)",
                            "Would MCG golfers buy a monthly lesson plan, or is instruction too seasonal in Maryland for a subscription?",
                            "Where does an expired balance land — Academy revenue, carried liability, or extended on request?",
                        ].map((q) => (
                            <li key={q} className="flex items-start gap-3 rounded-xl bg-primary px-4 py-3.5 text-sm text-secondary ring-1 ring-secondary ring-inset">
                                <span className="mt-1.5 size-1.5 shrink-0 rounded-full" style={{ backgroundColor: MCG_GREEN }} />
                                {q}
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </div>
    ),
};
