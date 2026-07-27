import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ReactNode } from "react";
import { mcgCourses, mcgLogo, mcgPhotography } from "@/components/foundations/mcg/mcg-assets";

/**
 * Montgomery County Golf (MCG) brand assets — the group logo, each course's
 * brand logo, and course photography. Auto-served from `images/mcg/` via the
 * `mcg-images` staticDirs mapping; reuse across stories and screens via the
 * `mcgCourses` / `mcgLogo` / `mcgPhotography` exports.
 *
 * MCG runs a portfolio of public courses across Montgomery County, MD.
 * https://www.mcggolf.com/courses/all-mcg-golf-courses
 */
const meta = {
    title: "Foundations/Golf Courses/MCG",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const Page = ({ children }: { children: ReactNode }) => <div className="space-y-8 bg-primary p-8 text-primary">{children}</div>;

const SectionHeading = ({ title, count }: { title: string; count: number }) => (
    <div className="flex items-baseline justify-between border-b border-border-secondary pb-3">
        <h2 className="text-lg font-semibold text-primary">{title}</h2>
        <span className="text-xs text-tertiary tabular-nums">
            {count} item{count === 1 ? "" : "s"}
        </span>
    </div>
);

/** The MCG group logo on light and dark surfaces. */
export const GroupLogo: Story = {
    render: () => (
        <Page>
            <SectionHeading title="Montgomery County Golf — group logo" count={1} />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-3">
                    <div className="flex items-center justify-center rounded-xl bg-primary p-12 ring-1 ring-border-secondary">
                        <img src={mcgLogo} alt="Montgomery County Golf" className="h-20 w-auto" />
                    </div>
                    <p className="text-xs text-tertiary">On bg-primary</p>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center justify-center rounded-xl bg-primary-solid p-12 ring-1 ring-border-secondary">
                        <img src={mcgLogo} alt="Montgomery County Golf" className="h-20 w-auto" />
                    </div>
                    <p className="text-xs text-tertiary">On bg-primary-solid</p>
                </div>
            </div>
        </Page>
    ),
};

/** Every MCG course's brand logo, with name + location. */
export const CourseLogos: Story = {
    render: () => (
        <Page>
            <SectionHeading title="MCG courses" count={mcgCourses.length} />
            <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
                {mcgCourses.map((course) => (
                    <figure key={course.slug} className="space-y-3">
                        <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl bg-primary p-8 ring-1 ring-border-secondary">
                            <img src={course.logo} alt={`${course.name} logo`} className="max-h-full max-w-full object-contain" loading="lazy" />
                        </div>
                        <figcaption>
                            <p className="text-sm font-semibold text-primary">{course.name}</p>
                            <p className="text-xs text-tertiary">{course.location}</p>
                            <p className="mt-1 font-mono text-[11px] text-quaternary" title={course.logo}>
                                {course.logo}
                            </p>
                        </figcaption>
                    </figure>
                ))}
            </div>
        </Page>
    ),
};

/** Course photography available in the asset set. */
export const Photography: Story = {
    render: () => (
        <Page>
            <SectionHeading title="Course photography" count={mcgPhotography.length} />
            <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
                {mcgPhotography.map((photo) => (
                    <figure key={photo.src} className="space-y-2">
                        <div className="aspect-[3/2] overflow-hidden rounded-xl bg-secondary ring-1 ring-border-secondary">
                            <img src={photo.src} alt={photo.name} className="size-full object-cover" loading="lazy" />
                        </div>
                        <figcaption className="text-xs text-tertiary">
                            <span className="font-medium text-secondary">{photo.course}</span> · {photo.name}
                        </figcaption>
                    </figure>
                ))}
            </div>
        </Page>
    ),
};
