import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Flag01, Users01 } from "@untitledui/icons";
import { formatPrice, generateTeeTimes, type TeeTime } from "@/components/booking/sagamore-data";
import { cx } from "@/utils/cx";
import { KETTLE_HILLS_CLUB } from "./tenfore-chrome";

/**
 * "Tenfore Fox / Tee Times / 9-Hole Course Label (Exploration)" — options for
 * Kettle Hills, whose three nines shouldn't be surfaced by name (Ponds / Front
 * Valley / Rolling) in the contrasting banner. Instead the banner should read a
 * generic "9 Holes", with the specific course conveyed separately. Four treatments
 * to compare.
 */
const meta: Meta = {
    title: "Global Nav/Tee Times/9-Hole Course Label (Exploration)",
    parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

const NAV = KETTLE_HILLS_CLUB.navColor!;
const COURSES = ["Ponds", "Front Valley", "Rolling"];
const SLOTS = generateTeeTimes("weekday").filter((s) => s.spotsAvailable > 0).slice(0, 3);

type Variant = "eyebrow" | "subline" | "banner-combined" | "banner-split";

const Cell = ({ slot, course, variant }: { slot: TeeTime; course: string; variant: Variant }) => (
    <button
        type="button"
        className="group flex w-full flex-col overflow-hidden rounded-lg bg-primary text-left ring-1 ring-secondary transition duration-100 ease-linear ring-inset hover:ring-brand"
    >
        <div className="flex flex-col gap-2 px-3.5 py-3">
            {variant === "eyebrow" && (
                <span className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide uppercase" style={{ color: NAV }}>
                    <span className="size-2 rounded-full" style={{ backgroundColor: NAV }} />
                    {course} Course
                </span>
            )}
            <span className="text-lg font-semibold text-primary">{slot.label}</span>
            <div className="flex items-center gap-3 text-xs text-tertiary tabular-nums">
                <span className="flex items-center gap-1">
                    <Flag01 className="size-3.5 text-fg-quaternary" aria-hidden="true" />9 holes
                </span>
                <span className="flex items-center gap-1">
                    <Users01 className="size-3.5 text-fg-quaternary" aria-hidden="true" />
                    1-4
                </span>
            </div>
            <p className="text-xs text-tertiary">
                <span className="font-semibold text-secondary tabular-nums">{formatPrice(slot.price)}.00</span> Weekday
            </p>
            {variant === "subline" && (
                <span className="flex items-center gap-1.5 text-xs font-semibold text-secondary">
                    <span className="size-2 rounded-full" style={{ backgroundColor: NAV }} />
                    {course} Course
                </span>
            )}
        </div>

        {variant === "banner-split" ? (
            <div className="flex text-xs font-semibold tracking-wide uppercase">
                <span className="px-3.5 py-1 text-white" style={{ backgroundColor: NAV }}>
                    9 Holes
                </span>
                <span className="flex-1 bg-secondary px-3.5 py-1 text-secondary">{course}</span>
            </div>
        ) : (
            <div className="px-3.5 py-1 text-xs font-semibold tracking-wide text-white uppercase" style={{ backgroundColor: NAV }}>
                {variant === "banner-combined" ? `9 Holes · ${course}` : "9 Holes"}
            </div>
        )}
    </button>
);

const Section = ({ title, note, variant }: { title: string; note: string; variant: Variant }) => (
    <section className="border-t border-secondary pt-8 first:border-t-0 first:pt-0">
        <h2 className="text-lg font-semibold text-primary">{title}</h2>
        <p className="mt-1 max-w-xl text-sm text-tertiary">{note}</p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:max-w-2xl">
            {COURSES.map((course, i) => (
                <Cell key={course} slot={SLOTS[i % SLOTS.length]} course={course} variant={variant} />
            ))}
        </div>
    </section>
);

const Exploration = () => (
    <div className="min-h-dvh bg-secondary">
        <div className="mx-auto max-w-3xl px-6 py-12">
            <header>
                <p className="text-xs font-semibold tracking-wide text-quaternary uppercase">Tee Times · Exploration</p>
                <h1 className="mt-1 text-display-xs font-semibold text-primary">9-hole course label — Kettle Hills</h1>
                <p className="mt-2 max-w-xl text-md text-tertiary">
                    The contrasting banner now reads a generic <span className="font-semibold text-secondary">9 Holes</span> (used only to
                    flag a nine-hole booking). Since Kettle Hills has three separate nine-hole courses, each treatment shows a different way
                    to convey <span className="font-semibold text-secondary">which course</span> the nine is on.
                </p>
            </header>

            <div className="mt-10 flex flex-col gap-8">
                <Section title="A · Course eyebrow" note="Course name as a colored eyebrow above the time; banner stays a clean '9 Holes'." variant="eyebrow" />
                <Section title="B · Course subline" note="Course name with a dot below the price, close to the booking details; banner stays '9 Holes'." variant="subline" />
                <Section title="C · Combined banner" note="One banner carries both: '9 Holes · Course'. Fewest elements, but the banner does double duty." variant="banner-combined" />
                <Section title="D · Split banner" note="Two-segment banner — solid '9 Holes' + a neutral course chip. Keeps the 9-hole flag prominent and the course legible." variant="banner-split" />
            </div>
        </div>
    </div>
);

export const Default: Story = {
    name: "9-Hole Course Label",
    render: () => <Exploration />,
};
