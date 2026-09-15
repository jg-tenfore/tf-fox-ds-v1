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

/* ---- Sign-up rules: age, gender, questions, multi-buy ---------------- */

/** Fox parity: a per-session clinic with an age range, a gender limit, questions and "Buy 3, get 50% off". */
export const ClinicPerSession: Story = {
    name: "Clinics — Per-session (Girls Golf), no sessions chosen",
    render: () => <ClinicDetailScreen clinicId="girls-golf-needwood" />,
};

export const ClinicPerSessionNudge: Story = {
    name: "Clinics — Per-session, 2 chosen (1 more for 50% off)",
    render: () => <ClinicDetailScreen clinicId="girls-golf-needwood" initialSessions={[0, 2]} />,
};

export const ClinicPerSessionDiscount: Story = {
    name: "Clinics — Per-session, 3 chosen (discount applied)",
    render: () => <ClinicDetailScreen clinicId="girls-golf-needwood" initialSessions={[0, 2, 3]} />,
};

export const ClinicRegistrationSheet: Story = {
    name: "Clinics — Registration, questions to answer",
    render: () => <ClinicDetailScreen clinicId="first-tee-summer-northwest" initialRegistration={{ places: 2 }} />,
};

export const ClinicRegistrationBlocked: Story = {
    name: "Clinics — Registration, golfer blocked by age and gender",
    render: () => (
        <ClinicDetailScreen
            clinicId="girls-golf-needwood"
            initialSessions={[0, 2, 3]}
            initialRegistration={{
                places: 2,
                people: [
                    { first: "Casey", last: "Girard", birthDate: "2015-03-02", gender: "female", answers: { shirt: "Youth M" } },
                    { first: "Sam", last: "Okafor", birthDate: "2008-01-08", gender: "male", answers: {} },
                ],
            }}
        />
    ),
};
