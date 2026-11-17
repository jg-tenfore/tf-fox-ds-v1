import shotTeeSheet from "./screens/archive-mcg-tee-sheet.jpg";
import { COUNTS, DOCS, SUMMARIES, story } from "./tokens";
import { CardGrid, Cta, CtaRow, Hero, MiniCard, Split } from "./ui";

/**
 * Archive › About the archive — what the Archive holds and why it's kept. Counts are
 * stories per folder from Storybook's index.json (Nov 17, 2026); dates from git log.
 */

export const ArchiveHero = () => (
    <Hero
        size="page"
        eyebrow="Archive"
        title="Earlier work, kept for reference."
        lead="Screens that a later round replaced. Nothing here needs a review, and nothing here should be built. It stays so old links still open and the reasoning stays close. Crane Web now replaces Fox, and it still borrows from these ideas."
        chips={[`${COUNTS.archive} stories`, "2 folders", "Starts collapsed"]}
        actions={
            <CtaRow>
                <Cta kind="primary" href={story(DOCS.overview)}>
                    Back to the Overview
                </Cta>
                <Cta kind="secondary" href={story(SUMMARIES.sep23)}>
                    The newest review
                </Cta>
            </CtaRow>
        }
    />
);

export const ArchiveFolders = () => (
    <CardGrid min={290}>
        <MiniCard
            eyebrow="Jul 2026 · 1 story"
            title="MCG Courses tee sheet"
            links={[
                ["Open it", story("global-nav-tee-times-mcg-courses--default")],
                ["What replaced it", story("mcg-prototype-tee-times--tee-sheet")],
            ]}
        >
            The first MCG tee sheet, with every course on one board, in the sample-club layout. Replaced by Tee Times in MCG Prototype 1.
        </MiniCard>
        <MiniCard
            eyebrow="Jun 2026 · 8 stories · hidden"
            title="Early booking pages"
            links={[
                ["Availability", story("booking-pages-availability--default")],
                ["What replaced it", story("global-nav-tee-times-18-holes-sagamore--default")],
            ]}
        >
            The first booking pages from June: availability, checkout, confirmation and My Rounds. Hidden from the sidebar since Jun 19, so open them by link.
            Their building blocks live on in Design System › Components › Booking.
        </MiniCard>
    </CardGrid>
);

export const ArchiveReasons = () => (
    <CardGrid min={240}>
        <MiniCard eyebrow="1" title="The reasoning stays visible" tone="subtle">
            When someone asks why a screen looks the way it does, the options that lost are one click away.
        </MiniCard>
        <MiniCard eyebrow="2" title="Old links still open" tone="subtle">
            A story moves here with its id unchanged, so a link pasted into Linear or Slack at the time still works.
        </MiniCard>
        <MiniCard eyebrow="3" title="It stays out of the way" tone="subtle">
            The folder starts collapsed in the sidebar and sits last. Superseded work moves here instead of being deleted.
        </MiniCard>
    </CardGrid>
);

export const ArchiveExample = () => (
    <Split
        eyebrow="Archive › MCG Courses tee sheet (July)"
        title="The first nine-course tee sheet"
        shot={shotTeeSheet}
        caption="MCG Courses tee sheet · Jul 27, 2026"
        actions={
            <CtaRow className="gap-x-4 gap-y-1">
                <Cta href={story("global-nav-tee-times-mcg-courses--default")}>Open it</Cta>
                <Cta href={story("mcg-prototype-tee-times--tee-sheet")}>What replaced it</Cta>
            </CtaRow>
        }
    >
        Built on Jul 27 when MCG's course logos and photos arrived: every course's tee times on one board, inside the sample-club nav. Six weeks later, MCG
        Prototype 1 rebuilt it as the county site's own Tee Times page, with resident rates and a checkout hold.
    </Split>
);
