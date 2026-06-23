import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ReactNode } from "react";
import { kettleHillsAssets, kettleHillsImagesByCategory } from "@/components/foundations/kettle-hills/kettle-hills-assets";
import { KettleHillsLogo } from "@/components/foundations/kettle-hills/kettle-hills-logo";

/**
 * Kettle Hills Golf Course brand imagery — auto-indexed from `images/kettleHills/`.
 * Drop new images into that folder and they appear here automatically, ready to
 * reuse across stories and screens via `kettleHillsAssets` / `KettleHillsLogo`.
 *
 * https://kettlehills.com/ · https://maps.app.goo.gl/vo74MPfZGDgksoeC8
 */
const meta = {
    title: "Foundations/Golf Courses/Kettle Hills",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const Page = ({ children }: { children: ReactNode }) => <div className="space-y-8 bg-primary p-8 text-primary">{children}</div>;

const SectionHeading = ({ title, count }: { title: string; count: number }) => (
    <div className="flex items-baseline justify-between border-b border-border-secondary pb-3">
        <h2 className="text-lg font-semibold text-primary">{title}</h2>
        <span className="text-xs text-tertiary tabular-nums">
            {count} image{count === 1 ? "" : "s"}
        </span>
    </div>
);

const ImageGrid = ({ assets }: { assets: { name: string; src: string }[] }) => (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
        {assets.map((asset) => (
            <figure key={asset.name} className="space-y-2">
                <div className="aspect-[4/3] overflow-hidden rounded-xl bg-secondary ring-1 ring-border-secondary">
                    <img src={asset.src} alt={asset.name} className="size-full object-cover" loading="lazy" />
                </div>
                <figcaption className="truncate font-mono text-xs text-tertiary" title={asset.name}>
                    {asset.name}
                </figcaption>
            </figure>
        ))}
    </div>
);

/** The golf course logo on its own — light and dark surfaces. */
export const Logo: Story = {
    render: () => (
        <Page>
            <SectionHeading title="Kettle Hills Golf Course — logo" count={1} />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-3">
                    <div className="flex items-center justify-center rounded-xl bg-primary p-12 ring-1 ring-border-secondary">
                        <KettleHillsLogo className="h-24 w-auto" />
                    </div>
                    <p className="text-xs text-tertiary">On bg-primary</p>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center justify-center rounded-xl bg-primary-solid p-12 ring-1 ring-border-secondary">
                        <KettleHillsLogo className="h-24 w-auto" />
                    </div>
                    <p className="text-xs text-tertiary">On bg-primary-solid</p>
                </div>
            </div>
            <div className="flex flex-wrap items-end gap-6">
                <KettleHillsLogo className="h-10 w-auto" />
                <KettleHillsLogo className="h-16 w-auto" />
                <KettleHillsLogo className="h-24 w-auto" />
            </div>
        </Page>
    ),
};

/** Every indexed Kettle Hills image, for reference and reuse. */
export const AllImages: Story = {
    render: () => (
        <Page>
            <SectionHeading title="All Kettle Hills imagery" count={kettleHillsAssets.length} />
            <ImageGrid assets={kettleHillsAssets} />
        </Page>
    ),
};

/** Course and clubhouse photography. */
export const Photography: Story = {
    render: () => {
        const assets = kettleHillsImagesByCategory("photography");
        return (
            <Page>
                <SectionHeading title="Photography" count={assets.length} />
                <ImageGrid assets={assets} />
            </Page>
        );
    },
};
