import type { FC } from "react";
import { GraduationHat01, HeartHand, MarkerPin01, Moon01, Target04, Trophy01 } from "@untitledui/icons";
import type { EventConcept, GolfEvent } from "@/components/events/events-catalog";
import { cx } from "@/utils/cx";

/**
 * Shared UI for the Sagamore Events screens. `EventCard` is a clean, photo-led
 * tile (date badge + host + title + date/time + location) modeled on the reference
 * layout — no heart, no footer buttons. `CONCEPT_UI` supplies per-concept color +
 * icon for the calendar chips and filters. Re-skinned with design-system tokens.
 */

export interface ConceptUI {
    label: string;
    Icon: FC<{ className?: string }>;
    /** Light tint (chip background). */
    bg: string;
    /** Icon / text color. */
    fg: string;
    /** Solid accent (calendar chip left border). */
    border: string;
}

/** Per-concept styling — static classes so Tailwind emits them. */
export const CONCEPT_UI: Record<EventConcept, ConceptUI> = {
    scramble: { label: "Scramble", Icon: Trophy01, bg: "bg-utility-green-50", fg: "text-utility-green-700", border: "border-utility-green-500" },
    clinic: { label: "Clinic", Icon: GraduationHat01, bg: "bg-utility-blue-50", fg: "text-utility-blue-700", border: "border-utility-blue-500" },
    contest: { label: "Chip & Putt", Icon: Target04, bg: "bg-utility-orange-50", fg: "text-utility-orange-700", border: "border-utility-orange-500" },
    charity: { label: "Charity", Icon: HeartHand, bg: "bg-utility-pink-50", fg: "text-utility-pink-700", border: "border-utility-pink-500" },
    league: { label: "League & Nights", Icon: Moon01, bg: "bg-utility-purple-50", fg: "text-utility-purple-700", border: "border-utility-purple-500" },
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Parse an ISO date into { month, day } for the overlaid date badge. */
export const dateBadge = (iso: string) => {
    const [, m, d] = iso.split("-");
    return { month: MONTHS[Number(m) - 1], day: String(Number(d)) };
};

/** An event is "almost full" when few spots remain, absolutely or proportionally. */
export const isLow = (e: GolfEvent) => e.spotsLeft > 0 && (e.spotsLeft <= 6 || e.spotsLeft / e.capacity <= 0.15);

/** A clean, photo-led event tile — image with date badge, then host / title / date / location. */
export const EventCard = ({ event, onOpen }: { event: GolfEvent; onOpen?: () => void }) => {
    const { month, day } = dateBadge(event.isoDate);
    return (
        <button
            type="button"
            onClick={onOpen}
            className="group flex flex-col text-left focus-visible:outline-none"
        >
            <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl bg-secondary ring-1 ring-secondary ring-inset">
                <img src={event.image} alt={event.title} loading="lazy" className="size-full object-cover transition duration-100 ease-linear group-hover:scale-[1.02]" />
                <span className="absolute top-3 left-3 flex flex-col items-center rounded-lg bg-primary px-2.5 py-1 shadow-sm ring-1 ring-secondary ring-inset">
                    <span className="text-[10px] font-bold tracking-wide text-brand-secondary uppercase">{month}</span>
                    <span className="-mt-0.5 text-lg leading-none font-bold text-primary tabular-nums">{day}</span>
                </span>
            </div>
            <p className="mt-3 truncate text-sm font-semibold text-brand-secondary">{event.presenter}</p>
            <p className="mt-0.5 line-clamp-2 text-md font-semibold text-primary transition duration-100 ease-linear group-hover:text-brand-secondary">{event.title}</p>
            <p className="mt-1 text-sm text-tertiary">
                {event.date} · {event.time}
            </p>
            <p className="mt-1 flex items-center gap-1 text-sm text-tertiary">
                <MarkerPin01 className="size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />
                {event.location}
            </p>
        </button>
    );
};
