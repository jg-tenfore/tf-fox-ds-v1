import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Mail01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { SocialButton } from "@/components/base/buttons/social-button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Form } from "@/components/base/form/form";
import { Input } from "@/components/base/input/input";
import { SagamoreLogo } from "@/components/foundations/sagamore/sagamore-logo";

/**
 * Full-screen log-in pages for the Sagamore golf club member portal, composed
 * from the design system's base components. Monochromatic, near-black/grey,
 * with members signing in to book tee times.
 */
const meta = {
    title: "Account/Log in",
    parameters: {
        layout: "fullscreen",
    },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/** The form fields shared across every log-in page variant. */
const LoginFields = () => (
    <Form
        onSubmit={(event) => event.preventDefault()}
        className="flex w-full flex-col gap-5"
    >
        <Input
            isRequired
            type="email"
            name="email"
            label="Email"
            placeholder="member@sagamore.club"
            icon={Mail01}
        />
        <Input
            isRequired
            type="password"
            name="password"
            label="Password"
            placeholder="••••••••"
        />

        <div className="flex items-center justify-between">
            <Checkbox label="Remember me" />
            <Button color="link-color" size="sm">
                Forgot password?
            </Button>
        </div>

        <Button type="submit" size="lg" className="w-full">
            Sign in
        </Button>
    </Form>
);

/** The signup prompt shown in the page footer. */
const SignUpFooter = () => (
    <p className="flex justify-center gap-1 text-sm text-tertiary">
        Don't have an account?
        <Button href="#" color="link-color" size="sm">
            Sign up
        </Button>
    </p>
);

/**
 * Centered card with email + password, remember-me / forgot-password row,
 * a full-width sign-in button, and a sign-up footer.
 */
export const Simple: Story = {
    render: () => (
        <div className="min-h-screen bg-primary flex flex-col items-center justify-center px-4 py-12">
            <div className="flex w-full max-w-sm flex-col gap-8">
                <div className="flex flex-col items-center gap-6 text-center">
                    <SagamoreLogo className="h-20 w-auto" />
                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl font-semibold text-primary">Welcome back</h1>
                        <p className="text-md text-tertiary">Sign in to your Sagamore account</p>
                    </div>
                </div>

                <LoginFields />

                <SignUpFooter />
            </div>
        </div>
    ),
};

/**
 * The Simple layout plus an "or" divider and Google / Apple social sign-in.
 */
export const WithSocial: Story = {
    render: () => (
        <div className="min-h-screen bg-primary flex flex-col items-center justify-center px-4 py-12">
            <div className="flex w-full max-w-sm flex-col gap-8">
                <div className="flex flex-col items-center gap-6 text-center">
                    <SagamoreLogo className="h-20 w-auto" />
                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl font-semibold text-primary">Welcome back</h1>
                        <p className="text-md text-tertiary">Sign in to your Sagamore account</p>
                    </div>
                </div>

                <LoginFields />

                <div className="flex items-center gap-3">
                    <span className="h-px flex-1 bg-border-secondary" />
                    <span className="text-sm text-tertiary">or</span>
                    <span className="h-px flex-1 bg-border-secondary" />
                </div>

                <div className="flex flex-col gap-3">
                    <SocialButton social="google" theme="color" className="w-full">
                        Sign in with Google
                    </SocialButton>
                    <SocialButton social="apple" theme="color" className="w-full">
                        Sign in with Apple
                    </SocialButton>
                </div>

                <SignUpFooter />
            </div>
        </div>
    ),
};

/**
 * Two-column layout: the form on the left, a dark brand panel with the white
 * logo and a tagline on the right (hidden on small screens).
 */
export const SplitScreen: Story = {
    render: () => (
        <div className="min-h-screen bg-primary flex">
            <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
                <div className="flex w-full max-w-sm flex-col gap-8">
                    <div className="flex flex-col items-center gap-6 text-center">
                        <SagamoreLogo className="h-20 w-auto" />
                        <div className="flex flex-col gap-2">
                            <h1 className="text-2xl font-semibold text-primary">Welcome back</h1>
                            <p className="text-md text-tertiary">Sign in to your Sagamore account</p>
                        </div>
                    </div>

                    <LoginFields />

                    <SignUpFooter />
                </div>
            </div>

            <div className="hidden lg:flex flex-1 flex-col items-start justify-center gap-6 bg-primary-solid px-16">
                <div className="inline-flex rounded-xl bg-primary p-3">
                    <SagamoreLogo className="h-20 w-auto" />
                </div>
                <p className="max-w-md text-xl font-medium text-white">
                    Reserve your tee time, track your handicap, and stay close to the
                    course — all from your Sagamore member portal.
                </p>
            </div>
        </div>
    ),
};
