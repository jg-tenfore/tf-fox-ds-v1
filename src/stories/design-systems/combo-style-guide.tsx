import { generateTeeTimes } from "@/components/booking/sagamore-data";
import { SAGAMORE_CLUB, TeeCell } from "../explorations/tenfore-chrome";
import { DEFAULT_DATE, Eg, fmtNice, type GuideConfig } from "./club-style-guide";
import { harmony, THEORIES, type Theory, tone } from "./color-harmony";
import { ratioVsWhite } from "./contrast";

/**
 * Builds a full booking style-guide config for one base hue × color theory.
 * The base family drives the brand (nav, buttons, calendar, checks) at -700; the
 * harmony partners are applied as card accents at -600. The header shows the full
 * palette with roles so the relationship is legible at a glance.
 */
const SLOTS = generateTeeTimes("weekday").filter((s) => s.spotsAvailable > 0);

export const comboGuideConfig = (baseKey: string, theory: Theory): GuideConfig => {
    const fams = harmony(baseKey, theory);
    const base = fams[0];
    const accents = fams.slice(1);
    // Every brand surface uses the -700 shade so white text/fills clear WCAG AA
    // (the -600 banners previously failed AA for several hues). The badge shows
    // the worst-case contrast across the combo's colors.
    const primary = tone(base.key, 700);
    const banner = (i: number) => tone(accents[i % accents.length].key, 700);
    const firstAccent = accents[0];
    const lastAccent = accents[accents.length - 1];
    const contrastRatio = Math.min(...fams.map((f) => ratioVsWhite(f.key, 700)));

    return {
        club: { ...SAGAMORE_CLUB, name: `${base.label} · ${THEORIES[theory].label}`, navColor: primary },
        accentName: base.label,
        accentValue: `${base.key}-700`,
        subtitle: `${THEORIES[theory].blurb} — ${fams.map((f) => f.label).join(" + ")}.`,
        contrastRatio,
        palette: [
            { role: "Primary", color: primary, label: `${base.label} · ${base.key}-700` },
            ...accents.map((f, i) => ({
                role: accents.length > 1 ? `Accent ${i + 1}` : "Accent",
                color: tone(f.key, 700),
                label: `${f.label} · ${f.key}-700`,
            })),
        ],
        selectorCells: [
            { label: "Course", value: "All Courses" },
            { label: "Date", value: fmtNice(DEFAULT_DATE) },
            { label: "Players", value: "2 Players" },
        ],
        menuTitle: "Course",
        menuDefault: "All Courses",
        menuSections: [
            { rows: [{ value: "All Courses", label: "All Courses" }] },
            { rows: [{ value: "18 Holes", label: "18 Holes" }] },
            {
                header: "9 Holes",
                rows: [
                    { value: "9 Holes (Back)", label: "9 Holes (Back)" },
                    { value: "9 Holes (Front)", label: "9 Holes (Front)" },
                ],
            },
        ],
        cards: (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <Eg state="18 holes">
                    <TeeCell slot={SLOTS[2]} holesOverride={18} holesWord />
                </Eg>
                <Eg state={`Nine · ${firstAccent.label}`}>
                    <TeeCell slot={SLOTS[4]} nineLabel={firstAccent.label} nineColor={banner(0)} holesOverride={9} holesWord />
                </Eg>
                <Eg state={`Nine · ${lastAccent.label}`}>
                    <TeeCell slot={SLOTS[6]} nineLabel={lastAccent.label} nineColor={banner(accents.length - 1)} holesOverride={9} holesWord />
                </Eg>
            </div>
        ),
    };
};
