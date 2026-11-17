import type { Preview } from "@storybook/nextjs-vite";

// Load the full Untitled UI + Tailwind v4 pipeline (theme.css carries the
// monochromatic Sagamore palette) so every story renders on-brand.
import "../src/styles/globals.css";

const preview: Preview = {
    parameters: {
        layout: "centered",
        // The MCG Prototype stories render the very same components the Next routes
        // do, so they call useRouter / usePathname. Mounting the App Router mock
        // globally means a shared screen works in a story without a per-story opt-in.
        nextjs: { appDirectory: true },
        options: {
            // The sidebar has six folders, in this order:
            //   Start Here    – what Fox is, the style guide, process & roadmap, how to review.
            //   Prototypes    – the clickable product, newest first: MCG Prototype 3 (the hybrid),
            //                   MCG Prototype 1 (the screens Prototype 2 was copied from), the
            //                   Instruction flows, and the earlier Sagamore/club golfer web.
            //   Design System – styles, components, account login and the per-club themes.
            //   Reviews       – one folder per review round, newest first, each opening on a Summary.
            //   Research      – concept mashups (GolfNow, Google, SevenRooms) and color theory.
            //   Archive       – superseded work, kept for reference (collapsed; see manager.ts).
            // Every story keeps its pre-regroup id (each file sets `id`), so shared links still open.
            // Moved MDX docs pages are redirected by static/legacy-redirects.js.
            storySort: {
                method: "alphabetical",
                order: [
                    "Start Here",
                    ["Overview", "Style guide", "Process & roadmap", "How to review"],
                    "Prototypes",
                    [
                        "Screen index",
                        "MCG Prototype 3",
                        ["Instruction", "Programs"],
                        "MCG Prototype 1",
                        [
                            "Home",
                            "Tee Times",
                            "Shop",
                            "Events & Clinics",
                            "Academy",
                            "Instructor Profile",
                            "Lesson Booking",
                            "Lesson Review",
                            "Grill",
                            "Account",
                        ],
                        "Instruction",
                        ["Book a Lesson", "Packages & Credits", "Elements", "*Model Comparison*"],
                        "Golfer web · Sagamore & clubs",
                        [
                            "Global Nav",
                            ["Tee Times", "Pro Shop", "Events", "Calendar", "Clinics", "Restaurant"],
                            "Tee Time Checkout",
                            ["Tee Time Details", "Confirmation - Tee Time"],
                            "Shop Checkout",
                            "Profile ∕ Account",
                            ["*Architecture*", "Overview", "My Account", "Activity", "Wallet", "Golf Buddies", "Events", "Memberships"],
                        ],
                    ],
                    "Design System",
                    [
                        "Styles",
                        ["Colors", "Typography", "Icons", "Logos", "Effect Styles", "Radius", "Border", "Spacing", "Golf Courses"],
                        "Components",
                        ["Actions", "Forms", "Feedback & Status", "Layout & Structure", "Media & Visuals", "Navigation", "Booking"],
                        "Account Login",
                        ["Sign up", "Log in", "Forgot password", "Verification"],
                        "Club Themes",
                        ["Overview", "Colorways", "Kettle Hills", "Sagamore", "FloGolf Indoor"],
                    ],
                    "Reviews",
                    // Newest round first: list each dated round here as it's added.
                    ["Sep 23 – MCG Prototype 3", "Sep 15 – MCG Prototype 2", "Sep 15 – Austin's Academy feedback", "Sep 11 – MCG Prototype 1", "*"],
                    "Research",
                    ["Explorations", "Color Theory", ["Analogous", "Complementary", "Triadic"]],
                    "Archive",
                    ["About the archive", "MCG Courses tee sheet (July)", "Early booking pages (June)", "*"],
                    "*",
                ],
            },
        },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        a11y: {
            // 'todo' - show a11y violations in the test UI only
            // 'error' - fail CI on a11y violations
            // 'off' - skip a11y checks entirely
            test: "todo",
        },
        backgrounds: {
            options: {
                paper: { name: "Paper", value: "#ffffff" },
                canvas: { name: "Canvas", value: "#fafafa" },
                ink: { name: "Ink", value: "#161616" },
            },
        },
    },
    initialGlobals: {
        backgrounds: { value: "paper" },
    },
    decorators: [
        (Story) => (
            <div className="font-body text-primary antialiased">
                <Story />
            </div>
        ),
    ],
};

export default preview;
