import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ClinicDetailScreen } from "@/components/mcg-3/events/clinic-detail";

/**
 * "MCG Prototype 3 / Programs" — the formats MCG asked for beyond private lessons and
 * group clinics. Junior league, Op 36 and junior camps are **sample programs**: MCG
 * doesn't run them today, and each page says so.
 */
const meta: Meta = {
    title: "MCG Prototype 3/Programs",
    parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

export const JuniorLeague: Story = {
    name: "Junior league (sample)",
    render: () => <ClinicDetailScreen clinicId="junior-league-northwest" />,
};

export const Op36: Story = {
    name: "Op 36 (sample)",
    render: () => <ClinicDetailScreen clinicId="op36-little-bennett" />,
};

export const JuniorCamp: Story = {
    name: "Junior camp (sample)",
    render: () => <ClinicDetailScreen clinicId="junior-camp-needwood" />,
};

export const PerSessionClinic: Story = {
    name: "Group clinic — per-session with Buy 3",
    render: () => <ClinicDetailScreen clinicId="girls-golf-needwood" initialSessions={[0, 2, 3]} />,
};
