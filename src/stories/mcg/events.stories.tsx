import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ClinicDetailScreen } from "@/components/mcg/events/clinic-detail";
import { ClinicsBrowseScreen } from "@/components/mcg/events/clinics-browse";
import { CountyCalendarScreen } from "@/components/mcg/events/county-calendar";
import { EventDetailScreen } from "@/components/mcg/events/event-detail";
import { EventsBrowseScreen } from "@/components/mcg/events/events-browse";

/**
 * "MCG Prototype / Events & Clinics" — the county programming section of the MCG
 * prototype: `/events`, `/events/[id]`, `/calendar`, `/clinics` and `/clinics/[id]`.
 *
 * Every story renders the exact component the Next route renders. The route files
 * under `src/app` are thin wrappers around these same screens, so what you see here
 * and what the prototype serves can never drift.
 *
 * Outside the prototype there is no `SessionProvider`, so `useSession` falls back to
 * an inert session — Register and Enrol are clickable and do nothing, which is the
 * right behaviour for a story.
 */
const meta: Meta = {
    title: "MCG Prototype/Events & Clinics",
    parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

/* ---- Events ------------------------------------------------------- */

export const BrowseEvents: Story = {
    name: "Events — Browse",
    render: () => <EventsBrowseScreen />,
};

export const EventDetail: Story = {
    name: "Events — Detail (County Amateur)",
    render: () => <EventDetailScreen eventId="county-amateur-crossvines" />,
};

export const EventDetailWaitlist: Story = {
    name: "Events — Detail, full (Nine & Wine)",
    render: () => <EventDetailScreen eventId="couples-9-wine-crossvines" />,
};

export const EventDetailFree: Story = {
    name: "Events — Detail, free (Demo Day)",
    render: () => <EventDetailScreen eventId="demo-day-needwood" />,
};

/* ---- Calendar ----------------------------------------------------- */

export const CalendarMonth: Story = {
    name: "Calendar — Month view",
    render: () => <CountyCalendarScreen initialView="calendar" />,
};

export const CalendarList: Story = {
    name: "Calendar — List view",
    render: () => <CountyCalendarScreen initialView="list" />,
};

/* ---- Clinics ------------------------------------------------------ */

export const BrowseClinics: Story = {
    name: "Clinics — Browse",
    render: () => <ClinicsBrowseScreen />,
};

export const ClinicDetail: Story = {
    name: "Clinics — Detail (Get Golf Ready)",
    render: () => <ClinicDetailScreen clinicId="ggr-northwest" />,
};

export const ClinicDetailJunior: Story = {
    name: "Clinics — Detail, junior (First Tee)",
    render: () => <ClinicDetailScreen clinicId="first-tee-summer-northwest" />,
};

export const ClinicDetailWaitlist: Story = {
    name: "Clinics — Detail, full (League Ready)",
    render: () => <ClinicDetailScreen clinicId="league-ready-crossvines" />,
};
