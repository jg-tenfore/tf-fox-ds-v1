import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useEffect, useState } from "react";
import { ArrowLeft, Clock, Heart, InfoCircle, Plus, Share07, ShoppingCart01 } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { SagamoreLogo } from "@/components/foundations/sagamore/sagamore-logo";
import { CreditCard } from "@/components/shared-assets/credit-card/credit-card";
import { cx } from "@/utils/cx";
import { money, Segmented } from "../profile/profile-ui";
import { PunchVisual, QRCode } from "../profile/wallet-experience";
import { GiftCardTile, PunchCardTile } from "./card-tiles";
import { StarRating } from "./store-ui";
import { SAGAMORE_CLUB, SiteFooter, TopNav } from "./tenfore-chrome";

/**
 * "Global Nav / Pro Shop / Cards" — the gift-card and punch-card experiences laid
 * out like the product-detail page: a thumbnail-variation rail + main preview on the
 * left, purchase details on the right. Reuses the Wallet building blocks (CreditCard
 * gift preview, punch-card visual, faux QR). Re-skinned with design tokens.
 */
const meta: Meta = { title: "Global Nav/Pro Shop/Cards", parameters: { layout: "fullscreen" } };
export default meta;
type Story = StoryObj;

const ShopBrand = () => (
    <div className="mb-3 flex items-center gap-2">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-solid p-1.5">
            <SagamoreLogo className="h-full w-auto" />
        </span>
        <span className="text-sm font-medium text-secondary">Sagamore Pro Shop</span>
    </div>
);

/* ------------------------------- Gift Card ----------------------------- */

type Design = "brand-dark" | "gray-dark" | "gradient-strip" | "salmon-strip";
const GIFT_DESIGNS: { type: Design; label: string }[] = [
    { type: "brand-dark", label: "Classic" },
    { type: "gray-dark", label: "Midnight" },
    { type: "gradient-strip", label: "Celebration" },
    { type: "salmon-strip", label: "Sunset" },
];
const PRESETS = [50, 100, 150, 250];

