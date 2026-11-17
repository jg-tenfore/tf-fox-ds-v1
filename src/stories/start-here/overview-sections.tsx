import heroArt from "./art/hero-course.jpg";
import shotClubShop from "./screens/club-shop.jpg";
import shotAcademy from "./screens/p1-academy.jpg";
import shotAccount from "./screens/p1-account.jpg";
import shotClinics from "./screens/p1-clinics.jpg";
import shotGrill from "./screens/p1-grill.jpg";
import shotPackages from "./screens/p1-packages.jpg";
import shotShop from "./screens/p1-shop.jpg";
import shotTeeSheet from "./screens/p1-tee-sheet.jpg";
import shotSearch from "./screens/p3-search.jpg";
import shotTime from "./screens/p3-time.jpg";
import { COUNTS, DOCS, SUMMARIES, proto, story } from "./tokens";
import { Banner, CardGrid, Cta, CtaRow, Hero, MiniCard, ShotCard } from "./ui";

/**
 * Start Here › Overview — the page Storybook opens on (id start-here-overview--docs; the old
 * introduction--docs is redirected here by .storybook/static/legacy-redirects.js). Sections
 * are components so the MDX stays a short outline; screenshots come from
 * scripts/capture-intro-screens.mjs.
 */

const LookAt = ({ children }: { children: string }) => (
    <>
        <b className="font-semibold text-secondary">Look at:</b> {children}
    </>
);

export const OverviewHero = () => (
    <Hero
        eyebrow="Fox design system"
        title="The MCG prototypes, and the ideas behind TenFore's golfer web."
        lead="Three clickable prototypes for Montgomery County Golf, nine county courses in Maryland, and the design system behind them. Since Nov 11, Crane Web replaces Fox as TenFore's live golfer web app. Fox keeps the MCG prototypes and the ideas Crane Web builds from."
        chips={[
            `${COUNTS.mcgScreens} prototype screens`,
            `${COUNTS.prototypes} prototypes`,
            `${COUNTS.reviews} review rounds`,
            `${COUNTS.courses} MCG courses`,
            "Sample data only",
        ]}
        art={heroArt}
        artWidth="72%"
        actions={
            <CtaRow>
                <Cta kind="primary" href={story(SUMMARIES.sep23)}>
                    Open the newest review
                </Cta>
                <Cta kind="secondary" href={story(DOCS.howToReview)}>
                    How to review
                </Cta>
            </CtaRow>
        }
        shots={[
            { img: shotSearch, label: "Search · Prototype 3", href: story("mcg-prototype-3-instruction--search") },
            { img: shotTime, label: "Time board · Prototype 3", href: story("mcg-prototype-3-instruction--choose-time") },
            { img: shotTeeSheet, label: "Tee Times · Prototype 1", href: story("mcg-prototype-tee-times--tee-sheet") },
        ]}
        caption="Live screens from the prototypes. Golfers, orders and prices are invented. Instructors are MCG's public roster."
    />
);

/** The review rounds, newest first, each leading to its Summary and its key screens. Then what came after them, as a slim strip. */
export const WhatsNew = () => (
    <>
        <CardGrid min={220}>
            <MiniCard
                eyebrow="Sep 23 · Newest"
                title="MCG Prototype 3, the hybrid"
                href={story(SUMMARIES.sep23)}
                cta="Summary"
                links={[
                    ["Search", story("mcg-prototype-3-instruction--search")],
                    ["Checkout", story("mcg-prototype-3-instruction--checkout")],
                ]}
                tone="brand"
            >
                MCG's pick of both prototypes: one search step up front, Prototype 1's time board and waitlist, and an account to book. Austin's two fixes also
                landed in Prototypes 1 and 2.
            </MiniCard>
            <MiniCard
                eyebrow="Sep 15"
                title="MCG Prototype 2"
                href={story(SUMMARIES.sep15Prototype2)}
                cta="Summary"
                links={[["Open Prototype 2", proto(2, "/instruction/")]]}
            >
                A separate copy of Prototype 1. Instruction and Clinics share one tab and one catalog. A private lesson is booked one step at a time.
            </MiniCard>
            <MiniCard
                eyebrow="Sep 15"
                title="Austin's Academy feedback"
                href={story(SUMMARIES.sep15Academy)}
                cta="Summary"
                links={[
                    ["Reviews", story("mcg-prototype-instructor-profile--reviews-collecting")],
                    ["Buy 3 discount", story("mcg-prototype-events-clinics--clinic-per-session-discount")],
                ]}
            >
                Verified reviews after a lesson, prices set by group size, and sign-up rules for clinics and lessons.
            </MiniCard>
            <MiniCard
                eyebrow="Sep 11"
                title="MCG Prototype 1"
                href={story(SUMMARIES.sep11)}
                cta="Summary"
                links={[
                    ["Home", story("mcg-prototype-home--landing")],
                    ["Academy", story("mcg-prototype-academy--instructors")],
                ]}
            >
                The whole clickable county site: tee times, shop, events, clinics, grill, account, and the MCG Academy with its 23 real instructors.
            </MiniCard>
        </CardGrid>
        <Banner eyebrow="Nov 3 · In Linear" title="Specced as P-WJ-118" href={story(DOCS.process)} cta="Open decisions">
            Prototype 3 became Linear project P-WJ-118, “Instructors – CoachNow Replacement”, with 67 tickets. Many link back to screens here.
        </Banner>
    </>
);

