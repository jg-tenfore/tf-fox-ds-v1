import { useEffect, useMemo, useState } from "react";
import { Check, Clock, Gift01, InfoCircle, Plus, Ticket02, XClose } from "@untitledui/icons";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { SagamoreLogo } from "@/components/foundations/sagamore/sagamore-logo";
import { CreditCard } from "@/components/shared-assets/credit-card/credit-card";
import { cx } from "@/utils/cx";
import { money, Panel, Progress, Segmented } from "./profile-ui";
import { ProfileShell } from "./profile-shell";

/**
 * "Profile / Wallet" experience — balance, gift cards, and punch cards, with the
 * gift-card purchase and punch-card (activatable QR + timer) flows in modals opened
 * from the page. Shared by the Wallet / Buy Gift Card / Punch Cards stories.
 */

/* --------------------------------- QR ---------------------------------- */

/** A convincing faux QR code — deterministic pattern + three finder squares. */
const QRCode = ({ value, size = 220 }: { value: string; size?: number }) => {
    const N = 25;
    const cells = useMemo(() => {
        const hash = (n: number) => {
            let h = 2166136261;
            const s = value + ":" + n;
            for (let i = 0; i < s.length; i++) {
                h ^= s.charCodeAt(i);
                h = Math.imul(h, 16777619);
            }
            return h >>> 0;
        };
        const finderOn = (r: number, c: number) => {
            const lr = r >= N - 7 ? r - (N - 7) : r;
            const lc = c >= N - 7 ? c - (N - 7) : c;
            const border = lr === 0 || lr === 6 || lc === 0 || lc === 6;
            const center = lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4;
            return border || center;
        };
        const inFinder = (r: number, c: number) => {
            const box = (r0: number, c0: number) => r >= r0 && r < r0 + 7 && c >= c0 && c < c0 + 7;
            return box(0, 0) || box(0, N - 7) || box(N - 7, 0);
        };
        return Array.from({ length: N * N }, (_, i) => {
            const r = Math.floor(i / N);
            const c = i % N;
            if (inFinder(r, c)) return finderOn(r, c);
            return hash(r * N + c) % 100 < 47;
        });
    }, [value]);

    return (
        <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-secondary" style={{ width: size, height: size }}>
            <div className="grid size-full" style={{ gridTemplateColumns: `repeat(${N}, 1fr)`, gridTemplateRows: `repeat(${N}, 1fr)` }}>
                {cells.map((on, i) => (
                    <span key={i} className={on ? "bg-black" : "bg-white"} />
                ))}
            </div>
        </div>
    );
};

const ModalHeader = ({ title, onClose }: { title: string; onClose: () => void }) => (
    <div className="flex items-center justify-between border-b border-secondary px-5 py-4">
        <h2 className="text-md font-semibold text-primary">{title}</h2>
        <button type="button" onClick={onClose} aria-label="Close" className="flex size-8 items-center justify-center rounded-lg text-fg-quaternary transition duration-100 ease-linear hover:bg-primary_hover">
            <XClose className="size-5" aria-hidden="true" />
        </button>
    </div>
);

/* ---------------------------- Punch card modal ------------------------- */

const PunchVisual = ({ total, used }: { total: number; used: number }) => (
    <div className="grid grid-cols-5 justify-items-center gap-x-2.5 gap-y-4">
        {Array.from({ length: total }).map((_, i) => {
            const isUsed = i < used;
            return (
                <span key={i} className={cx("flex size-11 items-center justify-center rounded-full text-sm font-semibold", isUsed ? "bg-brand-solid text-white" : "bg-primary text-tertiary ring-1 ring-secondary ring-inset")}>
                    {isUsed ? <Check className="size-5 stroke-[3]" aria-hidden="true" /> : i + 1}
                </span>
            );
        })}
    </div>
);

const PACKS = [
    { label: "5-Round Pass", price: 200, perRound: 40, save: 25 },
    { label: "10-Round Pass", price: 360, perRound: 36, save: 90, best: true },
];

