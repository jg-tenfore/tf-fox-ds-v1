"use client";

import { useState } from "react";
import { CreditCard01, Lock01, XClose } from "@untitledui/icons";
import { Button as AriaButton } from "react-aria-components";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { cx } from "@/utils/cx";
import { focusRing } from "../kit";
import { brandOf, type SavedPayment } from "./checkout-data";

/**
 * "Use a different card" — Crane's `PaymentDialog`, cut down to what a pack checkout needs: card
 * number, expiry, CVC, name. Prototype only: nothing is validated beyond "looks filled in", and the
 * card is kept for this checkout.
 */
export const AddCardDialog = ({ isOpen, onOpenChange, onSave, defaultName }: { isOpen: boolean; onOpenChange: (open: boolean) => void; onSave: (p: SavedPayment) => void; defaultName: string }) => {
    const [number, setNumber] = useState("");
    const [exp, setExp] = useState("");
    const [cvc, setCvc] = useState("");
    const [name, setName] = useState(defaultName);
    const digits = number.replace(/\D/g, "");
    const ready = digits.length >= 12 && exp.trim().length >= 4 && cvc.trim().length >= 3 && name.trim().length > 0;

    const save = (close: () => void) => {
        if (!ready) return;
        const brand = brandOf(digits);
        onSave({ id: `pm-new-${digits.slice(-4)}-${Date.now()}`, brand, name: brand === "Amex" ? "American Express" : brand, last4: digits.slice(-4) });
        close();
    };

    return (
        <ModalOverlay isOpen={isOpen} onOpenChange={onOpenChange} isDismissable>
            <Modal className="max-w-md">
                <Dialog aria-label="Add a card" className="overflow-hidden rounded-2xl bg-primary shadow-xl ring-1 ring-secondary_alt">
                    {({ close }) => (
                        <form
                            className="flex w-full flex-col"
                            onSubmit={(e) => {
                                e.preventDefault();
                                save(close);
                            }}
                        >
                            <header className="flex items-start gap-3 px-6 pt-6">
                                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-primary_alt">
                                    <CreditCard01 className="size-5 text-fg-brand-primary" aria-hidden="true" />
                                </span>
                                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                                    <h2 className="text-lg font-semibold text-primary">Add a card</h2>
                                    <p className="text-sm text-tertiary">Saved to your MCG account for this and future purchases.</p>
                                </div>
                                <AriaButton onPress={close} aria-label="Close" className={cx("rounded-lg p-1.5 text-fg-quaternary hover:bg-primary_hover", focusRing)}>
                                    <XClose className="size-5" aria-hidden="true" />
                                </AriaButton>
                            </header>
                            <div className="flex flex-col gap-4 px-6 py-5">
                                <Input label="Card number" placeholder="1234 1234 1234 1234" inputMode="numeric" value={number} onChange={setNumber} isRequired autoFocus />
                                <div className="grid grid-cols-2 gap-3">
                                    <Input label="Expiry" placeholder="MM / YY" value={exp} onChange={setExp} isRequired />
                                    <Input label="CVC" placeholder="123" inputMode="numeric" value={cvc} onChange={setCvc} isRequired />
                                </div>
                                <Input label="Name on card" value={name} onChange={setName} isRequired />
                                <p className="flex items-center gap-1.5 text-xs text-tertiary">
                                    <Lock01 className="size-3.5" aria-hidden="true" /> Sample checkout — no card is charged.
                                </p>
                            </div>
                            <footer className="flex justify-end gap-3 border-t border-secondary px-6 py-4">
                                <Button color="secondary" size="md" onClick={close}>
                                    Cancel
                                </Button>
                                <Button type="submit" size="md" isDisabled={!ready}>
                                    Save card
                                </Button>
                            </footer>
                        </form>
                    )}
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
};
