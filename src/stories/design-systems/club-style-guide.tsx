import { Fragment, type ReactNode, useState } from "react";
import { ShieldTick } from "@untitledui/icons";
import { BadgeWithIcon } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { clubBrandStyle, type Club, DropdownCell, MenuRow, SiteFooter, TopNav } from "../explorations/tenfore-chrome";
import { CalendarPanel, DEFAULT_DATE, fmtNice } from "../explorations/tee-search-popovers";
import { AA_NORMAL } from "./contrast";

/**
 * Reusable club style guide — a top-down catalog of the booking components in a
 * single club's colorway. The whole page is wrapped in that club's brand override
 * (`clubBrandStyle`), so every brand-derived token renders in the club's nav color.
 */

export interface MenuRowDef {
    value: string;
    label: string;
    /** Optional right-aligned text (e.g. a price). */
    right?: string;
}
export interface MenuSection {
    /** Optional grey uppercase section header. */
    header?: string;
    rows: MenuRowDef[];
}

export interface GuideConfig {
    club: Club;
    /** Display name + value for the colorway swatch. */
    accentName: string;
    accentValue: string;
    /** Closed selector-bar cells (label + value). */
    selectorCells: { label: string; value: string }[];
    /** Single-select dropdown contents. */
    menuTitle: string;
    menuSections: MenuSection[];
    menuDefault: string;
    /** Club-specific card examples. */
    cards: ReactNode;
    /** Show prices in the calendar (false for the simulator). */
    calendarPrices?: boolean;
    /** Optional multi-color palette strip (role + swatch + token), for combo guides. */
    palette?: { role: string; color: string; label: string }[];
    /** Optional sub-line under the title (e.g. the color-theory relationship). */
    subtitle?: string;
    /** Worst-case contrast ratio of brand surfaces vs white; renders an AA badge. */
    contrastRatio?: number;
}

/** A documentation row — component name, note, and the rendered example(s). */
const Section = ({ title, note, children }: { title: string; note: string; children: ReactNode }) => (
    <section className="border-t border-secondary py-10 first:border-t-0 first:pt-0">
        <h2 className="text-lg font-semibold text-primary">{title}</h2>
        <p className="mt-1 max-w-xl text-sm text-tertiary">{note}</p>
        <div className="mt-5">{children}</div>
    </section>
);

/** A labeled example slot — wraps a rendered component with its state name. */
export const Eg = ({ state, children }: { state: string; children: ReactNode }) => (
    <div className="flex flex-col gap-2">
        {children}
        <span className="text-xs font-medium tracking-wide text-quaternary uppercase">{state}</span>
    </div>
);

const Menu = ({ title, sections, defaultValue }: { title: string; sections: MenuSection[]; defaultValue: string }) => {
    const [value, setValue] = useState(defaultValue);
    return (
        <div className="w-64 rounded-2xl bg-primary p-4 shadow-lg ring-1 ring-secondary">
            <p className="mb-3 text-sm font-semibold text-primary">{title}</p>
            <div className="flex flex-col gap-0.5">
                {sections.map((section, i) => (
                    <Fragment key={i}>
                        {i > 0 && <div role="separator" className="-mx-4 mt-1 border-t border-secondary" />}
                        {section.header && <p className="px-3 pt-3 pb-1 text-xs font-semibold tracking-wide text-quaternary uppercase">{section.header}</p>}
                        {section.rows.map((row) => (
                            <MenuRow
                                key={row.value}
                                selected={value === row.value}
                                onClick={() => setValue(row.value)}
                                label={row.label}
                                right={row.right ? <span className="font-normal text-tertiary tabular-nums">{row.right}</span> : undefined}
                            />
                        ))}
                    </Fragment>
                ))}
            </div>
        </div>
    );
};

const CalendarCard = ({ prices }: { prices: boolean }) => {
    const [selected, setSelected] = useState<Date>(DEFAULT_DATE);
    const [rateType, setRateType] = useState<"weekday" | "weekend">("weekday");
    return (
        <div className="inline-block rounded-2xl bg-primary p-4 shadow-lg ring-1 ring-secondary">
            <CalendarPanel selected={selected} onSelect={setSelected} rateType={rateType} onRateType={setRateType} onDone={() => {}} showPrices={prices} />
        </div>
    );
};