const PunchCardModal = ({ onClose, qrActive = false }: { onClose: () => void; qrActive?: boolean }) => {
    const [qr, setQr] = useState(qrActive);
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

    if (qr) {
        return (
            <>
                <ModalHeader title="Punch card check-in" onClose={onClose} />
                <div className="flex flex-col items-center gap-4 p-6 text-center">
                    <div className={cx(expired && "opacity-40")}>
                        <QRCode value="SG-10-4821-token" />
                    </div>
                    {expired ? (
                        <>
                            <p className="text-md font-semibold text-primary">Code expired</p>
                            <p className="-mt-2 text-sm text-tertiary">Reactivate to scan again.</p>
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
                    <p className="text-xs text-tertiary">
                        Card <span className="font-mono">#SG-10-4821</span> · one round will be punched
                    </p>
                    <button type="button" onClick={() => setQr(false)} className="text-sm font-semibold text-secondary underline underline-offset-2">
                        Back to card
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            <ModalHeader title="10-Round Punch Card" onClose={onClose} />
            <div className="flex flex-col gap-5 p-5">
                <div className="rounded-2xl border border-secondary bg-secondary p-5">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-primary">10-Round Punch Card</p>
                        <span className="text-sm font-semibold text-brand-secondary">6 of 10 left</span>
                    </div>
                    <div className="mt-5">
                        <PunchVisual total={10} used={4} />
                    </div>
                </div>

                <Button color="primary" size="lg" className="w-full" onClick={activate}>
                    Activate QR code
                </Button>
                <p className="-mt-3 flex items-start gap-2 text-xs text-tertiary">
                    <InfoCircle className="mt-0.5 size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />
                    Generates a one-time code valid for 5 minutes. Show it at the register to punch a round.
                </p>

                <div className="border-t border-secondary pt-4">
                    <p className="text-sm font-semibold text-primary">Buy another card</p>
                    <div className="mt-3 flex flex-col gap-2.5">
                        {PACKS.map((p) => (
                            <div key={p.label} className="flex items-center gap-3 rounded-xl bg-primary p-3 ring-1 ring-secondary ring-inset">
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-primary">{p.label}</p>
                                    <p className="text-xs text-tertiary tabular-nums">
                                        ${p.perRound}.00 / round · save {money(p.save)}
                                    </p>
                                </div>
                                <Button color="secondary" size="sm">
                                    {money(p.price)}
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

/* ---------------------------- Gift card modal -------------------------- */

const PRESETS = [50, 100, 150, 250];

const GiftCardModal = ({ onClose }: { onClose: () => void }) => {
    const [amount, setAmount] = useState(100);
    const [custom, setCustom] = useState("");
    const [method, setMethod] = useState<"email" | "self">("email");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const value = custom ? Math.max(0, Number(custom) || 0) : amount;

    return (
        <>
            <ModalHeader title="Buy a gift card" onClose={onClose} />
            <div className="flex flex-col gap-5 p-5">
                <div className="flex justify-center">
                    <CreditCard
                        type="brand-dark"
                        company="Sagamore Gift Card"
                        cardHolder={method === "email" && name ? `To ${name}` : "Gift Card"}
                        cardNumber={money(value)}
                        cardExpiration="No expiry"
                        logo={<SagamoreLogo className="max-h-7 max-w-full object-contain" />}
                    />
                </div>

                <div>
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
                                    className={cx(
                                        "rounded-xl py-2.5 text-center text-sm font-semibold tabular-nums ring-1 transition duration-100 ease-linear ring-inset",
                                        active ? "bg-brand-primary text-brand-secondary ring-brand" : "bg-primary text-secondary ring-secondary hover:bg-primary_hover",
                                    )}
                                >
                                    ${p}
                                </button>
                            );
                        })}
                    </div>
                    <div className="mt-3">
                        <Input label="Custom amount" placeholder="$—" value={custom} onChange={setCustom} inputMode="numeric" />
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <Segmented
                        options={[
                            { key: "email", label: "Email a recipient" },
                            { key: "self", label: "Add to my balance" },
                        ]}
                        value={method}
                        onChange={setMethod}
                    />
                    {method === "email" ? (
                        <div className="flex flex-col gap-3">
                            <Input label="Recipient name" placeholder="Jane Doe" value={name} onChange={setName} />
                            <Input label="Recipient email" type="email" placeholder="jane@email.com" value={email} onChange={setEmail} />
                            <Input label="Message (optional)" placeholder="Happy birthday!" value={message} onChange={setMessage} />
                        </div>
                    ) : (
                        <p className="text-sm text-tertiary">The full amount is added to your Sagamore balance after checkout.</p>
                    )}
                </div>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-secondary px-5 py-4">
                <span className="text-sm">
                    <span className="text-tertiary">Total </span>
                    <span className="font-semibold text-primary tabular-nums">{money(value)}</span>
                </span>
                <Button color="primary" size="md" isDisabled={value <= 0}>
                    Continue to payment
                </Button>
            </div>
        </>
    );
};

/* ------------------------------ Wallet page ---------------------------- */

const BALANCE = 142.5;
const ACTIVITY = [
    { date: "Jul 5", desc: "Pro Shop credit", amount: 25.0 },
    { date: "Jul 1", desc: "Applied to monthly dues", amount: -50.0 },
    { date: "Jun 15", desc: "Gift card redeemed", amount: 100.0 },
];
const PUNCH = [
    { label: "Range Balls — Large Bucket", used: 4, total: 10 },
    { label: "Simulator Hours", used: 3, total: 5 },
];

export const WalletExperience = ({ initialModal, punchQR }: { initialModal?: "gift" | "punch"; punchQR?: boolean }) => {
    const [modal, setModal] = useState<"gift" | "punch" | null>(initialModal ?? null);
    const [qrStart, setQrStart] = useState(punchQR ?? false);
    const openPunch = (qr: boolean) => {
        setQrStart(qr);
        setModal("punch");
    };

    return (
        <ProfileShell active="wallet">
            <div className="flex flex-col gap-10">
                <Panel title="My Balance">
                    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-secondary py-5">
                        <div>
                            <p className="text-xs font-medium tracking-wide text-quaternary uppercase">Available balance</p>
                            <p className="mt-1 text-display-sm font-semibold text-primary tabular-nums">{money(BALANCE)}</p>
                        </div>
                        <div className="flex gap-2.5">
                            <Button color="secondary" size="md">Statement</Button>
                            <Button color="primary" size="md" iconLeading={Plus}>Add funds</Button>
                        </div>
                    </div>
                    <div className="divide-y divide-secondary">
                        {ACTIVITY.map((a, i) => (
                            <div key={i} className="flex items-center gap-3 py-3.5">
                                <span className="w-12 shrink-0 text-xs font-medium text-tertiary tabular-nums">{a.date}</span>
                                <span className="min-w-0 flex-1 truncate text-sm text-primary">{a.desc}</span>
                                <span className={cx("text-sm font-semibold tabular-nums", a.amount >= 0 ? "text-success-primary" : "text-primary")}>
                                    {a.amount >= 0 ? "+" : "−"}
                                    {money(Math.abs(a.amount))}
                                </span>
                            </div>
                        ))}
                    </div>
                </Panel>

                <Panel title="Gift cards" action={<Button color="secondary" size="sm" iconLeading={Plus} onClick={() => setModal("gift")}>Buy gift card</Button>}>
                    <div className="flex items-center gap-4 py-5">
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand-primary">
                            <Gift01 className="size-5 text-fg-brand-primary" aria-hidden="true" />
                        </span>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-primary">Sagamore Gift Card</p>
                            <p className="text-sm text-tertiary tabular-nums">···· 4821</p>
                        </div>
                        <span className="text-md font-semibold text-primary tabular-nums">{money(75.0)}</span>
                    </div>
                </Panel>

                <Panel title="Punch cards" action={<Button color="secondary" size="sm" iconLeading={Plus} onClick={() => openPunch(false)}>Buy punch card</Button>}>
                    <div className="divide-y divide-secondary">
                        {PUNCH.map((p) => {
                            const left = p.total - p.used;
                            return (
                                <div key={p.label} className="flex items-center gap-4 py-5">
                                    <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-utility-orange-50">
                                        <Ticket02 className="size-5 text-utility-orange-700" aria-hidden="true" />
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between gap-3">
                                            <p className="truncate text-sm font-semibold text-primary">{p.label}</p>
                                            <p className="shrink-0 text-sm text-tertiary tabular-nums">
                                                {left} of {p.total} left
                                            </p>
                                        </div>
                                        <div className="mt-2">
                                            <Progress value={left / p.total} />
                                        </div>
                                    </div>
                                    <div className="flex shrink-0 gap-2">
                                        <Button color="secondary" size="sm" onClick={() => openPunch(false)}>
                                            View
                                        </Button>
                                        <Button color="primary" size="sm" onClick={() => openPunch(true)}>
                                            Show QR
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Panel>
            </div>

            <ModalOverlay isOpen={modal === "gift"} onOpenChange={(o) => !o && setModal(null)}>
                <Modal className="max-w-md">
                    <Dialog className="max-h-[85vh] overflow-y-auto rounded-2xl bg-primary shadow-xl ring-1 ring-secondary_alt">
                        <GiftCardModal onClose={() => setModal(null)} />
                    </Dialog>
                </Modal>
            </ModalOverlay>

            <ModalOverlay isOpen={modal === "punch"} onOpenChange={(o) => !o && setModal(null)}>
                <Modal className="max-w-md">
                    <Dialog className="max-h-[85vh] overflow-y-auto rounded-2xl bg-primary shadow-xl ring-1 ring-secondary_alt">
                        <PunchCardModal onClose={() => setModal(null)} qrActive={qrStart} />
                    </Dialog>
                </Modal>
            </ModalOverlay>
        </ProfileShell>
    );
};
