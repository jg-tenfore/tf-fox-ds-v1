import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { ArrowLeft, Calendar, CheckCircle, Clock, Dotpoints01, MarkerPin01, Minus, Package, Plus } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { type Clinic, CLINICS, FOCUS_UI, LEVEL_COLOR } from "@/components/events/clinics-catalog";
import { cx } from "@/utils/cx";
import { money, StarRating } from "./store-ui";
import { SAGAMORE_CLUB, SiteFooter, TopNav } from "./tenfore-chrome";

/**
 * "Tenfore Fox / Clinics / Clinic Details" — a single clinic modeled on the event
 * details page, with clinic-specific sections: instructor bio, what you'll learn,
 * skill level & prerequisites, and what to bring / what's provided.
 */
const meta: Meta = { title: "Global Nav/Clinics/Clinic Details", parameters: { layout: "fullscreen" } };
export default meta;
type Story = StoryObj;

const SectionTitle = ({ children }: { children: React.ReactNode }) => <h2 className="text-lg font-semibold text-primary">{children}</h2>;

const ClinicDetail = ({ clinic }: { clinic: Clinic }) => {
    const f = FOCUS_UI[clinic.focus];
    const soldOut = clinic.spotsLeft === 0;
    const maxQty = Math.min(clinic.spotsLeft || 0, 6);
    const [qty, setQty] = useState(1);
    const related = CLINICS.filter((c) => c.id !== clinic.id && c.focus === clinic.focus).slice(0, 3);

    return (
        <div className="flex min-h-dvh flex-col bg-secondary">
            <TopNav active="Clinics" club={SAGAMORE_CLUB} accountLabel="Justin G." />
            <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
                <button type="button" className="mb-5 flex items-center gap-1.5 text-sm font-semibold text-tertiary transition duration-100 ease-linear hover:text-secondary">
                    <ArrowLeft className="size-4" aria-hidden="true" /> All clinics
                </button>

                <div className="relative aspect-[5/2] w-full overflow-hidden rounded-3xl bg-secondary_subtle ring-1 ring-secondary ring-inset">
                    <img src={clinic.image} alt={clinic.title} className="size-full object-cover" />
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-2.5">
                    <span className={cx("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold", f.bg, f.fg)}>{clinic.focus}</span>
                    <Badge color={LEVEL_COLOR[clinic.level]} size="sm" type="pill-color">
                        {clinic.level}
                    </Badge>
                    {clinic.series && <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary">{clinic.series}</span>}
                </div>
                <h1 className="mt-3 max-w-3xl text-display-sm font-semibold text-primary">{clinic.title}</h1>
                <p className="mt-2 text-md font-semibold text-brand-secondary">with {clinic.host}</p>
                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-tertiary">
                    <span className="flex items-center gap-1.5">
                        <Calendar className="size-4 text-fg-quaternary" aria-hidden="true" />
                        {clinic.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Clock className="size-4 text-fg-quaternary" aria-hidden="true" />
                        {clinic.time}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <MarkerPin01 className="size-4 text-fg-quaternary" aria-hidden="true" />
                        {clinic.location}
                    </span>
                    <StarRating rating={clinic.rating} count={clinic.reviews} />
                </div>

                <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-8 lg:grid-cols-3">
                    <div className="flex flex-col gap-8 lg:col-span-2">
                        <section>
                            <SectionTitle>About this clinic</SectionTitle>
                            <p className="mt-3 text-md text-secondary">{clinic.description}</p>
                        </section>

                        <section>
                            <SectionTitle>What you'll learn</SectionTitle>
                            <ul className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                                {clinic.learn.map((item) => (
                                    <li key={item} className="flex items-start gap-2.5">
                                        <CheckCircle className="mt-0.5 size-5 shrink-0 text-fg-brand-primary" aria-hidden="true" />
                                        <span className="text-sm text-secondary">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="border-t border-secondary pt-8">
                            <SectionTitle>Skill level & who it's for</SectionTitle>
                            <div className="mt-3 flex items-center gap-2">
                                <Badge color={LEVEL_COLOR[clinic.level]} size="md" type="pill-color">
                                    {clinic.level}
                                </Badge>
                                {clinic.ageGroup && <span className="text-sm font-medium text-secondary">{clinic.ageGroup}</span>}
                            </div>
                            <p className="mt-2.5 text-sm text-tertiary">{clinic.prerequisites}</p>
                        </section>

                        <section className="border-t border-secondary pt-8">
                            <SectionTitle>What to bring</SectionTitle>
                            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-primary">
                                        <Dotpoints01 className="size-4 text-fg-quaternary" aria-hidden="true" /> Bring
                                    </p>
                                    <ul className="flex flex-col gap-1.5">
                                        {clinic.bring.map((b) => (
                                            <li key={b} className="text-sm text-tertiary">
                                                {b}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-primary">
                                        <Package className="size-4 text-fg-quaternary" aria-hidden="true" /> We provide
                                    </p>
                                    <ul className="flex flex-col gap-1.5">
                                        {clinic.provided.map((p) => (
                                            <li key={p} className="text-sm text-tertiary">
                                                {p}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section className="border-t border-secondary pt-8">
                            <SectionTitle>Your instructor</SectionTitle>
                            <div className="mt-4 flex items-start gap-4">
                                <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-brand-primary text-lg font-semibold text-brand-secondary ring-1 ring-secondary ring-inset">
                                    {clinic.instructorInitials}
                                </span>
                                <div>
                                    <p className="text-md font-semibold text-primary">{clinic.host}</p>
                                    <p className="mt-1 text-sm text-tertiary">{clinic.instructorBio}</p>
                                </div>
                            </div>
                        </section>

                        <section className="border-t border-secondary pt-8">
                            <SectionTitle>Where</SectionTitle>
                            <p className="mt-3 text-sm font-medium text-secondary">{SAGAMORE_CLUB.name}</p>
                            <p className="text-sm text-tertiary">{SAGAMORE_CLUB.addressLine}</p>
                            <p className="mt-1 text-sm text-tertiary">Meet at the {clinic.location}.</p>
                        </section>
                    </div>

                    {/* Sticky register card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6 rounded-2xl bg-primary p-5 shadow-lg ring-1 ring-secondary">
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-display-xs font-semibold text-primary tabular-nums">{money(clinic.price)}</span>
                                <span className="text-sm text-tertiary">{clinic.priceUnit}</span>
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-sm text-secondary">
                                <Calendar className="size-4 text-fg-quaternary" aria-hidden="true" />
                                {clinic.date} · {clinic.time}
                            </div>
                            <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-secondary p-3">
                                <div>
                                    <p className="text-sm font-semibold text-primary">Spots</p>
                                    <p className={cx("text-xs tabular-nums", clinic.spotsLeft <= 6 && clinic.spotsLeft > 0 ? "text-warning-primary" : "text-tertiary")}>
                                        {soldOut ? "Sold out" : `${clinic.spotsLeft} of ${clinic.capacity} left`}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button type="button" aria-label="Decrease" disabled={qty <= 1 || soldOut} onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex size-8 items-center justify-center rounded-full ring-1 ring-secondary transition duration-100 ease-linear ring-inset hover:bg-primary_hover disabled:opacity-50">
                                        <Minus className="size-4 text-fg-secondary" aria-hidden="true" />
                                    </button>
                                    <span className="w-5 text-center text-sm font-semibold text-primary tabular-nums">{qty}</span>
                                    <button type="button" aria-label="Increase" disabled={qty >= maxQty || soldOut} onClick={() => setQty((q) => Math.min(maxQty, q + 1))} className="flex size-8 items-center justify-center rounded-full ring-1 ring-secondary transition duration-100 ease-linear ring-inset hover:bg-primary_hover disabled:opacity-50">
                                        <Plus className="size-4 text-fg-secondary" aria-hidden="true" />
                                    </button>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between border-t border-secondary pt-4 text-sm">
                                <span className="text-tertiary">
                                    {money(clinic.price)} × {qty}
                                </span>
                                <span className="font-semibold text-primary tabular-nums">{money(clinic.price * qty)}</span>
                            </div>
                            <Button size="lg" color="primary" className="mt-4 w-full" isDisabled={soldOut}>
                                {soldOut ? "Sold out" : "Reserve your spot"}
                            </Button>
                            <p className="mt-2.5 text-center text-xs text-tertiary">Free cancellation up to 48 hours before</p>
                        </div>
                    </div>
                </div>

                {related.length > 0 && (
                    <section className="mt-14 border-t border-secondary pt-8">
                        <SectionTitle>More {clinic.focus.toLowerCase()} clinics</SectionTitle>
                        <div className="mt-5 flex flex-col gap-3">
                            {related.map((c) => (
                                <button key={c.id} type="button" className={cx("flex items-center gap-4 rounded-xl border-l-4 bg-primary px-4 py-3.5 text-left ring-1 ring-secondary transition duration-100 ease-linear ring-inset hover:bg-primary_hover", FOCUS_UI[c.focus].border)}>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-primary">{c.title}</p>
                                        <p className="truncate text-sm text-tertiary">
                                            {c.date} · {c.time} · with {c.host}
                                        </p>
                                    </div>
                                    <Badge color={LEVEL_COLOR[c.level]} size="sm" type="pill-color">
                                        {c.level}
                                    </Badge>
                                </button>
                            ))}
                        </div>
                    </section>
                )}
            </main>
            <SiteFooter club={SAGAMORE_CLUB} />
        </div>
    );
};

const byId = (id: string) => CLINICS.find((c) => c.id === id)!;

export const Default: Story = { name: "Clinic Details", render: () => <ClinicDetail clinic={byId("clinic-short-game")} /> };
export const Junior: Story = { name: "Clinic Details · Junior", render: () => <ClinicDetail clinic={byId("clinic-junior-academy")} /> };
export const Playing: Story = { name: "Clinic Details · Playing Lesson", render: () => <ClinicDetail clinic={byId("clinic-playing-lessons")} /> };
