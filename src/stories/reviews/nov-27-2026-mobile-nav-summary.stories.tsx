import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { B, Block, Links, List, SummaryPage } from "./summary-kit";

/** Nov 27, 2026: three hamburger-menu options for MCG Prototype 3's header at phone width. */

const O = "nov-27-2026-mobile-nav--";

function Nov27Summary() {
    return (
        <SummaryPage
            eyebrow="Nov 27, 2026"
            title="Mobile nav: three ways into a hamburger menu"
            intro="MCG Prototype 3's header carries a utility bar (club, location, account, sign out, cart), the logo and name, and six sections. At phone width they wrap over each other. Each option below keeps one slim bar and moves the rest into a menu. All three use Fox parts and MCG's black and green."
            meta={["MCG Prototype 3 · McgNav", "Phone width, 390 × 844", "3 options · 10 stories"]}
        >
            <Block title="Today">
                <p>The utility bar splits into two lines per item, and the six sections wrap under a full-size logo, taking about a third of the screen.</p>
                <Links links={[[`${O}today`, "Today at 390"]]} />
            </Block>

            <Block title="What every option keeps">
                <List
                    items={[
                        <>
                            <B>A 64px bar</B> with the MCG logo, the cart (with a count badge) and the menu button. The cart stays one tap away.
                        </>,
                        <>
                            <B>Everything else in the menu:</B> the six sections (current one marked), the club and location, the cart total, the account and
                            sign out, or Sign in when signed out.
                        </>,
                        "Built on React Aria overlays: focus moves into the menu, Escape or a tap outside closes it, and the page underneath can't scroll.",
                    ]}
                />
            </Block>

            <Block title="A · Full-screen menu">
                <List
                    items={[
                        "Bar: logo and name, cart with its total, menu.",
                        "The menu fills the screen in MCG black: location, six big section links with the current one marked in green, the cart, then the account (avatar, View account, Sign out) at the bottom.",
                        "Best for: a few big, easy targets. The menu feels like part of the brand.",
                        "Trade-off: hides the page completely.",
                    ]}
                />
                <Links
                    links={[
                        [`${O}full-screen-closed`, "Closed"],
                        [`${O}full-screen-open`, "Open"],
                        [`${O}full-screen-signed-out`, "Signed out"],
                    ]}
                />
            </Block>

            <Block title="B · Side drawer">
                <List
                    items={[
                        "Bar: logo and name, cart, menu.",
                        "Fox's slideout drawer comes in from the right, light: “Hi, Morgan” and email first, then the club and location, the six sections with icons, the cart, and Sign out at the foot.",
                        "Best for: the most familiar pattern, and it reuses Fox's existing Slideout menu as is.",
                        "Trade-off: a light panel against the black header.",
                    ]}
                />
                <Links
                    links={[
                        [`${O}drawer-closed`, "Closed"],
                        [`${O}drawer-open`, "Open"],
                        [`${O}drawer-signed-out`, "Signed out"],
                    ]}
                />
            </Block>

            <Block title="C · Drop-down sheet">
                <List
                    items={[
                        "Bar: menu on the left, logo in the middle, cart on the right.",
                        "The menu drops from the top over a dimmed page: the club and location, the six sections as icon tiles (3 × 2), the cart, then the account and sign out in one row.",
                        "Best for: seeing every section at once, without scrolling, and keeping a glimpse of the page.",
                        "Trade-off: the tiles need an icon for each section; Grill uses a receipt, since the icon set has no food icon.",
                    ]}
                />
                <Links
                    links={[
                        [`${O}sheet-closed`, "Closed"],
                        [`${O}sheet-open`, "Open"],
                        [`${O}sheet-signed-out`, "Signed out"],
                    ]}
                />
            </Block>

            <Block title="Still open">
                <List
                    items={[
                        "Which option to take forward.",
                        "Where the hamburger takes over: below 1024px (Fox's lg) is the suggestion, since the full header starts to wrap around there.",
                        "Whether the same menu should replace the shared TenFore golfer header (Sagamore and the other clubs) too, or MCG only.",
                    ]}
                />
            </Block>
        </SummaryPage>
    );
}

const meta = {
    title: "Reviews/Nov 27 – Mobile Nav/Summary",
    id: "nov-27-2026-mobile-nav-summary",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Summary: Story = { render: () => <Nov27Summary /> };
