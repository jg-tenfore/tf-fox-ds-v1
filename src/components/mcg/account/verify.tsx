"use client";

/**
 * `/verify` — confirm the email address on a brand-new account.
 *
 * The golfer is already signed in by the time they land here (sign-up calls
 * `signIn`), so this is a confirmation step rather than a gate: the nav still works,
 * and any six digits are accepted. The resend timer is real, because a stakeholder
 * clicking "resend" and seeing nothing happen is the fastest way to lose trust in a
 * prototype.
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Mail01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { PinInput } from "@/components/base/input/pin-input";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { McgShell } from "../mcg-chrome";
import { useSession, type SessionUser } from "../session";
import { AuthCard, PrototypeHint } from "./account-ui";

const RESEND_SECONDS = 30;

export const VerifyScreen = ({ userOverride }: { userOverride?: SessionUser | null }) => {
    const router = useRouter();
    const session = useSession();
    const user = userOverride ?? session.user;

    const [code, setCode] = useState("");
    const [seconds, setSeconds] = useState(RESEND_SECONDS);
    const [resentAt, setResentAt] = useState<number | null>(null);

    // One interval for the life of the screen; it simply stops at zero.
    useEffect(() => {
        const timer = window.setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
        return () => window.clearInterval(timer);
    }, []);

    const resend = () => {
        setSeconds(RESEND_SECONDS);
        setResentAt(Date.now());
    };

    return (
        <McgShell>
            <AuthCard>
                <div className="flex flex-col items-center gap-4 text-center">
                    <FeaturedIcon icon={Mail01} size="lg" color="brand" theme="light" />
                    <div className="flex flex-col gap-1.5">
                        <h1 className="text-2xl font-semibold text-primary">Check your email</h1>
                        <p className="text-md text-tertiary">
                            We sent a 6-digit code to{" "}
                            <span className="font-semibold text-secondary">{user?.email ?? "your email address"}</span>. Enter it below to finish setting up your
                            account.
                        </p>
                    </div>
                </div>

                <div className="mt-7 flex flex-col gap-6">
                    <PinInput size="xs" className="items-center">
                        <PinInput.Group maxLength={6} value={code} onChange={setCode} containerClassName="justify-center">
                            <PinInput.Slot index={0} />
                            <PinInput.Slot index={1} />
                            <PinInput.Slot index={2} />
                            <PinInput.Slot index={3} />
                            <PinInput.Slot index={4} />
                            <PinInput.Slot index={5} />
                        </PinInput.Group>
                    </PinInput>

                    <Button size="lg" className="w-full" isDisabled={code.length < 6} onClick={() => router.push("/account/?welcome=1")}>
                        Verify my email
                    </Button>

                    <div className="flex flex-col items-center gap-1.5 text-center">
                        {seconds > 0 ? (
                            <p className="text-sm text-tertiary">
                                Didn’t get it? You can resend in <span className="font-semibold text-secondary tabular-nums">{seconds}s</span>
                            </p>
                        ) : (
                            <p className="text-sm text-tertiary">
                                Didn’t get it?{" "}
                                <button
                                    type="button"
                                    onClick={resend}
                                    className="font-semibold text-brand-secondary transition duration-100 ease-linear hover:text-brand-secondary_hover"
                                >
                                    Send a new code
                                </button>
                            </p>
                        )}
                        {resentAt !== null && <p className="text-xs text-success-primary">A new code is on its way.</p>}
                        <p className="text-sm text-tertiary">
                            Wrong email?{" "}
                            <Link href="/signup" className="font-semibold text-brand-secondary transition duration-100 ease-linear hover:text-brand-secondary_hover">
                                Change it and start again
                            </Link>
                        </p>
                    </div>

                    <PrototypeHint>This is a prototype — no email is sent and any six digits will verify the account.</PrototypeHint>
                </div>

                <div className="mt-6 flex justify-center">
                    <Button href="/signin" color="link-gray" size="md" iconLeading={ArrowLeft}>
                        Back to sign in
                    </Button>
                </div>
            </AuthCard>
        </McgShell>
    );
};
