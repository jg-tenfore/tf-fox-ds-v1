import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { FC } from "react";
import { useState } from "react";
import { ArrowRight, Award05, Calendar, CheckCircle, Clock, CoinsStacked01, Flag06, GraduationHat01, RefreshCcw01, ShoppingBag01, Trophy01, Users01, UsersPlus } from "@untitledui/icons";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";
import { ProfileShell } from "./profile-shell";
import { Segmented } from "./profile-ui";

/**
 * "Profile / Memberships" — the membership sales page. The Annual plan is the hero
 * with an Individual / Family rate switcher; Senior and Student are secondary. The
 * "see details" dialog uses a value-prop grid (icon + heading + description) with
 * its own switcher, plus three account states (non-member / member / expired).
 */
const meta: Meta = { title: "Profile ∕ Account/Memberships", parameters: { layout: "fullscreen" } };
export default meta;
type Story = StoryObj;

const usd = (n: number) => "$" + n.toLocaleString("en-US");

interface ValueProp {
    icon: FC<{ className?: string }>;
    title: string;
    desc: string;
}
interface Plan {
    key: string;
    name: string;
    price: number;
    tagline: string;
    props: ValueProp[];
}
const P = (icon: FC<{ className?: string }>, title: string, desc: string): ValueProp => ({ icon, title, desc });

type Variant = "individual" | "family";

const ANNUAL: Record<Variant, Plan> = {
    individual: {
        key: "annual-individual",
        name: "Annual",
        price: 2400,
        tagline: "Full membership for one golfer.",
        props: [
            P(Flag06, "Unlimited golf", "Play as much as you like, 7 days a week."),
            P(CoinsStacked01, "Member rates", "Skip green fees on every round."),
            P(Calendar, "Priority booking", "Reserve tee times up to 14 days out."),
            P(ShoppingBag01, "Shop & dining", "10% off the Pro Shop and the Grill."),
            P(Users01, "Guest passes", "Six passes a year to bring friends."),
            P(Trophy01, "Events & leagues", "Priority entry to clinics and scrambles."),
        ],
    },
    family: {
        key: "annual-family",
        name: "Annual Family",
        price: 3600,
        tagline: "One membership for the whole household.",
        props: [
            P(Users01, "Whole household", "Covers two adults and juniors under 18."),
            P(Flag06, "Unlimited golf", "Everyone plays, 7 days a week."),
            P(Calendar, "Priority booking", "Reserve tee times up to 14 days out."),
            P(ShoppingBag01, "Shop & dining", "10% off the Pro Shop and the Grill."),
            P(GraduationHat01, "Junior programs", "Free junior clinics and camps."),
            P(UsersPlus, "More guests", "Twelve guest passes a year."),
        ],
    },
};

const SECONDARY: Plan[] = [
    {
        key: "senior",
        name: "Senior",
        price: 1800,
        tagline: "Ages 65+ — weekday-focused access.",
        props: [
            P(Flag06, "Weekday golf", "Unlimited rounds Monday to Friday."),
            P(Clock, "Weekend access", "Play weekends after 12 PM."),
            P(Calendar, "Priority booking", "Reserve tee times up to 10 days out."),
            P(CoinsStacked01, "Member rates", "Save on every round you play."),
            P(ShoppingBag01, "Shop & dining", "10% off the Pro Shop and the Grill."),
            P(Users01, "Guest passes", "Four passes a year for friends."),
        ],
    },
    {
        key: "student",
        name: "Student",
        price: 900,
        tagline: "Under 25 with a valid student ID.",
        props: [
            P(Flag06, "Weekday golf", "Unlimited rounds Monday to Friday."),
            P(Clock, "Twilight weekends", "Play weekend evenings at twilight."),
            P(Calendar, "Advance booking", "Reserve tee times up to 7 days out."),
            P(CoinsStacked01, "Student rate", "Full access for $900 a year."),
            P(GraduationHat01, "Clinics", "Discounted junior and skills clinics."),
            P(ShoppingBag01, "Pro Shop", "10% off gear and apparel."),
        ],
    },
];

/* -------------------------------- Primary ------------------------------ */

