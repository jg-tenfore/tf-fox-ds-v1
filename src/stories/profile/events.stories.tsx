import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { ArrowRight, Calendar, Clock, MarkerPin01, XClose } from "@untitledui/icons";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { GOLF_EVENTS, type GolfEvent } from "@/components/events/events-catalog";
import { cx } from "@/utils/cx";
import { EventCard } from "../explorations/events-ui";
import { CONCEPT_UI } from "../explorations/events-ui";
import { money } from "../explorations/store-ui";
import { Panel, StatusBadge } from "./profile-ui";
import { ProfileShell } from "./profile-shell";

/**
 * "Profile / Events" — the member's registrations plus recommended events. Tapping
 * any event opens a compact info modal (a lightweight version of the event details
 * page) so members can peek without leaving the profile.
 */
const meta: Meta = { title: "Profile/Events", parameters: { layout: "fullscreen" } };
export default meta;
type Story = StoryObj;

const byId = (id: string) => GOLF_EVENTS.find((e) => e.id === id)!;
const REGISTERED = ["clinic-short-game", "league-9-and-dine", "scramble-summer-kickoff"].map(byId);
const RECOMMENDED = ["charity-pink-out", "league-glow-ball", "scramble-member-guest"].map(byId);
const REGISTERED_IDS = new Set(REGISTERED.map((e) => e.id));

/** Compact event info shown inside the modal. */
const EventInfoModal = ({ event, onClose }: { event: GolfEvent; onClose: () => void }) => {
    const cs = CONCEPT_UI[event.concept];
    const registered = REGISTERED_IDS.has(event.id);
    return (
        <>
            <div className="relative aspect-[2/1] w-full overflow-hidden">
                <img src={event.image} alt={event.title} className="size-full object-cover" />
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition duration-100 ease-linear hover:bg-black/55"
                >
                    <XClose className="size-4" aria-hidden="true" />
                </button>
            </div>
            <div className="p-5">
                <div className="flex items-center gap-2">
                    <span className={cx("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", cs.bg, cs.fg)}>
                        <cs.Icon className="size-3.5" aria-hidden="true" />
                        {cs.label}
                    </span>
                    {registered && <StatusBadge status="Upcoming" />}
                </div>
                <h2 className="mt-3 text-lg font-semibold text-primary">{event.title}</h2>
                <p className="mt-0.5 text-sm font-semibold text-brand-secondary">{event.presenter}</p>
                <div className="mt-3 flex flex-col gap-1.5 text-sm text-tertiary">
                    <span className="flex items-center gap-2">
                        <Calendar className="size-4 text-fg-quaternary" aria-hidden="true" />
                        {event.date}
                    </span>
                    <span className="flex items-center gap-2">
                        <Clock className="size-4 text-fg-quaternary" aria-hidden="true" />
                        {event.time}
                    </span>
                    <span className="flex items-center gap-2">
                        <MarkerPin01 className="size-4 text-fg-quaternary" aria-hidden="true" />
                        {event.location}
                    </span>
                </div>
                <p className="mt-3 line-clamp-3 text-sm text-secondary">{event.description}</p>

                <div className="mt-5 flex items-center justify-between gap-3 border-t border-secondary pt-4">
                    <p className="text-sm">
                        <span className="font-semibold text-primary tabular-nums">{money(event.price)}</span>{" "}
                        <span className="text-tertiary">{event.priceUnit}</span>
                    </p>
                    <div className="flex gap-2">
                        <Button color="secondary" size="sm">
                            Full details
                        </Button>
                        <Button color="primary" size="sm">
                            {registered ? "Manage" : "Register"}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

const EventsScreen = () => {
    const [open, setOpen] = useState<GolfEvent | null>(null);

    return (
        <ProfileShell active="events">
            <div className="flex flex-col gap-10">
                <div>
                    <h2 className="text-display-sm font-semibold text-primary">Your events</h2>
                    <p className="mt-1.5 text-md text-tertiary">Manage your registrations and discover what's coming up at the club.</p>
                </div>

                <Panel title="Registered" action={<Button color="link-color" size="sm" iconTrailing={ArrowRight} href="#">Browse all events</Button>}>
                    <div className="divide-y divide-secondary">
                        {REGISTERED.map((e) => (
                            <div key={e.id} className="flex items-center gap-4 py-4">
                                <button type="button" onClick={() => setOpen(e)} className="hidden size-14 shrink-0 overflow-hidden rounded-lg ring-1 ring-secondary ring-inset sm:block">
                                    <img src={e.image} alt="" className="size-full object-cover" />
                                </button>
                                <button type="button" onClick={() => setOpen(e)} className="min-w-0 flex-1 text-left">
                                    <p className="truncate text-sm font-semibold text-primary">{e.title}</p>
                                    <p className="truncate text-sm text-tertiary">
                                        {e.date} · {e.time} · {e.location}
                                    </p>
                                </button>
                                <StatusBadge status="Upcoming" />
                                <Button color="secondary" size="sm" onClick={() => setOpen(e)}>
                                    View
                                </Button>
                            </div>
                        ))}
                    </div>
                </Panel>

                <section>
                    <h3 className="mb-4 text-display-xs font-semibold text-primary">Recommended for you</h3>
                    <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                        {RECOMMENDED.map((e) => (
                            <EventCard key={e.id} event={e} onOpen={() => setOpen(e)} />
                        ))}
                    </div>
                </section>
            </div>

            <ModalOverlay isOpen={open != null} onOpenChange={(o) => !o && setOpen(null)}>
                <Modal className="max-w-md">
                    <Dialog className="overflow-hidden rounded-2xl bg-primary shadow-xl ring-1 ring-secondary_alt">
                        {open && <EventInfoModal event={open} onClose={() => setOpen(null)} />}
                    </Dialog>
                </Modal>
            </ModalOverlay>
        </ProfileShell>
    );
};

export const Default: Story = { name: "Events", render: () => <EventsScreen /> };
