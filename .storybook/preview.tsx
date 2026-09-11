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
            storySort: {
                method: "alphabetical",
                order: [
                    "Introduction",
                    "Foundations",
                    "MCG Prototype",
                    ["Home", "Tee Times", "Shop", "Events & Clinics", "Grill", "Account"],
                    "Instruction",
                    "Components",
                    ["Actions", "Forms", "Feedback & Status", "Layout & Structure", "Media & Visuals", "Navigation"],
                    "Sign in ∕ Sign up",
                    "Profile ∕ Account",
                    ["*Architecture*", "Overview", "My Account", "Activity", "Wallet", "Golf Buddies", "Events", "Memberships"],
                    "Booking",
                    "Global Nav",
                    ["Tee Times", "Pro Shop", "Events", "Calendar", "Clinics", "Restaurant"],
                    "Shop Checkout",
                    "Tee Time Checkout",
                    ["Tee Time Details", "Confirmation - Tee Time"],
                    "Explorations",
                    "Design Systems",
                    ["Overview", "Colorways", "Color Theory", "Kettle Hills", "Sagamore", "FloGolf Indoor"],
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
