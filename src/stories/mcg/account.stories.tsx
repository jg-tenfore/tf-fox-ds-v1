import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AccountActivityScreen } from "@/components/mcg/account/account-activity";
import { AccountHubScreen } from "@/components/mcg/account/account-hub";
import { AccountSettingsScreen } from "@/components/mcg/account/account-settings";
import { DEMO_ACTIVITY, DEMO_CREDITS, DEMO_SAVED } from "@/components/mcg/account/account-ui";
import { AccountWalletScreen } from "@/components/mcg/account/account-wallet";
import { ForgotPasswordScreen } from "@/components/mcg/account/forgot-password";
import { SignInScreen } from "@/components/mcg/account/sign-in";
import { SignUpScreen } from "@/components/mcg/account/sign-up";
import { VerifyScreen } from "@/components/mcg/account/verify";
import { DEMO_USER } from "@/components/mcg/session";

/**
 * "MCG Prototype / Account" — the account half of the prototype: the four auth
 * screens and the four signed-in surfaces, each rendered from the same component its
 * route uses.
 *
 * Outside the app `useSession` returns an inert, signed-out session, so the
 * signed-in stories pass demo data straight in (`userOverride`, `activityOverride`,
 * `creditsOverride`). The markup is identical either way — the screens never fork on
 * "am I in Storybook".
 *
 * One consequence worth knowing: the shared MCG nav reads the live session, so in
 * Storybook the utility bar shows "Sign in" even on the signed-in stories. In the
 * prototype it shows the golfer's name. The account left nav is the same story in
 * reverse — it lights its row from `usePathname()` in the app, and falls back to the
 * screen's own section here, so a story and its route look alike.
 */
const meta: Meta = {
    title: "MCG Prototype/Account",
    parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

/** Everything a returning golfer has on their account — a verified county resident. */
const SIGNED_IN = {
    userOverride: DEMO_USER,
    activityOverride: DEMO_ACTIVITY,
    creditsOverride: DEMO_CREDITS,
    savedOverride: DEMO_SAVED,
    residentOverride: true,
};

/* ------------------------------- Auth -------------------------------- */

/** `/signin` — any credentials succeed and hand the golfer to `/account`. */
export const SignIn: Story = {
    name: "Sign in",
    render: () => <SignInScreen />,
};

/** `/signup` — name, email, a password meter, county residency and terms. */
export const SignUp: Story = {
    name: "Sign up",
    render: () => <SignUpScreen />,
};

/** `/verify` — six-digit code entry with a live resend timer. Any code works. */
export const Verify: Story = {
    name: "Verify email",
    render: () => <VerifyScreen userOverride={{ ...DEMO_USER, isNew: true }} />,
};

/** `/forgot-password` — step one, asking for the address on the account. */
export const ForgotPassword: Story = {
    name: "Forgot password",
    render: () => <ForgotPasswordScreen />,
};

/** `/forgot-password` — the "check your inbox" state after submitting. */
export const ForgotPasswordSent: Story = {
    name: "Forgot password (sent)",
    render: () => <ForgotPasswordScreen sentOverride emailOverride={DEMO_USER.email} />,
};

/* ------------------------------ Account ------------------------------ */

/** `/account` — the hub with a season of play behind it. */
export const Account: Story = {
    name: "Account hub",
    render: () => <AccountHubScreen {...SIGNED_IN} />,
};

/** `/account?welcome=1` — the first-run banner a just-verified golfer lands on. */
export const AccountWelcome: Story = {
    name: "Account hub (first run)",
    render: () => (
        <AccountHubScreen
            userOverride={{ ...DEMO_USER, isNew: true }}
            activityOverride={[]}
            creditsOverride={[]}
            savedOverride={[]}
            residentOverride
            welcomeOverride
        />
    ),
};

/** A brand-new account: the empty states have to be useful, not apologetic. */
export const AccountEmpty: Story = {
    name: "Account hub (nothing booked)",
    render: () => <AccountHubScreen userOverride={DEMO_USER} activityOverride={[]} creditsOverride={[]} savedOverride={[]} residentOverride />,
};

/**
 * A full account with nothing on the calendar — the Upcoming panel has to stand on
 * its own empty state while everything around it is populated.
 */
export const AccountNoUpcoming: Story = {
    name: "Account hub (nothing upcoming)",
    render: () => (
        <AccountHubScreen
            userOverride={DEMO_USER}
            activityOverride={DEMO_ACTIVITY.filter((item) => item.status !== "Upcoming")}
            creditsOverride={DEMO_CREDITS}
            savedOverride={DEMO_SAVED}
            residentOverride
        />
    ),
};

/**
 * The one status that changes what a golfer pays. A non-resident gets the residency
 * prompt where the club template would upsell a membership.
 */
export const AccountNonResident: Story = {
    name: "Account hub (non-resident)",
    render: () => <AccountHubScreen {...SIGNED_IN} residentOverride={false} />,
};

/** Signed out — an invitation with a sign-in CTA, never a dead end. */
export const AccountSignedOut: Story = {
    name: "Account hub (signed out)",
    render: () => <AccountHubScreen userOverride={null} />,
};

/** `/account/activity` — the full history, filtered by kind. */
export const Activity: Story = {
    name: "Activity",
    render: () => <AccountActivityScreen userOverride={DEMO_USER} activityOverride={DEMO_ACTIVITY} />,
};

/** The same page with nothing on the account yet. */
export const ActivityEmpty: Story = {
    name: "Activity (empty)",
    render: () => <AccountActivityScreen userOverride={DEMO_USER} activityOverride={[]} />,
};

/** Signed out. */
export const ActivitySignedOut: Story = {
    name: "Activity (signed out)",
    render: () => <AccountActivityScreen userOverride={null} />,
};

/** `/account/wallet` — lesson credits, gift card, saved cards and the resident ID. */
export const Wallet: Story = {
    name: "Wallet",
    render: () => <AccountWalletScreen userOverride={DEMO_USER} creditsOverride={DEMO_CREDITS} />,
};

/** The wallet before any package has been bought. */
export const WalletEmpty: Story = {
    name: "Wallet (no credits)",
    render: () => <AccountWalletScreen userOverride={DEMO_USER} creditsOverride={[]} />,
};

/** `/account/settings` — profile, notifications, password, residency, and the reset. */
export const Settings: Story = {
    name: "Settings",
    render: () => <AccountSettingsScreen userOverride={DEMO_USER} />,
};

/** Signed out. */
export const SettingsSignedOut: Story = {
    name: "Settings (signed out)",
    render: () => <AccountSettingsScreen userOverride={null} />,
};
