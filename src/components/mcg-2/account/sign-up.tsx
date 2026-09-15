"use client";

/**
 * `/signup` — create an MCG account.
 *
 * Two things here are county-specific rather than generic sign-up furniture:
 *
 *  - **The resident checkbox.** Montgomery County residents pay a lower green fee at
 *    all nine courses, so residency is asked for at the point of account creation
 *    rather than buried in settings — it changes the price the golfer sees on the tee
 *    sheet from their very first search.
 *  - **Verification comes next, not later.** Submitting signs the golfer in and sends
 *    them to `/verify`, matching how the live system confirms an email before a first
 *    booking. Browsing stays open the whole time.
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Mail01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { SocialButton } from "@/components/base/buttons/social-button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Form } from "@/components/base/form/form";
import { Input } from "@/components/base/input/input";
import { cx } from "@/utils/cx";
import { McgShell } from "../mcg-chrome";
import { useSession } from "../session";
import { AuthCard, AuthHeading, PrototypeHint, useResident } from "./account-ui";

/* ------------------------------------------------------------------ */
/* Password strength                                                   */
/* ------------------------------------------------------------------ */

const RULES: { label: string; test: (value: string) => boolean }[] = [
    { label: "At least 8 characters", test: (v) => v.length >= 8 },
    { label: "One uppercase letter", test: (v) => /[A-Z]/.test(v) },
    { label: "One number", test: (v) => /\d/.test(v) },
    { label: "One special character", test: (v) => /[^A-Za-z0-9]/.test(v) },
];

const STRENGTH = ["Too short", "Weak", "Fair", "Good", "Strong"] as const;

/** Four rules, four bars — the meter is the checklist, so the two can never disagree. */
const StrengthMeter = ({ value }: { value: string }) => {
    const passed = RULES.filter((rule) => rule.test(value)).length;
    const score = value.length === 0 ? 0 : passed;
    const tone = score >= 4 ? "bg-success-solid" : score >= 3 ? "bg-brand-solid" : score >= 2 ? "bg-warning-solid" : "bg-error-solid";

    return (
        <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-3">
                <div className="flex flex-1 gap-1.5">
                    {RULES.map((rule, index) => (
                        <span key={rule.label} className={cx("h-1.5 flex-1 rounded-full", index < score ? tone : "bg-quaternary")} />
                    ))}
                </div>
                <span className="w-16 shrink-0 text-right text-xs font-semibold text-tertiary">{value.length === 0 ? "" : STRENGTH[score]}</span>
            </div>
            <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                {RULES.map((rule) => {
                    const ok = rule.test(value);
                    return (
                        <li key={rule.label} className={cx("flex items-center gap-1.5 text-xs", ok ? "text-success-primary" : "text-tertiary")}>
                            <span className={cx("size-1.5 rounded-full", ok ? "bg-success-solid" : "bg-quaternary")} aria-hidden="true" />
                            {rule.label}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

/* ------------------------------------------------------------------ */
/* Screen                                                              */
/* ------------------------------------------------------------------ */

export const SignUpScreen = () => {
    const router = useRouter();
    const { signIn } = useSession();
    const [first, setFirst] = useState("");
    const [last, setLast] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [resident, setResident] = useResident(true);
    const [terms, setTerms] = useState(false);

    const submit = () => {
        signIn({
            first: first || "Justin",
            last: last || "Girard",
            email: email || "hello@girardjustin.com",
            isNew: true,
        });
        router.push("/verify/");
    };

    return (
        <McgShell>
            <AuthCard>
                <AuthHeading title="Create your account" blurb="One login for tee times, lessons, events and the Pro Shop at every county course." />

                <Form
                    className="mt-7 flex w-full flex-col gap-5"
                    onSubmit={(event) => {
                        event.preventDefault();
                        submit();
                    }}
                >
                    <div className="grid grid-cols-2 gap-4">
                        <Input isRequired label="First name" placeholder="Justin" value={first} onChange={setFirst} />
                        <Input isRequired label="Last name" placeholder="Girard" value={last} onChange={setLast} />
                    </div>

                    <Input isRequired type="email" label="Email" placeholder="you@example.com" icon={Mail01} value={email} onChange={setEmail} />

                    <div className="flex flex-col gap-3">
                        <Input isRequired type="password" label="Password" placeholder="Create a password" value={password} onChange={setPassword} />
                        <StrengthMeter value={password} />
                    </div>

                    <div className="flex flex-col gap-3 rounded-xl bg-secondary_subtle p-4 ring-1 ring-secondary ring-inset">
                        <Checkbox
                            label="I live in Montgomery County"
                            hint="County residents pay the resident green fee — up to $18 less a round — at all nine courses. You’ll be asked to verify your address before your first resident-rate booking."
                            isSelected={resident}
                            onChange={setResident}
                        />
                    </div>

                    <Checkbox
                        label="I agree to the Terms of Use and Privacy Policy"
                        hint="Including the cancellation and no-show policy for tee times and lessons."
                        isSelected={terms}
                        onChange={setTerms}
                    />

                    <Button type="submit" size="lg" className="w-full" isDisabled={!terms}>
                        Create account
                    </Button>

                    <div className="flex flex-col items-center gap-3">
                        <span className="text-sm text-tertiary">Or sign up with</span>
                        <div className="flex justify-center gap-3">
                            <SocialButton social="google" theme="color" aria-label="Sign up with Google" onClick={submit} />
                            <SocialButton social="apple" theme="color" aria-label="Sign up with Apple" onClick={submit} />
                        </div>
                    </div>

                    <PrototypeHint>
                        This is a prototype — nothing is saved to a server and no email is sent. Tick the terms box and press Create account to see the verification step.
                    </PrototypeHint>
                </Form>

                <p className="mt-6 text-center text-sm text-tertiary">
                    Already have an account?{" "}
                    <Link href="/signin" className="font-semibold text-brand-secondary transition duration-100 ease-linear hover:text-brand-secondary_hover">
                        Sign in
                    </Link>
                </p>
            </AuthCard>
        </McgShell>
    );
};
