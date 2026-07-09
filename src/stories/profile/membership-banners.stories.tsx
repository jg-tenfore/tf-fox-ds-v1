import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AD_BANNERS, AdBanner } from "../explorations/membership-ad-banners";

/**
 * "Profile / Memberships / Ad Banners" — the same dismissible-banner experience as
 * the Tee Times banner, reused to advertise memberships. A stack of color variants
 * with alternate messaging, each independently dismissible.
 */
const meta: Meta = { title: "Profile ∕ Account/Memberships", parameters: { layout: "fullscreen" } };
export default meta;
type Story = StoryObj;

const AdBanners = () => (
    <div className="min-h-dvh bg-secondary">
        <div className="mx-auto max-w-3xl px-6 py-12">
            <header>
                <p className="text-xs font-semibold tracking-wide text-quaternary uppercase">Memberships · Ad banners</p>
                <h1 className="mt-1 text-display-xs font-semibold text-primary">Dismissible membership banners</h1>
                <p className="mt-2 max-w-xl text-md text-tertiary">The same dismissible-banner experience as Tee Times, reused to promote memberships — color variants with alternate messaging. Each dismisses independently.</p>
            </header>

            <div className="mt-8 flex flex-col gap-5">
                {AD_BANNERS.map((b) => (
                    <div key={b.label}>
                        <p className="mb-1.5 text-xs font-medium tracking-wide text-quaternary uppercase">{b.label}</p>
                        <AdBanner tone={b.tone} icon={b.icon} message={b.message} cta={b.cta} />
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export const AdBannersStory: Story = { name: "Ad Banners", render: () => <AdBanners /> };
