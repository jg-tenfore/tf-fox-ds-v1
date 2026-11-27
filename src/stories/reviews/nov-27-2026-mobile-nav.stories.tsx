import { type ReactNode, useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { McgHero, McgNav } from "@/components/mcg-3/mcg-chrome";
import { MobileNavDrawer, MobileNavFullScreen, type MobileNavProps, MobileNavSheet, type MobileNavUser } from "@/components/mcg-3/mobile-nav-options";
import { DEMO_USER, SessionProvider, useSession } from "@/components/mcg-3/session";

/**
 * Nov 27, 2026: MCG Prototype 3's header is crammed at phone width (utility bar, logo and
 * six sections wrapping over each other). Three ways to fold it into a hamburger menu,
 * each with a slim bar (logo, cart, menu), shown closed and open at 390 × 844.
 */

const PHONE_VIEWPORT = {
    options: { phone390: { name: "Phone (390 × 844)", styles: { width: "390px", height: "844px" }, type: "mobile" as const } },
};

const USER: MobileNavUser = { first: DEMO_USER.first, last: DEMO_USER.last, email: DEMO_USER.email, initials: DEMO_USER.initials };

/** A page under the nav, so the bar and the menu are seen in context. */
const PageBody = () => (
    <>
        <McgHero title="Tee times" blurb="Book a round at any of Montgomery County's public courses." eyebrow={false} />
        <div className="flex flex-col gap-3 px-6 py-6">
            {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-24 rounded-xl bg-primary ring-1 ring-secondary ring-inset" />
            ))}
        </div>
    </>
);

const Phone = ({ children }: { children: ReactNode }) => (
    <div className="min-h-dvh bg-secondary">
        {children}
        <PageBody />
    </div>
);

/** Signs the demo golfer in once the prototype session has loaded, as in the screenshot. */
const SignedIn = ({ children }: { children: ReactNode }) => {
    const { ready, user, signIn } = useSession();
    useEffect(() => {
        if (ready && !user) signIn();
    }, [ready, user, signIn]);
    return <>{children}</>;
};

type Option = "today" | "full-screen" | "drawer" | "sheet";

const Preview = ({ option, ...props }: MobileNavProps & { option: Option }) => {
    if (option === "today") {
        return (
            <SessionProvider>
                <SignedIn>
                    <Phone>
                        <McgNav />
                    </Phone>
                </SignedIn>
            </SessionProvider>
        );
    }
    const Nav = option === "full-screen" ? MobileNavFullScreen : option === "drawer" ? MobileNavDrawer : MobileNavSheet;
    return (
        <Phone>
            <Nav {...props} />
        </Phone>
    );
};

const meta = {
    title: "Reviews/Nov 27 – Mobile Nav/Options",
    id: "nov-27-2026-mobile-nav",
    component: Preview,
    parameters: {
        layout: "fullscreen",
        nextjs: { appDirectory: true, navigation: { pathname: "/tee-times" } },
        viewport: PHONE_VIEWPORT,
    },
    globals: { viewport: { value: "phone390", isRotated: false } },
    args: {
        option: "full-screen",
        user: USER,
        cartCount: 2,
        cartTotal: 96,
        activeHref: "/tee-times",
        onNavigate: fn(),
        onSignIn: fn(),
        onSignOut: fn(),
    },
    argTypes: { option: { control: "radio", options: ["today", "full-screen", "drawer", "sheet"] } },
} satisfies Meta<typeof Preview>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Today's header at 390: the utility bar, logo and six sections wrap over each other. */
export const Today: Story = { args: { option: "today" } };

/* A · Full-screen menu */

/** A · Full-screen menu, closed: logo and name, cart with total, menu. */
export const FullScreenClosed: Story = { name: "A · Full-screen menu", args: { option: "full-screen" } };

/** A · open: location, six big section links, the cart, then the account. */
export const FullScreenOpen: Story = { name: "A · Full-screen menu · open", args: { option: "full-screen", defaultOpen: true } };

/** A · open and signed out: Sign in replaces the account row. */
export const FullScreenSignedOut: Story = {
    name: "A · Full-screen menu · signed out",
    args: { option: "full-screen", defaultOpen: true, user: null, cartCount: 0, cartTotal: 0 },
};

/* B · Side drawer */

/** B · Side drawer, closed: the same slim bar. */
export const DrawerClosed: Story = { name: "B · Side drawer", args: { option: "drawer" } };

/** B · open: Fox's slideout drawer from the right, account first, sections with icons, sign out last. */
export const DrawerOpen: Story = { name: "B · Side drawer · open", args: { option: "drawer", defaultOpen: true } };

/** B · open and signed out. */
export const DrawerSignedOut: Story = {
    name: "B · Side drawer · signed out",
    args: { option: "drawer", defaultOpen: true, user: null, cartCount: 0, cartTotal: 0 },
};

/* C · Drop-down sheet */

/** C · Drop-down sheet, closed: menu left, logo centred, cart right. */
export const SheetClosed: Story = { name: "C · Drop-down sheet", args: { option: "sheet" } };

/** C · open: drops from the top over a dimmed page; sections as tiles, then cart and account. */
export const SheetOpen: Story = { name: "C · Drop-down sheet · open", args: { option: "sheet", defaultOpen: true } };

/** C · open and signed out. */
export const SheetSignedOut: Story = {
    name: "C · Drop-down sheet · signed out",
    args: { option: "sheet", defaultOpen: true, user: null, cartCount: 0, cartTotal: 0 },
};