export const AreaCards = () => (
    <CardGrid min={300}>
        <ShotCard
            shot={shotSearch}
            badge="Newest"
            eyebrow={`Instruction · Prototype 3 · ${COUNTS.prototype3} screens`}
            title="Book a lesson, the hybrid"
            body="One search for courses, formats, days, dates and skill sets, carried into every step. Then pick an instructor or “any”, pick a time, and check out."
            note={<LookAt>the search carrying into each step, the sign-in inside checkout, and the waitlist's days and times of day.</LookAt>}
            href={story("mcg-prototype-3-instruction--search")}
            cta="Open the search"
            links={[["Open Prototype 3", proto(3, "/instruction/")]]}
        />
        <ShotCard
            shot={shotAcademy}
            eyebrow={`Academy · Prototype 1 · ${COUNTS.academy} screens`}
            title="The MCG Academy"
            body="The 23 real instructors, their profiles, lesson booking and verified reviews after a lesson."
            note={<LookAt>the price-by-group-size table on each lesson row, and the verified reviews.</LookAt>}
            href={story("mcg-prototype-academy--instructors")}
            cta="Open the Academy"
            links={[["Price table", story("mcg-prototype-instructor-profile--director")]]}
        />
        <ShotCard
            shot={shotPackages}
            eyebrow={`Instruction · Prototype 1 · ${COUNTS.instruction} screens`}
            title="Lessons, packages and credits"
            body="The full lesson flow, from catalog to confirmation. Then three ways to sell lesson packages, and the credits a golfer spends when booking."
            note={<LookAt>“Any available instructor”, the three package models side by side, and spending a credit at checkout.</LookAt>}
            href={story("instruction-packages-credits--browse-packages")}
            cta="Open packages"
            links={[
                ["Book a lesson", story("instruction-book-a-lesson--catalog")],
                ["Package models", story("instruction-model-comparison--comparison")],
            ]}
        />
        <ShotCard
            shot={shotTeeSheet}
            eyebrow={`Home & Tee Times · Prototype 1 · ${COUNTS.teeTimes} screens`}
            title="Nine courses, one tee sheet"
            body="Every course's tee times on one board, sorted by the clock, with course pills, resident rates and a hold timer at checkout."
            note={<LookAt>the resident-rate switch, and the checkout hold running out.</LookAt>}
            href={story("mcg-prototype-tee-times--tee-sheet")}
            cta="Open Tee Times"
            links={[["Home", story("mcg-prototype-home--landing")]]}
        />
        <ShotCard
            shot={shotShop}
            eyebrow={`Shop · Prototype 1 · ${COUNTS.shop} screens`}
            title="The county pro shop"
            body="Storefront, product, cart and a checkout where you pick up at a course. Goods with the MCG logo show a logo tile instead of a photo."
            note={<LookAt>the Save and Out of stock badges, and picking a pickup course instead of typing an address.</LookAt>}
            href={story("mcg-prototype-shop--storefront")}
            cta="Open the Shop"
            links={[["Checkout", story("mcg-prototype-shop--checkout")]]}
        />
        <ShotCard
            shot={shotClinics}
            eyebrow={`Events & Clinics · Prototype 1 · ${COUNTS.events} screens`}
            title="Events, clinics and the calendar"
            body="County events, clinics by level and age, a month calendar, and the sign-up rules: age limits, questions, and “Buy 3, get 50% off”."
            note={<LookAt>a golfer blocked by age (gender never blocks), and the Buy 3 nudge.</LookAt>}
            href={story("mcg-prototype-events-clinics--browse-clinics")}
            cta="Open Clinics"
            links={[["Age rule", story("mcg-prototype-events-clinics--clinic-registration-blocked")]]}
        />
        <ShotCard
            shot={shotGrill}
            eyebrow={`Grill · Prototype 1 · ${COUNTS.grill} screens`}
            title="Order ahead for the turn"
            body="Course grills, snack windows and the beverage cart. Order ahead and pick up at the turn, with deals that only apply when a venue can honor them."
            note={<LookAt>deals outside their time window, and a snack window's shorter menu.</LookAt>}
            href={story("mcg-prototype-grill--courses")}
            cta="Open the Grill"
            links={[["Order ahead", story("mcg-prototype-grill--order-ahead")]]}
        />
        <ShotCard
            shot={shotAccount}
            eyebrow={`Account · Prototype 1 · ${COUNTS.account} screens`}
            title="The golfer's account"
            body="Sign in and sign up, the account hub, activity, a lesson-credit wallet and settings, each in every state."
            note={<LookAt>first run, nothing booked, and a non-resident golfer.</LookAt>}
            href={story("mcg-prototype-account--account")}
            cta="Open the account"
            links={[["Wallet", story("mcg-prototype-account--wallet")]]}
        />
        <ShotCard
            shot={shotClubShop}
            eyebrow={`Before MCG · ${COUNTS.golferWeb} screens`}
            title="Golfer web for sample clubs"
            body="The earlier booking, shop, events and account screens for three sample clubs: an 18-hole club, a three-course club and an indoor simulator venue."
            note={<LookAt>the shop and checkout. Crane Web's shop starts from these.</LookAt>}
            href={story("global-nav-pro-shop-shop-all--default")}
            cta="Open the shop"
            links={[["Checkout", story("shop-checkout-3-checkout--default")]]}
        />
    </CardGrid>
);

/** The other Start Here pages. */
export const NextPages = () => (
    <CardGrid min={220}>
        <MiniCard eyebrow="The rules" title="Style guide" href={story(DOCS.styleGuide)} cta="Read the rules" tone="subtle">
            Tokens, type, club colorways, badges, buttons and sample data, each linked to its Design System page.
        </MiniCard>
        <MiniCard eyebrow="The plan" title="Process & roadmap" href={story(DOCS.process)} cta="See the roadmap" tone="subtle">
            Everything shipped since June, the open decisions for the CoachNow replacement, and the handover to Crane Web.
        </MiniCard>
        <MiniCard eyebrow="Your turn" title="How to review" href={story(DOCS.howToReview)} cta="Start reviewing" tone="subtle">
            Where to start, how to share a screen, how to compare Prototypes 1, 2 and 3, and where feedback goes.
        </MiniCard>
        <MiniCard eyebrow="Every screen" title="Screen index" href={story(DOCS.screenIndex)} cta="Open the index" tone="subtle">
            Every prototype screen, grouped by prototype and area.
        </MiniCard>
    </CardGrid>
);

export const Folders = () => (
    <CardGrid min={290}>
        <MiniCard eyebrow="1 · You are here" title="Start Here" tone="brand">
            This page, the style guide, the process and roadmap, and how to review.
        </MiniCard>
        <MiniCard eyebrow="2" title="Prototypes" href={story(DOCS.screenIndex)} cta="Screen index">
            The MCG prototypes, newest first: Prototype 3, then Prototype 1 and its Instruction flows. Then the golfer web for sample clubs. Prototype 2 lives
            only as its own app.
        </MiniCard>
        <MiniCard eyebrow="3" title="Design System" href={story("foundations-colors--brand")} cta="Colors">
            Styles (color, type, logos, course imagery), the components, the account login screens and the club themes.
        </MiniCard>
        <MiniCard eyebrow="4" title="Reviews" href={story(SUMMARIES.sep23)} cta="Newest summary">
            One folder per review round, newest first. Each opens on a Summary: what was asked, what was built, what's open.
        </MiniCard>
        <MiniCard eyebrow="5" title="Research" href={story("design-systems-color-theory-analogous--rose")} cta="Color theory">
            Early concept studies from June, and color theory: analogous, complementary and triadic color pairs.
        </MiniCard>
        <MiniCard eyebrow="6" title="Archive" href={story(DOCS.archive)} cta="About the archive">
            Superseded work, kept for reference: the July MCG tee sheet and the early booking pages. The folder starts collapsed.
        </MiniCard>
    </CardGrid>
);
