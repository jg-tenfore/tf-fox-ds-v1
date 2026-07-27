/**
 * Montgomery County Golf (MCG) brand assets — the group logo, each course's
 * brand logo, and available course photography. Served at stable URLs via the
 * `mcg-images` staticDirs mapping in `.storybook/main.ts` (never bundled).
 *
 * MCG operates a portfolio of public golf courses across Montgomery County, MD.
 * https://www.mcggolf.com/courses/all-mcg-golf-courses
 */

/** Public base path — must match the `staticDirs` mapping in .storybook/main.ts. */
const MCG_BASE = "mcg-images";

export interface McgCourse {
    /** Display name, e.g. "Falls Road". */
    name: string;
    /** kebab-case slug, e.g. "falls-road". */
    slug: string;
    /** Course brand-logo URL — drop straight into an <img src>. */
    logo: string;
    /** City / town in Montgomery County, MD. */
    location: string;
    /** Optional course photography, when available. */
    photos?: { name: string; src: string }[];
}

/** The MCG group logo (the "MCG" wordmark). */
export const mcgLogo = `${MCG_BASE}/mcg-logo.gif`;

/** Every MCG course, with its brand logo (and photography where we have it). */
export const mcgCourses: McgCourse[] = [
    { name: "Falls Road", slug: "falls-road", logo: `${MCG_BASE}/falls-road-logo.png`, location: "Potomac, MD" },
    {
        name: "Northwest",
        slug: "northwest",
        logo: `${MCG_BASE}/northwest-logo.png`,
        location: "Silver Spring, MD",
        photos: [{ name: "Northwest — #9 green", src: `${MCG_BASE}/northwest-9-green.jpg` }],
    },
    { name: "Hampshire Greens", slug: "hampshire-greens", logo: `${MCG_BASE}/hampshire-greens-logo.png`, location: "Silver Spring, MD" },
    {
        name: "Laytonsville",
        slug: "laytonsville",
        logo: `${MCG_BASE}/laytonsville-logo.png`,
        location: "Laytonsville, MD",
        photos: [{ name: "Laytonsville — #6", src: `${MCG_BASE}/laytonsville-6.jpg` }],
    },
    { name: "Little Bennett", slug: "little-bennett", logo: `${MCG_BASE}/little-bennett-logo.png`, location: "Clarksburg, MD" },
    { name: "Needwood", slug: "needwood", logo: `${MCG_BASE}/needwood-logo.png`, location: "Derwood, MD" },
    { name: "The Crossvines Golf", slug: "crossvines", logo: `${MCG_BASE}/crossvines-logo.png`, location: "Poolesville, MD" },
];

/** Flat list of all MCG course photography, for galleries / heroes. */
export const mcgPhotography: { name: string; src: string; course: string }[] = mcgCourses.flatMap((course) =>
    (course.photos ?? []).map((photo) => ({ ...photo, course: course.name })),
);

/** Look up a single course by slug. */
export const mcgCourse = (slug: string): McgCourse | undefined => mcgCourses.find((course) => course.slug === slug);
