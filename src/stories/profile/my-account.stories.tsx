import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { type ReactNode, useState } from "react";
import { Award01, CreditCard01, Download01, File02, Plus, XClose } from "@untitledui/icons";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { cx } from "@/utils/cx";
import { MEMBER, ProfileShell } from "./profile-shell";

/** "Add payment method" dialog — a conventional card-entry form (opened from My Account). */
const AddPaymentModal = ({ onClose }: { onClose: () => void }) => {
    const [num, setNum] = useState("");
    const [exp, setExp] = useState("");
    const [cvc, setCvc] = useState("");
    const [name, setName] = useState("");
    const [zip, setZip] = useState("");
    const [isDefault, setIsDefault] = useState(true);
    return (
        <>
            <div className="flex items-center justify-between border-b border-secondary px-5 py-4">
                <h2 className="text-md font-semibold text-primary">Add payment method</h2>
                <button type="button" onClick={onClose} aria-label="Close" className="flex size-8 items-center justify-center rounded-lg text-fg-quaternary transition duration-100 ease-linear hover:bg-primary_hover">
                    <XClose className="size-5" aria-hidden="true" />
                </button>
            </div>
            <div className="flex flex-col gap-4 p-5">
                <Input label="Card number" placeholder="1234 1234 1234 1234" icon={CreditCard01} value={num} onChange={setNum} inputMode="numeric" />
                <div className="grid grid-cols-2 gap-4">
                    <Input label="Expiry" placeholder="MM / YY" value={exp} onChange={setExp} />
                    <Input label="CVC" placeholder="123" value={cvc} onChange={setCvc} inputMode="numeric" />
                </div>
                <Input label="Name on card" placeholder="Justin Girard" value={name} onChange={setName} />
                <Input label="Billing ZIP" placeholder="01940" value={zip} onChange={setZip} inputMode="numeric" />
                <Checkbox label="Set as default payment method" isSelected={isDefault} onChange={setIsDefault} />
            </div>
            <div className="flex justify-end gap-2 border-t border-secondary px-5 py-4">
                <Button color="secondary" size="md" onClick={onClose}>
                    Cancel
                </Button>
                <Button color="primary" size="md" onClick={onClose}>
                    Add card
                </Button>
            </div>
        </>
    );
};

/**
 * "Profile / My Account" — the Airbnb-style inline-edit surface. Each field shows
 * its value with an Edit/Add link; clicking expands that row into a form (Save /
 * Cancel) and dims the others so only one edit is open at a time. Payment methods,
 * membership, and documents follow beneath. Re-skinned with design-system tokens.
 */