const PrimaryPlan = ({ variant, onVariant, plan, cta, onDetails }: { variant: Variant; onVariant: (v: Variant) => void; plan: Plan; cta: string; onDetails: () => void }) => (
    <section className="rounded-2xl bg-primary p-6 shadow-lg ring-1 ring-brand ring-inset">
        <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
                <Badge color="brand" size="sm" type="pill-color">
                    Most popular
                </Badge>
                <h3 className="mt-2 text-lg font-semibold text-primary">Annual Membership</h3>
                <p className="text-sm text-tertiary">{plan.tagline}</p>
            </div>
            <Segmented
                options={[
                    { key: "individual", label: "Individual" },
                    { key: "family", label: "Family" },
                ]}
                value={variant}
                onChange={onVariant}
            />
        </div>
        <p className="mt-5">
            <span className="text-display-sm font-semibold text-primary tabular-nums">{usd(plan.price)}</span> <span className="text-sm text-tertiary">/ year</span>
        </p>
        <ul className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {plan.props.map((p) => (
                <li key={p.title} className="flex items-start gap-2.5">
                    <CheckCircle className="mt-0.5 size-5 shrink-0 text-fg-brand-primary" aria-hidden="true" />
                    <span className="text-sm text-secondary">{p.title}</span>
                </li>
            ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-2">
            <Button color="primary" size="md">
                {cta}
            </Button>
            <Button color="secondary" size="md" onClick={onDetails}>
                See details
            </Button>
        </div>
    </section>
);

/* ------------------------------- Secondary ----------------------------- */

const SecondaryCard = ({ plan, cta, onDetails }: { plan: Plan; cta: string; onDetails: () => void }) => (
    <div className="flex flex-col rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset">
        <div className="flex items-baseline justify-between gap-2">
            <p className="text-md font-semibold text-primary">{plan.name}</p>
            <p className="text-sm">
                <span className="font-semibold text-primary tabular-nums">{usd(plan.price)}</span> <span className="text-tertiary">/ yr</span>
            </p>
        </div>
        <p className="mt-1 text-sm text-tertiary">{plan.tagline}</p>
        <ul className="mt-3 flex flex-1 flex-col gap-1.5">
            {plan.props.slice(0, 3).map((p) => (
                <li key={p.title} className="flex items-start gap-2 text-sm text-secondary">
                    <CheckCircle className="mt-0.5 size-4 shrink-0 text-fg-brand-primary" aria-hidden="true" />
                    {p.title}
                </li>
            ))}
        </ul>
        <div className="mt-4 flex items-center gap-3">
            <Button color="secondary" size="sm" onClick={onDetails}>
                See details
            </Button>
            <Button color="link-color" size="sm">
                {cta}
            </Button>
        </div>
    </div>
);

/* ------------------------ Value-prop details dialog -------------------- */

const UpgradeDialog = ({
    title,
    plan,
    cta,
    switcher,
    onClose,
}: {
    title: string;
    plan: Plan;
    cta: string;
    switcher?: { variant: Variant; onVariant: (v: Variant) => void };
    onClose: () => void;
}) => (
    <>
        <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h2 className="max-w-md text-xl font-semibold text-primary">{title}</h2>
                    <p className="mt-1 text-sm text-tertiary">
                        <span className="font-semibold text-primary tabular-nums">{usd(plan.price)}</span> / year · approx {usd(Math.round(plan.price / 12))}/mo
                    </p>
                </div>
                {switcher && (
                    <Segmented
                        options={[
                            { key: "individual", label: "Individual" },
                            { key: "family", label: "Family" },
                        ]}
                        value={switcher.variant}
                        onChange={switcher.onVariant}
                    />
                )}
            </div>

            <div className="mt-7 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                {plan.props.map((p) => (
                    <div key={p.title}>
                        <div className="flex items-center gap-2">
                            <p.icon className="size-5 shrink-0 text-fg-secondary" aria-hidden="true" />
                            <p className="text-sm font-semibold text-primary">{p.title}</p>
                        </div>
                        <p className="mt-1.5 text-sm text-tertiary">{p.desc}</p>
                    </div>
                ))}
            </div>

            <p className="mt-7 text-sm text-tertiary">
                Get more information about{" "}
                <button type="button" className="font-medium text-brand-secondary underline underline-offset-2">
                    Sagamore memberships
                </button>
                .
            </p>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-secondary px-6 py-4 sm:px-8">
            <Button color="secondary" size="md" onClick={onClose}>
                Dismiss
            </Button>
            <Button color="primary" size="md" iconTrailing={ArrowRight}>
                {cta}
            </Button>
        </div>
    </>
);

/* -------------------------------- States ------------------------------- */

