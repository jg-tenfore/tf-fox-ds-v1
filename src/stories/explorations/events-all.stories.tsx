import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Check, ChevronDown, FilterLines } from "@untitledui/icons";
import { CONCEPTS, type EventConcept, GOLF_EVENTS } from "@/components/events/events-catalog";
import { cx } from "@/utils/cx";
import { EventCard } from "./events-ui";
import { SAGAMORE_CLUB, SiteFooter, TopNav } from "./tenfore-chrome";

/**
 * "Tenfore Fox / Events / Browse Events" — the Pro Shop "shop all" experience
 * applied to golf events, with clean photo-led cards. Same filter bar + responsive
 * card grid, over the five event concepts (scrambles, clinics, chip-&-putt
 * contests, the Rally-for-the-Cure charity series, and leagues/nights).
 */
const meta: Meta = {
    title: "Global Nav/Events/Browse Events",
    parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

const CATEGORIES: { key: "all" | EventConcept; label: string }[] = [{ key: "all", label: "All events" }, ...CONCEPTS];

type SortKey = "date" | "price-asc" | "price-desc" | "rating" | "spots";
const SORTS: { key: SortKey; label: string }[] = [
    { key: "date", label: "Date: soonest" },
    { key: "price-asc", label: "Price: low to high" },
    { key: "price-desc", label: "Price: high to low" },
    { key: "rating", label: "Top rated" },
    { key: "spots", label: "Most spots left" },
];

type PriceKey = "u50" | "50-100" | "100-200" | "200p";
const PRICES: { key: PriceKey; label: string; test: (n: number) => boolean }[] = [
    { key: "u50", label: "Under $50", test: (n) => n < 50 },
    { key: "50-100", label: "$50 – $100", test: (n) => n >= 50 && n < 100 },
    { key: "100-200", label: "$100 – $200", test: (n) => n >= 100 && n < 200 },
    { key: "200p", label: "$200 & up", test: (n) => n >= 200 },
];

/* ------------------------------------------------------------------ */
/* Filter-bar primitives (shared shape with the Pro Shop shop-all)     */
/* ------------------------------------------------------------------ */

const Pill = ({
    active,
    open,
    chevron,
    onClick,
    children,
}: {
    active?: boolean;
    open?: boolean;
    chevron?: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) => (
    <button
        type="button"
        onClick={onClick}
        className={cx(
            "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold ring-1 transition duration-100 ease-linear ring-inset",
            active ? "bg-primary-solid text-white ring-transparent" : "bg-primary text-secondary ring-secondary hover:bg-primary_hover",
        )}
    >
        {children}
        {chevron && <ChevronDown className={cx("size-4 transition duration-100 ease-linear", open && "rotate-180")} aria-hidden="true" />}
    </button>
);

const Menu = ({ open, onClose, align = "left", children }: { open: boolean; onClose: () => void; align?: "left" | "right"; children: React.ReactNode }) =>
    open ? (
        <>
            <button type="button" aria-hidden tabIndex={-1} onClick={onClose} className="fixed inset-0 z-40 cursor-default" />
            <div className={cx("absolute top-full z-50 mt-2 min-w-52 rounded-xl bg-primary p-1.5 shadow-lg ring-1 ring-secondary", align === "right" ? "right-0" : "left-0")}>
                {children}
            </div>
        </>
    ) : null;

const MenuItem = ({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
        type="button"
        onClick={onClick}
        className={cx(
            "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition duration-100 ease-linear",
            selected ? "bg-active font-medium text-primary" : "text-secondary hover:bg-primary_hover",
        )}
    >
        {children}
        {selected && <Check className="size-4 shrink-0 text-fg-brand-primary" aria-hidden="true" />}
    </button>
);

/* ------------------------------------------------------------------ */
/* Screen                                                              */
/* ------------------------------------------------------------------ */

const EventsAllScreen = () => {
    const [openMenu, setOpenMenu] = useState<null | "filter" | "sort" | "price">(null);
    const [category, setCategory] = useState<"all" | EventConcept>("all");
    const [sort, setSort] = useState<SortKey>("date");
    const [charityOnly, setCharityOnly] = useState(false);
    const [availableOnly, setAvailableOnly] = useState(false);
    const [price, setPrice] = useState<PriceKey | null>(null);
    const close = () => setOpenMenu(null);
    const toggle = (k: "filter" | "sort" | "price") => setOpenMenu((p) => (p === k ? null : k));

    let list = GOLF_EVENTS.slice();
    if (category !== "all") list = list.filter((e) => e.concept === category);
    if (charityOnly) list = list.filter((e) => e.charity);
    if (availableOnly) list = list.filter((e) => e.spotsLeft > 0);
    if (price) {
        const test = PRICES.find((p) => p.key === price)!.test;
        list = list.filter((e) => test(e.price));
    }
    if (sort === "date") list.sort((a, b) => a.isoDate.localeCompare(b.isoDate));
    else if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    else if (sort === "spots") list.sort((a, b) => b.spotsLeft - a.spotsLeft);

    const priceLabel = price ? PRICES.find((p) => p.key === price)!.label : "Price";
    const categoryLabel = CATEGORIES.find((c) => c.key === category)!.label;

    return (
        <div className="flex min-h-dvh flex-col bg-secondary">
            <TopNav active="Events" club={SAGAMORE_CLUB} />
            <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10">
                <header className="mb-7">
                    <h1 className="text-display-xs font-semibold text-primary">Events at Sagamore</h1>
                    <p className="mt-1.5 text-md text-tertiary">Scrambles, clinics with our PGA pros, chip &amp; putt contests, charity outings, and night leagues — reserve your spot.</p>
                </header>

                {/* Filter bar */}
                <div className="flex flex-wrap items-center gap-2.5">
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => toggle("filter")}
                            aria-label="Filter by event type"
                            className={cx(
                                "flex size-10 items-center justify-center rounded-full ring-1 transition duration-100 ease-linear ring-inset",
                                category !== "all" ? "bg-primary-solid text-white ring-transparent" : "bg-primary text-fg-secondary ring-secondary hover:bg-primary_hover",
                            )}
                        >
                            <FilterLines className="size-5" aria-hidden="true" />
                        </button>
                        <Menu open={openMenu === "filter"} onClose={close} align="left">
                            <p className="px-3 py-1.5 text-xs font-semibold tracking-wide text-quaternary uppercase">Event type</p>
                            {CATEGORIES.map((c) => (
                                <MenuItem key={c.key} selected={category === c.key} onClick={() => { setCategory(c.key); close(); }}>
                                    {c.label}
                                </MenuItem>
                            ))}
                        </Menu>
                    </div>

                    <div className="relative">
                        <Pill chevron open={openMenu === "sort"} onClick={() => toggle("sort")}>
                            Sort by
                        </Pill>
                        <Menu open={openMenu === "sort"} onClose={close}>
                            {SORTS.map((s) => (
                                <MenuItem key={s.key} selected={sort === s.key} onClick={() => { setSort(s.key); close(); }}>
                                    {s.label}
                                </MenuItem>
                            ))}
                        </Menu>
                    </div>

                    <Pill active={charityOnly} onClick={() => setCharityOnly((v) => !v)}>
                        Charity
                    </Pill>

                    <div className="relative">
                        <Pill active={!!price} chevron open={openMenu === "price"} onClick={() => toggle("price")}>
                            {priceLabel}
                        </Pill>
                        <Menu open={openMenu === "price"} onClose={close}>
                            <MenuItem selected={!price} onClick={() => { setPrice(null); close(); }}>
                                Any price
                            </MenuItem>
                            {PRICES.map((pr) => (
                                <MenuItem key={pr.key} selected={price === pr.key} onClick={() => { setPrice(pr.key); close(); }}>
                                    {pr.label}
                                </MenuItem>
                            ))}
                        </Menu>
                    </div>

                    <Pill active={availableOnly} onClick={() => setAvailableOnly((v) => !v)}>
                        Available
                    </Pill>
                </div>

                <p className="mt-4 text-sm text-tertiary">
                    {list.length} {list.length === 1 ? "event" : "events"}
                    {category !== "all" && <span> · {categoryLabel}</span>}
                </p>

                {/* Event grid — up to 4 columns */}
                {list.length > 0 ? (
                    <div className="mt-5 grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {list.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                ) : (
                    <div className="mt-16 flex flex-col items-center gap-2 text-center">
                        <p className="text-md font-semibold text-primary">No events match your filters</p>
                        <p className="text-sm text-tertiary">Try clearing a filter to see more.</p>
                    </div>
                )}
            </main>
            <SiteFooter club={SAGAMORE_CLUB} />
        </div>
    );
};

export const Default: Story = {
    name: "Browse Events",
    render: () => <EventsAllScreen />,
};