const GiftCardPage = () => {
    const [design, setDesign] = useState<Design>("brand-dark");
    const [amount, setAmount] = useState(100);
    const [custom, setCustom] = useState("");
    const [method, setMethod] = useState<"email" | "self">("email");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const value = custom ? Math.max(0, Number(custom) || 0) : amount;

    const card = (type: Design, width?: number) => (
        <CreditCard
            type={type}
            width={width}
            company="Sagamore Gift Card"
            cardHolder={method === "email" && name ? `To ${name}` : "Gift Card"}
            cardNumber={money(value)}
            cardExpiration="No expiry"
            logo={<SagamoreLogo className="max-h-7 max-w-full object-contain" />}
        />
    );

    return (
        <div className="flex min-h-dvh flex-col bg-secondary">
            <TopNav active="Shop" club={SAGAMORE_CLUB} />
            <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
                <Button color="link-gray" size="md" iconLeading={ArrowLeft} className="mb-6">
                    Back
                </Button>
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
                    {/* Gallery — design variations */}
                    <div>
                        <div className="flex min-h-[300px] items-center justify-center rounded-2xl bg-secondary p-8 ring-1 ring-secondary ring-inset">{card(design)}</div>
                        <div className="mt-4 flex flex-wrap gap-3">
                            {GIFT_DESIGNS.map((d) => (
                                <button
                                    key={d.type}
                                    type="button"
                                    onClick={() => setDesign(d.type)}
                                    aria-label={d.label}
                                    className={cx("flex flex-col items-center gap-1.5 rounded-xl p-2 transition duration-100 ease-linear ring-inset", design === d.type ? "ring-2 ring-brand" : "ring-1 ring-secondary hover:ring-brand")}
                                >
                                    {card(d.type, 84)}
                                    <span className={cx("text-xs font-medium", design === d.type ? "text-primary" : "text-tertiary")}>{d.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Details */}
                    <div className="flex flex-col">
                        <ShopBrand />
                        <h1 className="text-display-xs font-semibold tracking-wide text-primary uppercase">Digital Gift Card</h1>
                        <div className="mt-2 flex items-center gap-2">
                            <StarRating rating={4.9} count={128} />
                        </div>

                        <div className="mt-5">
                            <p className="mb-2 text-sm font-semibold text-primary">Amount</p>
                            <div className="grid grid-cols-4 gap-2">
                                {PRESETS.map((p) => {
                                    const active = !custom && amount === p;
                                    return (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => {
                                                setAmount(p);
                                                setCustom("");
                                            }}
                                            className={cx("rounded-xl py-2.5 text-center text-sm font-semibold tabular-nums ring-1 transition duration-100 ease-linear ring-inset", active ? "bg-brand-primary text-brand-secondary ring-brand" : "bg-primary text-secondary ring-secondary hover:bg-primary_hover")}
                                        >
                                            ${p}
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="mt-3 max-w-xs">
                                <Input label="Custom amount" placeholder="$—" value={custom} onChange={setCustom} inputMode="numeric" />
                            </div>
                        </div>

                        <div className="mt-5 flex flex-col gap-3">
                            <Segmented
                                options={[
                                    { key: "email", label: "Email a recipient" },
                                    { key: "self", label: "Add to my balance" },
                                ]}
                                value={method}
                                onChange={setMethod}
                            />
                            {method === "email" && (
                                <div className="flex flex-col gap-3">
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <Input label="Recipient name" placeholder="Jane Doe" value={name} onChange={setName} />
                                        <Input label="Recipient email" type="email" placeholder="jane@email.com" value={email} onChange={setEmail} />
                                    </div>
                                    <Input label="Message (optional)" placeholder="Happy birthday — see you on the course!" value={message} onChange={setMessage} />
                                </div>
                            )}
                        </div>

                        <div className="mt-6">
                            <Button color="primary" size="lg" iconLeading={ShoppingCart01} className="w-full" isDisabled={value <= 0}>
                                Add to cart · {money(value)}
                            </Button>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-3">
                            <Button color="secondary" size="lg" iconLeading={Heart}>
                                Save
                            </Button>
                            <Button color="secondary" size="lg" iconLeading={Share07}>
                                Share
                            </Button>
                        </div>

                        <div className="mt-8">
                            <h2 className="text-lg font-semibold text-primary">Description</h2>
                            <ul className="mt-3 flex list-disc flex-col gap-1.5 pl-5 text-sm text-secondary marker:text-fg-quaternary">
                                <li>Redeemable for tee times, the Pro Shop, dining, and events</li>
                                <li>Delivered instantly by email, or added to your account balance</li>
                                <li>Choose from four card designs</li>
                                <li>Never expires — no fees</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
            <SiteFooter club={SAGAMORE_CLUB} />
        </div>
    );
};

/* ------------------------------ Punch Card ----------------------------- */

const PACKS = [
    { rounds: 5, price: 200, perRound: 40, save: 25 },
    { rounds: 10, price: 360, perRound: 36, save: 90, best: true },
    { rounds: 20, price: 680, perRound: 34, save: 220 },
];

const DetailRow = ({ label, value, emphasis }: { label: string; value: React.ReactNode; emphasis?: boolean }) => (
    <div className="flex items-center justify-between gap-3 py-2.5">
        <span className="text-sm text-tertiary">{label}</span>
        <span className={cx("text-sm tabular-nums", emphasis ? "font-semibold text-brand-secondary" : "font-medium text-primary")}>{value}</span>
    </div>
);

const PunchCardPage = () => {
    const [pack, setPack] = useState(1);
    const p = PACKS[pack];

    const [qr, setQr] = useState(false);
    const [secs, setSecs] = useState(300);
    useEffect(() => {
        if (!qr) return;
        const t = setInterval(() => setSecs((s) => (s <= 1 ? 0 : s - 1)), 1000);
        return () => clearInterval(t);
    }, [qr]);
    const activate = () => {
        setSecs(300);
        setQr(true);
    };
    const mmss = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
    const expired = qr && secs <= 0;

    return (
        <div className="flex min-h-dvh flex-col bg-secondary">
            <TopNav active="Shop" club={SAGAMORE_CLUB} />
            <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
                <Button color="link-gray" size="md" iconLeading={ArrowLeft} className="mb-6">
                    Back
                </Button>
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
                    {/* Gallery — pack variations */}
                    <div>
                        <div className="flex min-h-[300px] items-center justify-center rounded-2xl bg-secondary p-8 ring-1 ring-secondary ring-inset">
                            <div className="w-full rounded-2xl border border-secondary bg-primary p-6">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-semibold text-primary">{p.rounds}-Round Punch Card</p>
                                    <span className="text-xs font-semibold tracking-wide text-brand-secondary uppercase">Sagamore</span>
                                </div>
                                <div className="mt-5">
                                    <PunchVisual total={p.rounds} used={0} />
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex gap-3">
                            {PACKS.map((pk, i) => (
                                <button
                                    key={pk.rounds}
                                    type="button"
                                    onClick={() => setPack(i)}
                                    className={cx("flex-1 rounded-xl py-3 text-center transition duration-100 ease-linear ring-inset", pack === i ? "bg-brand-primary ring-2 ring-brand" : "bg-primary ring-1 ring-secondary hover:ring-brand")}
                                >
                                    <p className={cx("text-lg font-bold tabular-nums", pack === i ? "text-brand-secondary" : "text-primary")}>{pk.rounds}</p>
                                    <p className="text-[10px] font-medium tracking-wide text-tertiary uppercase">rounds</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Details */}
                    <div className="flex flex-col">
                        <ShopBrand />
                        <h1 className="text-display-xs font-semibold tracking-wide text-primary uppercase">{p.rounds}-Round Punch Card</h1>
                        <div className="mt-2 flex items-center gap-2">
                            <StarRating rating={4.8} count={64} />
                        </div>

                        <div className="mt-4 flex items-center gap-2.5">
                            <span className="text-xl font-semibold text-primary tabular-nums">{money(p.price)}</span>
                            <span className="text-md text-tertiary tabular-nums">${p.perRound}.00 / round</span>
                            <Badge color="success" size="md" type="pill-color">
                                Save {money(p.save)}
                            </Badge>
                        </div>

                        <div className="mt-6">
                            <Button color="primary" size="lg" iconLeading={ShoppingCart01} className="w-full">
                                Add to cart · {money(p.price)}
                            </Button>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-3">
                            <Button color="secondary" size="lg" iconLeading={Heart}>
                                Save
                            </Button>
                            <Button color="secondary" size="lg" iconLeading={Share07}>
                                Share
                            </Button>
                        </div>

                        <div className="mt-8">
                            <h2 className="text-lg font-semibold text-primary">How it works</h2>
                            <ul className="mt-3 flex list-disc flex-col gap-1.5 pl-5 text-sm text-secondary marker:text-fg-quaternary">
                                <li>We punch one round automatically each time you check in</li>
                                <li>Show your QR code at the register — no extra payment</li>
                                <li>Save ${p.perRound === 40 ? "10" : p.perRound === 36 ? "14" : "16"} per round versus walk-up rates</li>
                                <li>Valid for one year from purchase</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Your active card */}
                <section className="mt-12 rounded-2xl bg-primary p-6 ring-1 ring-secondary ring-inset sm:p-8">
                    <h2 className="text-lg font-semibold text-primary">Your active card</h2>
                    <div className="mt-5 grid grid-cols-1 gap-8 lg:grid-cols-2">
                        <div className="rounded-2xl border border-secondary bg-secondary p-5">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold text-primary">10-Round Punch Card</p>
                                <span className="text-sm font-semibold text-brand-secondary">6 of 10 left</span>
                            </div>
                            <div className="mt-5">
                                <PunchVisual total={10} used={4} />
                            </div>
                        </div>
                        <div>
                            {qr ? (
                                <div className="flex flex-col items-center gap-4 text-center">
                                    <div className={cx(expired && "opacity-40")}>
                                        <QRCode value="SG-10-4821-token" />
                                    </div>
                                    {expired ? (
                                        <>
                                            <p className="text-md font-semibold text-primary">Code expired</p>
                                            <Button color="primary" size="md" onClick={activate}>
                                                Reactivate code
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-md font-semibold text-primary">Scan at the register</p>
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-warning-secondary px-3 py-1 text-sm font-semibold text-warning-primary tabular-nums">
                                                <Clock className="size-4" aria-hidden="true" /> Expires in {mmss}
                                            </span>
                                        </>
                                    )}
                                    <button type="button" onClick={() => setQr(false)} className="text-sm font-semibold text-secondary underline underline-offset-2">
                                        Back to card
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <Button color="primary" size="lg" className="w-full" onClick={activate}>
                                        Activate QR code
                                    </Button>
                                    <p className="mt-3 flex items-start gap-2 text-xs text-tertiary">
                                        <InfoCircle className="mt-0.5 size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />
                                        Generates a one-time code valid for 5 minutes to scan at the register.
                                    </p>
                                    <div className="mt-4 divide-y divide-secondary border-t border-secondary">
                                        <DetailRow label="Card number" value={<span className="font-mono">#SG-10-4821</span>} />
                                        <DetailRow label="Rate" value="$36.00 / round" />
                                        <DetailRow label="Expires" value="May 2, 2027" />
                                        <DetailRow label="Rounds remaining" value="6 of 10" emphasis />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </section>
            </main>
            <SiteFooter club={SAGAMORE_CLUB} />
        </div>
    );
};

/* ------------------------------ Shop All ------------------------------- */

/** A shop-all-style landing showing just the two card products. */
const CardsShopAll = () => (
    <div className="flex min-h-dvh flex-col bg-secondary">
        <TopNav active="Shop" club={SAGAMORE_CLUB} />
        <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10">
            <header>
                <h1 className="text-display-xs font-semibold text-primary">Gift &amp; punch cards</h1>
                <p className="mt-1.5 text-md text-tertiary">Give the gift of golf, or save with a prepaid round pack.</p>
            </header>
            <p className="mt-4 text-sm text-tertiary">2 items</p>

            <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
                <GiftCardTile />
                <PunchCardTile />
            </div>
        </main>
        <SiteFooter club={SAGAMORE_CLUB} />
    </div>
);

export const ShopAll: Story = { name: "Shop All", render: () => <CardsShopAll /> };
export const GiftCard: Story = { name: "Gift Card", render: () => <GiftCardPage /> };
export const PunchCard: Story = { name: "Punch Card", render: () => <PunchCardPage /> };
