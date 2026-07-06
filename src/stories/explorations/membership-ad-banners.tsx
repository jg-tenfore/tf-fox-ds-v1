import type { FC, ReactNode } from "react";
import { useState } from "react";
import { Award05, GraduationHat01, Star01, Users01, XClose, Zap } from "@untitledui/icons";
import { cx } from "@/utils/cx";

/**
 * Reusable dismissible membership ad banners — the same experience as the Tee Times
 * announcement banner, in a set of color variants with alternate messaging. Shared
 * by the Memberships "Ad Banners" showcase and the Tee Times + Ads screen. All on
 * design-system tokens.
 */

export type AdTone = "brand" | "dark" | "ink" | "subtle" | "warning";

const TONES: Record<AdTone, { root: string; chip: string; cta: string; close: string }> = {
    brand: { root: "bg-brand-solid text-white", chip: "bg-white/15", cta: "bg-white text-brand-secondary hover:bg-white/90", close: "text-white/80 hover:bg-white/15 hover:text-white" },
    dark: { root: "bg-brand-section text-white", chip: "bg-white/15", cta: "bg-white text-primary hover:bg-white/90", close: "text-white/80 hover:bg-white/15 hover:text-white" },
    ink: { root: "bg-primary-solid text-white", chip: "bg-white/15", cta: "bg-white text-primary hover:bg-white/90", close: "text-white/80 hover:bg-white/15 hover:text-white" },
    subtle: { root: "bg-brand-primary text-brand-secondary ring-1 ring-brand ring-inset", chip: "bg-primary", cta: "bg-brand-solid text-white hover:bg-brand-solid_hover", close: "text-brand-secondary hover:bg-black/5" },
    warning: { root: "bg-warning-solid text-white", chip: "bg-white/15", cta: "bg-white text-warning-primary hover:bg-white/90", close: "text-white/80 hover:bg-white/15 hover:text-white" },
};

export interface AdBannerDef {
    label: string;
    tone: AdTone;
    icon: FC<{ className?: string }>;
    message: ReactNode;
    cta: string;
}

export const AD_BANNERS: AdBannerDef[] = [
    { label: "Brand · join", tone: "brand", icon: Award05, message: (<><span className="font-semibold">Play unlimited golf.</span> Become an annual member and skip the green fees.</>), cta: "View plans" },
    { label: "Dark · family", tone: "dark", icon: Users01, message: (<><span className="font-semibold">Bring the whole family.</span> Family membership covers 2 adults + juniors from $3,600/yr.</>), cta: "See family rate" },
    { label: "Ink · student", tone: "ink", icon: GraduationHat01, message: (<><span className="font-semibold">Under 25?</span> Student membership is just $900/yr with a valid student ID.</>), cta: "Join as student" },
    { label: "Subtle · benefits", tone: "subtle", icon: Star01, message: (<><span className="font-semibold">Members save 10%</span> in the Pro Shop and dining — every single visit.</>), cta: "Compare benefits" },
    { label: "Warning · offer", tone: "warning", icon: Zap, message: (<><span className="font-semibold">Limited time:</span> initiation fee waived on new memberships through July.</>), cta: "Claim offer" },
];

export const AdBanner = ({ tone, icon: Icon, message, cta }: Omit<AdBannerDef, "label">) => {
    const [show, setShow] = useState(true);
    if (!show) return null;
    const t = TONES[tone];
    return (
        <div className={cx("relative flex items-center gap-3 rounded-xl px-4 py-3 sm:px-5", t.root)}>
            <span className={cx("hidden size-8 shrink-0 items-center justify-center rounded-lg sm:flex", t.chip)}>
                <Icon className="size-4.5" aria-hidden="true" />
            </span>
            <p className="flex-1 text-sm">{message}</p>
            <button type="button" className={cx("hidden shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition duration-100 ease-linear sm:block", t.cta)}>
                {cta}
            </button>
            <button type="button" onClick={() => setShow(false)} aria-label="Dismiss" className={cx("flex size-8 shrink-0 items-center justify-center rounded-lg transition duration-100 ease-linear", t.close)}>
                <XClose className="size-5" aria-hidden="true" />
            </button>
        </div>
    );
};

/** A stack of the ad banners (defaults to all five), each independently dismissible. */
export const MembershipAdBanners = ({ banners = AD_BANNERS }: { banners?: AdBannerDef[] }) => (
    <div className="flex flex-col gap-2">
        {banners.map((b) => (
            <AdBanner key={b.label} tone={b.tone} icon={b.icon} message={b.message} cta={b.cta} />
        ))}
    </div>
);
