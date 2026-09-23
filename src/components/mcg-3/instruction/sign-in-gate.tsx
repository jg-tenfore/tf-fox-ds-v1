"use client";

/**
 * Prototype 3 — the account every booking is attached to.
 *
 * MCG's line: "I want to make sure we're collecting data on these sales for marketing
 * purposes and don't want customers to be able to book without us collecting that
 * information. Do like how they can get to this point without signing in though."
 *
 * So browsing, filtering and choosing stay open to anyone, and the account is settled at
 * the last step — inside the page, never as a redirect. Nothing already chosen is lost,
 * and signing in fills the contact details from the account instead of asking twice.
 *
 * Shared by lesson checkout, clinic registration and program enrolment so all three
 * collect the same thing.
 */
import { useState } from "react";
import { CheckCircle } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { useSession } from "@/components/mcg-3/session";
import { cx } from "@/utils/cx";

export interface SignInGateProps {
    /** What the golfer is about to book, for the heading. */
    what?: string;
    /** Prefills, and receives the email as it's typed so the form below stays in step. */
    email: string;
    onEmail: (email: string) => void;
    first?: string;
    last?: string;
    onName?: (patch: { first?: string; last?: string }) => void;
}

export const SignInGate = ({ what = "booking", email, onEmail, first = "", last = "", onName }: SignInGateProps) => {
    const { user, signIn } = useSession();
    const [password, setPassword] = useState("");
    const [mode, setMode] = useState<"signin" | "create">("signin");

    if (user) {
        return (
            <section className="flex items-center gap-3 rounded-xl bg-success-primary p-4 ring-1 ring-secondary ring-inset">
                <CheckCircle className="size-5 shrink-0 text-fg-success-primary" aria-hidden="true" />
                <p className="text-sm text-secondary">
                    Signed in as <span className="font-semibold text-primary">{user.email}</span> — this {what} will be saved to your MCG account.
                </p>
            </section>
        );
    }

    return (
        <section className="flex flex-col gap-4 rounded-xl bg-secondary p-5 ring-1 ring-secondary ring-inset">
            <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold text-primary">Sign in to finish {what === "booking" ? "booking" : `this ${what}`}</h2>
                <p className="text-sm text-tertiary">
                    Every {what} is saved to an MCG account, so your instructor, credits and history stay together. Your place is held — nothing you&rsquo;ve chosen is
                    lost.
                </p>
            </div>

            <div className="flex gap-1 rounded-lg bg-primary p-1 ring-1 ring-secondary ring-inset">
                {[
                    { id: "signin" as const, label: "I have an account" },
                    { id: "create" as const, label: "Create an account" },
                ].map((o) => (
                    <button
                        key={o.id}
                        type="button"
                        aria-pressed={mode === o.id}
                        onClick={() => setMode(o.id)}
                        className={cx(
                            "flex-1 rounded-md px-3 py-2 text-sm font-semibold transition duration-100 ease-linear",
                            mode === o.id ? "bg-brand-solid text-white" : "text-tertiary hover:text-secondary",
                        )}
                    >
                        {o.label}
                    </button>
                ))}
            </div>

            <Input label="Email" type="email" value={email} onChange={onEmail} isRequired />
            {mode === "create" && onName && (
                <div className="grid gap-3 sm:grid-cols-2">
                    <Input label="First name" value={first} onChange={(v) => onName({ first: v })} isRequired />
                    <Input label="Last name" value={last} onChange={(v) => onName({ last: v })} isRequired />
                </div>
            )}
            <Input label="Password" type="password" value={password} onChange={setPassword} isRequired />

            <Button
                size="lg"
                color="primary"
                className="w-fit"
                isDisabled={!email.trim() || !password.trim()}
                onClick={() => signIn({ email, first: first || undefined, last: last || undefined })}
            >
                {mode === "signin" ? "Sign in and continue" : "Create account and continue"}
            </Button>
            <p className="text-xs text-tertiary">
                Booking for someone else? Sign in as yourself — you&rsquo;ll enter their details below, and it still lands in your account.
            </p>
        </section>
    );
};
