"use client";

/**
 * `/forgot-password` — request a reset link, then the "check your inbox" state.
 *
 * Both states live in one component so the story and the route show the same screen;
 * `sentOverride` lets a story publish the success state without typing an email.
 */

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Key01, Mail01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Form } from "@/components/base/form/form";
import { Input } from "@/components/base/input/input";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { McgShell } from "../mcg-chrome";
import { AuthCard, PrototypeHint } from "./account-ui";

export const ForgotPasswordScreen = ({ sentOverride, emailOverride }: { sentOverride?: boolean; emailOverride?: string }) => {
    const [email, setEmail] = useState(emailOverride ?? "");
    const [sent, setSent] = useState(sentOverride ?? false);

    return (
        <McgShell>
            <AuthCard width="sm">
                {sent ? (
                    <div className="flex flex-col items-center gap-4 text-center">
                        <FeaturedIcon icon={Mail01} size="lg" color="success" theme="light" />
                        <div className="flex flex-col gap-1.5">
                            <h1 className="text-2xl font-semibold text-primary">Check your inbox</h1>
                            <p className="text-md text-tertiary">
                                If an MCG account uses <span className="font-semibold text-secondary">{email || "that address"}</span>, a reset link is on its way. It
                                expires in 30 minutes.
                            </p>
                        </div>

                        <div className="mt-4 flex w-full flex-col gap-3">
                            <Button href="/signin" size="lg" className="w-full">
                                Back to sign in
                            </Button>
                            <Button size="lg" color="secondary" className="w-full" onClick={() => setSent(false)}>
                                Use a different email
                            </Button>
                        </div>

                        <p className="text-sm text-tertiary">
                            Still nothing after a few minutes? Check your spam folder, or call the golf office on{" "}
                            <span className="font-semibold text-secondary">(301) 762-1600</span>.
                        </p>

                        <PrototypeHint>This is a prototype — no email is sent. Head back to sign in and use any details to continue.</PrototypeHint>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4 text-center">
                        <FeaturedIcon icon={Key01} size="lg" color="brand" theme="light" />
                        <div className="flex flex-col gap-1.5">
                            <h1 className="text-2xl font-semibold text-primary">Forgot your password?</h1>
                            <p className="text-md text-tertiary">Enter the email on your MCG account and we’ll send you a link to set a new one.</p>
                        </div>

                        <Form
                            className="mt-4 flex w-full flex-col gap-5 text-left"
                            onSubmit={(event) => {
                                event.preventDefault();
                                setSent(true);
                            }}
                        >
                            <Input isRequired type="email" name="email" label="Email" placeholder="you@example.com" icon={Mail01} value={email} onChange={setEmail} />
                            <Button type="submit" size="lg" className="w-full">
                                Send reset link
                            </Button>
                        </Form>

                        <PrototypeHint>This is a prototype — any address works and no email is actually sent.</PrototypeHint>

                        <div className="mt-2">
                            <Button href="/signin" color="link-gray" size="md" iconLeading={ArrowLeft}>
                                Back to sign in
                            </Button>
                        </div>

                        <p className="text-sm text-tertiary">
                            No account yet?{" "}
                            <Link href="/signup" className="font-semibold text-brand-secondary transition duration-100 ease-linear hover:text-brand-secondary_hover">
                                Create one
                            </Link>
                        </p>
                    </div>
                )}
            </AuthCard>
        </McgShell>
    );
};