const meta: Meta = {
    title: "Profile ∕ Account/My Account",
    parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

type Values = {
    first: string;
    last: string;
    preferred: string;
    email: string;
    phone: string;
    handicap: string;
    address: string;
    emergency: string;
};

const Panel = ({ title, children }: { title: string; children: ReactNode }) => (
    <section>
        <h2 className="text-display-xs font-semibold text-primary">{title}</h2>
        <div className="mt-5 rounded-2xl bg-primary px-5 ring-1 ring-secondary ring-inset">{children}</div>
    </section>
);

const AccountScreen = () => {
    const [values, setValues] = useState<Values>({
        first: MEMBER.firstName,
        last: MEMBER.lastName,
        preferred: MEMBER.preferred,
        email: MEMBER.email,
        phone: MEMBER.phone,
        handicap: MEMBER.handicap,
        address: MEMBER.address,
        emergency: "",
    });
    const [editing, setEditing] = useState<string | null>(null);
    const [draft, setDraft] = useState<Values>(values);
    const [payOpen, setPayOpen] = useState(false);
    const anyEditing = editing !== null;

    const open = (id: string) => {
        setDraft(values);
        setEditing(id);
    };
    const save = () => {
        setValues(draft);
        setEditing(null);
    };
    const set = (k: keyof Values, v: string) => setDraft((d) => ({ ...d, [k]: v }));

    /** One inline-editable row — value + Edit/Add, or the editor when open. */
    const Field = ({
        id,
        label,
        display,
        editable = true,
        actionLabel = "Edit",
        hint,
        children,
    }: {
        id: string;
        label: string;
        display: ReactNode;
        editable?: boolean;
        actionLabel?: string;
        hint?: string;
        children?: ReactNode;
    }) => {
        const isEditing = editing === id;
        const dim = anyEditing && !isEditing;
        return (
            <div className={cx("border-t border-secondary py-5 transition duration-100 ease-linear first:border-t-0", dim && "opacity-40")}>
                <div className="flex items-start justify-between gap-4">
                    <p className="text-md font-semibold text-primary">{label}</p>
                    {editable &&
                        (isEditing ? (
                            <button type="button" onClick={() => setEditing(null)} className="shrink-0 text-sm font-semibold text-secondary underline underline-offset-2">
                                Cancel
                            </button>
                        ) : (
                            <button
                                type="button"
                                disabled={dim}
                                onClick={() => open(id)}
                                className="shrink-0 text-sm font-semibold text-secondary underline underline-offset-2 transition duration-100 ease-linear hover:text-primary disabled:opacity-50"
                            >
                                {actionLabel}
                            </button>
                        ))}
                </div>
                {isEditing ? (
                    <div className="mt-4 max-w-lg">
                        {hint && <p className="mb-3 text-sm text-tertiary">{hint}</p>}
                        {children}
                        <Button size="md" color="primary" className="mt-4" onClick={save}>
                            Save
                        </Button>
                    </div>
                ) : (
                    <div className="mt-1 text-md text-tertiary">{display}</div>
                )}
            </div>
        );
    };

    return (
        <ProfileShell active="account">
            <div className="flex flex-col gap-10">
                <Panel title="Personal information">
                    <Field
                        id="name"
                        label="Legal name"
                        display={`${values.first} ${values.last}`}
                        hint="Your calendar may be blocked briefly while we verify a new legal name."
                    >
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <Input label="First name on ID" value={draft.first} onChange={(v) => set("first", v)} />
                            <Input label="Last name on ID" value={draft.last} onChange={(v) => set("last", v)} />
                        </div>
                    </Field>

                    <Field id="preferred" label="Preferred first name" display={values.preferred}>
                        <Input label="Preferred first name" value={draft.preferred} onChange={(v) => set("preferred", v)} />
                    </Field>

                    <Field id="email" label="Email address" display={values.email}>
                        <Input label="Email address" type="email" value={draft.email} onChange={(v) => set("email", v)} />
                    </Field>

                    <Field
                        id="phone"
                        label="Phone number"
                        display={
                            <>
                                <p>{values.phone}</p>
                                <p className="mt-1 text-sm text-tertiary">Used for tee-time reminders and event updates.</p>
                            </>
                        }
                    >
                        <Input label="Phone number" type="tel" value={draft.phone} onChange={(v) => set("phone", v)} />
                    </Field>

                    <Field id="handicap" label="Handicap index" display={values.handicap} hint="Used for events, leagues, and net scoring.">
                        <Input label="Handicap index" value={draft.handicap} onChange={(v) => set("handicap", v)} />
                    </Field>

                    <Field id="member" label="Member number" display={MEMBER.memberNo} editable={false} />

                    <Field id="club" label="Home club" display={MEMBER.homeClub} editable={false} />

                    <Field id="address" label="Residential address" display={values.address}>
                        <Input label="Residential address" value={draft.address} onChange={(v) => set("address", v)} />
                    </Field>

                    <Field
                        id="emergency"
                        label="Emergency contact"
                        display={values.emergency || <span className="text-quaternary">Not provided</span>}
                        actionLabel={values.emergency ? "Edit" : "Add"}
                    >
                        <Input label="Name and phone" placeholder="Jane Doe · +1 (555) 000-0000" value={draft.emergency} onChange={(v) => set("emergency", v)} />
                    </Field>
                </Panel>

                {/* Payment methods */}
                <Panel title="Payment methods">
                    <div className="flex items-center gap-3 border-t border-secondary py-5 first:border-t-0">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary ring-1 ring-secondary ring-inset">
                            <CreditCard01 className="size-5 text-fg-secondary" aria-hidden="true" />
                        </span>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-primary">Visa ···· 0497</p>
                            <p className="text-sm text-tertiary tabular-nums">Expires 06/2028</p>
                        </div>
                        <button type="button" className="text-sm font-semibold text-secondary underline underline-offset-2 hover:text-primary">
                            Edit
                        </button>
                    </div>
                    <div className="border-t border-secondary py-5">
                        <Button color="secondary" size="md" iconLeading={Plus} onClick={() => setPayOpen(true)}>
                            Add payment method
                        </Button>
                    </div>
                </Panel>

                {/* Membership */}
                <Panel title="Membership">
                    <div className="flex items-center gap-4 border-t border-secondary py-5 first:border-t-0">
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-primary ring-1 ring-secondary ring-inset">
                            <Award01 className="size-5 text-fg-brand-primary" aria-hidden="true" />
                        </span>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-primary">{MEMBER.tier}</p>
                            <p className="text-sm text-tertiary">
                                Member since {MEMBER.since} · No. {MEMBER.memberNo}
                            </p>
                        </div>
                        <Button color="secondary" size="sm">
                            Manage
                        </Button>
                    </div>
                </Panel>

                {/* Documents */}
                <Panel title="Documents">
                    {["Membership Agreement.pdf", "2026 Member Statement.pdf"].map((doc, i) => (
                        <div key={doc} className={cx("flex items-center gap-3 py-4", i > 0 && "border-t border-secondary")}>
                            <File02 className="size-5 shrink-0 text-fg-quaternary" aria-hidden="true" />
                            <span className="flex-1 text-sm font-medium text-primary">{doc}</span>
                            <Button color="link-color" size="sm" iconLeading={Download01}>
                                Download
                            </Button>
                        </div>
                    ))}
                </Panel>
            </div>

            <ModalOverlay isOpen={payOpen} onOpenChange={setPayOpen}>
                <Modal className="max-w-md">
                    <Dialog className="overflow-hidden rounded-2xl bg-primary shadow-xl ring-1 ring-secondary_alt">
                        <AddPaymentModal onClose={() => setPayOpen(false)} />
                    </Dialog>
                </Modal>
            </ModalOverlay>
        </ProfileShell>
    );
};

export const Default: Story = {
    name: "My Account",
    render: () => <AccountScreen />,
};
