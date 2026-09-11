"use client";

/**
 * `/signin` — the way into the prototype account.
 *
 * Nothing in the prototype is gated, so this screen is never a wall a golfer hits:
 * it is reached from the nav, and any credentials work. Submitting calls `signIn()`,
 * which is what makes the nav show the golfer and unlocks the account pages.
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
import { McgShell } from "../mcg-chrome";
import { useSession, type SessionUser } from "../session";
import { AuthCard, AuthHeading, PrototypeHint } from "./account-ui";

export const SignInScreen = () => {
    const router = useRouter();
    const { signIn } = useSession();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(true);

    const submit = () => {
        // Any credentials succeed. An email that looks like a name gets used for the
        // profile, so a demo can sign in as anyone without a sign-up detour.
        // `signIn` spreads its argument over the demo user, so only send keys we
        // actually have — an explicit `undefined` would blank the seeded value.
        const parts = (email.split("@")[0] ?? "").split(/[._-]/).filter(Boolean);
        const profile: Partial<SessionUser> = {};
        if (email) profile.email = email;
        if (parts.length >= 2) {
            profile.first = cap(parts[0]);
            profile.last = cap(parts[1]);
        }
        signIn(profile);
        router.push("/account/");
    };

    return (
        <McgShell>
            <AuthCard>
                <AuthHeading title="Welcome back" blurb="Sign in to book tee times, lessons and events across all nine county courses." />

                <Form
                    className="mt-7 flex w-full flex-col gap-5"
                    onSubmit={(event) => {
                        event.preventDefault();
                        submit();
                    }}
                >
                    <Input isRequired type="email" name="email" label="Email" placeholder="you@example.com" icon={Mail01} value={email} onChange={setEmail} />
                    <Input isRequired type="password" name="password" label="Password" placeholder="••••••••" value={password} onChange={setPassword} />

                    <div className="flex items-center justify-between gap-4">
                        <Checkbox label="Remember me" isSelected={remember} onChange={setRemember} />
                        <Link href="/forgot-password" className="text-sm font-semibold text-brand-secondary transition duration-100 ease-linear hover:text-brand-secondary_hover">
                            Forgot password?
                        </Link>
                    </div>

                    <Button type="submit" size="lg" className="w-full">
                        Sign in
                    </Button>

                    <div className="flex flex-col items-center gap-3">
                        <span className="text-sm text-tertiary">Or continue with</span>
                        <div className="flex justify-center gap-3">
                            <SocialButton social="google" theme="color" aria-label="Continue with Google" onClick={submit} />
                            <SocialButton social="apple" theme="color" aria-label="Continue with Apple" onClick={submit} />
                        </div>
                    </div>

                    <PrototypeHint>
                        This is a prototype — any email and password will sign you in. Use <span className="font-semibold text-secondary">any details you like</span>, or
                        leave the fields as they are and press Sign in.
                    </PrototypeHint>
                </Form>

                <p className="mt-6 text-center text-sm text-tertiary">
                    New to Montgomery County Golf?{" "}
                    <Link href="/signup" className="font-semibold text-brand-secondary transition duration-100 ease-linear hover:text-brand-secondary_hover">
                        Create an account
                    </Link>
                </p>
            </AuthCard>
        </McgShell>
    );
};

const cap = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);
