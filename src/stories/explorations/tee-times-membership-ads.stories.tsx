import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MembershipAdBanners } from "./membership-ad-banners";
import { SAGAMORE_CLUB, SAGAMORE_NINES, TeeTimesScreen } from "./tenfore-chrome";

/**
 * "Global Nav / Tee Times / 18 Holes + Membership Ads" — a duplicate of the
 * Sagamore 18-hole tee sheet with the dismissible membership ad banners stacked
 * between the Course / Date / Players selector and the tee-time results.
 */
const meta: Meta = {
    title: "Global Nav/Tee Times/18 Holes + Membership Ads",
    parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
    name: "18 Holes + Membership Ads",
    render: () => <TeeTimesScreen club={SAGAMORE_CLUB} nines={SAGAMORE_NINES} banner={<div className="mb-6"><MembershipAdBanners /></div>} />,
};