export const ClubStyleGuide = ({ config }: { config: GuideConfig }) => (
    <div className="min-h-dvh bg-secondary" style={clubBrandStyle(config.club.navColor)}>
        <div className="mx-auto max-w-3xl px-6 py-12">
            <header>
                <p className="text-xs font-semibold tracking-wide text-quaternary uppercase">Design System</p>
                <h1 className="mt-1 text-display-xs font-semibold text-primary">{config.club.name} — Booking components</h1>
                <p className="mt-2 text-md text-tertiary">{config.subtitle ?? "Every element from the booking page, in its colorway and styled states."}</p>
                {config.contrastRatio != null && (
                    <div className="mt-4 flex items-center gap-2">
                        <BadgeWithIcon color={config.contrastRatio >= AA_NORMAL ? "success" : "error"} size="md" iconLeading={ShieldTick}>
                            {config.contrastRatio >= AA_NORMAL ? "WCAG AA" : "Below AA"}
                        </BadgeWithIcon>
                        <span className="text-xs text-tertiary tabular-nums">
                            {config.contrastRatio.toFixed(2)}:1 min · white on brand surfaces
                        </span>
                    </div>
                )}
                {config.palette ? (
                    <div className="mt-5 flex flex-wrap gap-5">
                        {config.palette.map((swatch) => (
                            <div key={swatch.role} className="flex items-center gap-3">
                                <span className="size-10 rounded-lg ring-1 ring-secondary ring-inset" style={{ backgroundColor: swatch.color }} />
                                <div>
                                    <p className="text-xs font-medium tracking-wide text-quaternary uppercase">{swatch.role}</p>
                                    <p className="text-sm font-semibold text-primary">{swatch.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="mt-5 flex items-center gap-3">
                        <span className="size-10 rounded-lg ring-1 ring-secondary ring-inset" style={{ backgroundColor: config.club.navColor }} />
                        <div>
                            <p className="text-sm font-semibold text-primary">{config.accentName}</p>
                            <p className="text-xs text-tertiary tabular-nums">{config.accentValue}</p>
                        </div>
                    </div>
                )}
            </header>

            <div className="mt-10 flex flex-col">
                <Section title="Global navigation" note="The brand-colored top bar; the active tab carries an underline.">
                    <div className="overflow-hidden rounded-xl ring-1 ring-secondary">
                        <TopNav active="Tee Times" club={config.club} />
                    </div>
                </Section>

                <Section title="Selector cells" note="The booking bar — each cell shows an uppercase label, its value, and a chevron.">
                    <div className="flex flex-col divide-y divide-secondary rounded-xl bg-primary shadow-sm ring-1 ring-secondary sm:flex-row sm:divide-x sm:divide-y-0">
                        {config.selectorCells.map((cell, i) => {
                            const last = i === config.selectorCells.length - 1;
                            return (
                                <DropdownCell
                                    key={cell.label}
                                    label={cell.label}
                                    value={cell.value}
                                    open={false}
                                    onToggle={() => {}}
                                    onClose={() => {}}
                                    align={i === 0 ? "left" : last ? "right" : "center"}
                                    edge={i === 0 ? "left" : last ? "right" : undefined}
                                >
                                    <span />
                                </DropdownCell>
                            );
                        })}
                    </div>
                </Section>

                <Section title="Single-select menu" note="The dropdown contents — the selected row gets a colored check. Tap to move the selection.">
                    <Menu title={config.menuTitle} sections={config.menuSections} defaultValue={config.menuDefault} />
                </Section>

                <Section title="Date picker" note={config.calendarPrices === false ? "Calendar with prices hidden — today and the selected day render in the brand color." : "Best-rate prices, today, and the selected day all render in the brand color; struck dates are sold out."}>
                    <CalendarCard prices={config.calendarPrices ?? true} />
                </Section>

                <Section title="Slot cards" note="The cards golfers tap to book. Accents (banners, selected fills, hover rings) take the brand color.">
                    {config.cards}
                </Section>

                <Section title="Buttons" note="Primary and link styles inherit the brand color; secondary and tertiary stay neutral.">
                    <div className="flex flex-wrap items-center gap-3">
                        <Button color="primary">Reserve</Button>
                        <Button color="secondary">Secondary</Button>
                        <Button color="tertiary">Tertiary</Button>
                        <Button color="link-color">View details</Button>
                        <Button color="primary" isDisabled>
                            Disabled
                        </Button>
                    </div>
                </Section>

                <Section title="Footer" note="The dark site footer with club contact details.">
                    <div className="overflow-hidden rounded-xl ring-1 ring-secondary">
                        <SiteFooter club={config.club} />
                    </div>
                </Section>
            </div>
        </div>
    </div>
);

export { fmtNice, DEFAULT_DATE };