const ActiveMembership = () => (
    <div className="flex flex-col gap-6">
        <div>
            <h2 className="text-display-sm font-semibold text-primary">Your membership</h2>
            <p className="mt-1.5 text-md text-tertiary">Manage your plan and see everything it unlocks.</p>
        </div>
        <div className="rounded-2xl bg-primary p-6 ring-1 ring-secondary ring-inset">
            <div className="flex flex-wrap items-center gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-primary">
                    <Award05 className="size-6 text-fg-brand-primary" aria-hidden="true" />
                </span>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <p className="text-md font-semibold text-primary">Annual · Individual</p>
                        <Badge color="success" size="sm" type="pill-color">
                            Active
                        </Badge>
                    </div>
                    <p className="text-sm text-tertiary">Member since 2019 · Renews May 2, 2027 · No. SAG-04821</p>
                </div>
                <Button color="secondary" size="sm">
                    Manage
                </Button>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-5 border-t border-secondary pt-6 sm:grid-cols-2">
                {ANNUAL.individual.props.map((p) => (
                    <div key={p.title} className="flex items-start gap-2.5">
                        <p.icon className="mt-0.5 size-5 shrink-0 text-fg-secondary" aria-hidden="true" />
                        <div>
                            <p className="text-sm font-semibold text-primary">{p.title}</p>
                            <p className="text-sm text-tertiary">{p.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const ExpiredBanner = () => (
    <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-warning-primary p-5 ring-1 ring-secondary ring-inset">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-warning-secondary">
            <RefreshCcw01 className="size-5 text-warning-primary" aria-hidden="true" />
        </span>
        <div className="flex-1">
            <p className="text-sm font-semibold text-primary">Your membership has expired</p>
            <p className="text-sm text-tertiary">It ended on May 2, 2026. Renew below to restore unlimited golf and member rates.</p>
        </div>
        <Button color="primary" size="md">
            Renew now
        </Button>
    </div>
);

type OpenModal = { kind: "annual" } | { kind: "plan"; plan: Plan } | null;

const MembershipsScreen = ({ state }: { state: "guest" | "member" | "expired" }) => {
    const [variant, setVariant] = useState<Variant>("individual");
    const [open, setOpen] = useState<OpenModal>(null);
    const renew = state === "expired";

    const dialogPlan = open?.kind === "annual" ? ANNUAL[variant] : open?.kind === "plan" ? open.plan : null;
    const dialogTitle = open?.kind === "annual" ? "Upgrade to an Annual Membership" : open?.kind === "plan" ? `Get the ${open.plan.name} Membership` : "";

    return (
        <ProfileShell active="memberships">
            {state === "member" ? (
                <ActiveMembership />
            ) : (
                <div className="flex flex-col gap-8">
                    {renew && <ExpiredBanner />}
                    <div>
                        <h2 className="text-display-sm font-semibold text-primary">{renew ? "Renew your membership" : "Become a member"}</h2>
                        <p className="mt-1.5 max-w-2xl text-md text-tertiary">Unlimited golf, member tee-time rates, and access to leagues, clinics, and events at Sagamore. Choose the plan that fits.</p>
                    </div>

                    <PrimaryPlan variant={variant} onVariant={setVariant} plan={ANNUAL[variant]} cta={renew ? "Renew Annual" : "Join Annual"} onDetails={() => setOpen({ kind: "annual" })} />

                    <div>
                        <p className="mb-3 text-sm font-semibold tracking-wide text-quaternary uppercase">Also available</p>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {SECONDARY.map((p) => (
                                <SecondaryCard key={p.key} plan={p} cta={renew ? "Renew" : "Join"} onDetails={() => setOpen({ kind: "plan", plan: p })} />
                            ))}
                        </div>
                    </div>

                    <p className="text-center text-sm text-tertiary">No initiation fee · Family add-ons available · Cancel anytime before renewal.</p>
                </div>
            )}

            <ModalOverlay isOpen={open != null} onOpenChange={(o) => !o && setOpen(null)}>
                <Modal className="max-w-2xl">
                    <Dialog className="max-h-[90vh] overflow-y-auto rounded-2xl bg-primary shadow-xl ring-1 ring-secondary_alt">
                        {dialogPlan && (
                            <UpgradeDialog
                                title={dialogTitle}
                                plan={dialogPlan}
                                cta={renew ? "Continue to renew" : "Continue"}
                                switcher={open?.kind === "annual" ? { variant, onVariant: setVariant } : undefined}
                                onClose={() => setOpen(null)}
                            />
                        )}
                    </Dialog>
                </Modal>
            </ModalOverlay>
        </ProfileShell>
    );
};

export const Join: Story = { name: "Join (Non-member)", render: () => <MembershipsScreen state="guest" /> };
export const Member: Story = { name: "Member", render: () => <MembershipsScreen state="member" /> };
export const Expired: Story = { name: "Expired", render: () => <MembershipsScreen state="expired" /> };
