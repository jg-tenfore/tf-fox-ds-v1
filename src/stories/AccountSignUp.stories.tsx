import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { SocialButton } from "@/components/base/buttons/social-button";
import { SagamoreLogo } from "@/components/foundations/sagamore/sagamore-logo";

/**
 * Sign-up pages for new Sagamore members creating an account to book tee times.
 * Each story composes existing base components (Button, Input, SocialButton) into
 * a full Untitled-UI-style page, rendered monochromatically with semantic color
 * classes only.
 */
const meta = {
    title: "Account/Sign up",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Centered card: name, email, and password fields with a single primary action. */
export const Simple: Story = {
    render: () => (
        <div className="min-h-screen bg-primary flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-sm">
                <div className="flex flex-col items-center text-center">
                    <SagamoreLogo className="h-20 w-auto" />
                    <h1 className="mt-6 text-2xl font-semibold text-primary">Create your account</h1>
                    <p className="mt-2 text-sm text-tertiary">Join Sagamore to book tee times and track your rounds.</p>
                </div>

                <form className="mt-8 flex flex-col gap-5">
                    <Input label="Name" placeholder="Enter your name" isRequired />
                    <Input label="Email" type="email" placeholder="you@example.com" isRequired />
                    <Input label="Password" type="password" placeholder="Create a password" hint="Must be at least 8 characters." isRequired />

                    <Button size="lg" className="w-full">
                        Get started
                    </Button>
                </form>

                <p className="mt-8 text-center text-sm text-tertiary">
                    Already have an account?{" "}
                    <Button href="#" color="link-color" className="text-sm">
                        Log in
                    </Button>
                </p>
            </div>
        </div>
    ),
};

/** Sign up simple with social logins — Google / Apple buttons below the form. */
export const SimpleWithSocialLogins: Story = {
    render: () => (
        <div className="min-h-screen bg-primary flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-sm">
                <div className="flex flex-col items-center text-center">
                    <SagamoreLogo className="h-20 w-auto" />
                    <h1 className="mt-6 text-2xl font-semibold text-primary">Create your account</h1>
                    <p className="mt-2 text-sm text-tertiary">Join Sagamore to book tee times and track your rounds.</p>
                </div>

                <form className="mt-8 flex flex-col gap-5">
                    <Input label="Name" placeholder="Enter your name" isRequired />
                    <Input label="Email" type="email" placeholder="you@example.com" isRequired />
                    <Input label="Password" type="password" placeholder="Create a password" hint="Must be at least 8 characters." isRequired />

                    <Button size="lg" className="w-full">
                        Create account
                    </Button>
                </form>

                <div className="my-6 flex items-center gap-3">
                    <span className="h-px flex-1 bg-border-secondary" />
                    <span className="text-sm text-tertiary">or</span>
                    <span className="h-px flex-1 bg-border-secondary" />
                </div>

                <div className="flex flex-col gap-3">
                    <SocialButton social="google" theme="color" className="w-full">
                        Sign up with Google
                    </SocialButton>
                    <SocialButton social="apple" theme="color" className="w-full">
                        Sign up with Apple
                    </SocialButton>
                </div>

                <p className="mt-8 text-center text-sm text-tertiary">
                    Already have an account?{" "}
                    <Button href="#" color="link-color" className="text-sm">
                        Log in
                    </Button>
                </p>
            </div>
        </div>
    ),
};

/** Two-pane layout: form on the left, dark brand benefits panel on the right. */
export const SplitScreen: Story = {
    render: () => (
        <div className="min-h-screen bg-primary flex">
            <div className="flex flex-1 items-center justify-center px-4 py-12">
                <div className="w-full max-w-sm">
                    <div className="flex flex-col items-center text-center">
                        <SagamoreLogo className="h-20 w-auto" />
                        <h1 className="mt-6 text-2xl font-semibold text-primary">Create your account</h1>
                        <p className="mt-2 text-sm text-tertiary">Join Sagamore to book tee times and track your rounds.</p>
                    </div>

                    <form className="mt-8 flex flex-col gap-5">
                        <Input label="Name" placeholder="Enter your name" isRequired />
                        <Input label="Email" type="email" placeholder="you@example.com" isRequired />
                        <Input label="Password" type="password" placeholder="Create a password" hint="Must be at least 8 characters." isRequired />

                        <Button size="lg" className="w-full">
                            Create account
                        </Button>
                    </form>

                    <p className="mt-8 text-sm text-tertiary">
                        Already have an account?{" "}
                        <Button href="#" color="link-color" className="text-sm">
                            Log in
                        </Button>
                    </p>
                </div>
            </div>

            <div className="hidden flex-1 flex-col justify-center bg-primary-solid px-16 py-12 lg:flex">
                <div className="inline-flex w-fit rounded-xl bg-primary p-3">
                    <SagamoreLogo className="h-20 w-auto" />
                </div>
                <p className="mt-8 text-lg font-medium text-white">Everything you need to play more golf.</p>
                <ul className="mt-6 flex flex-col gap-4">
                    <li className="text-md text-white/80">Book tee times 14 days out</li>
                    <li className="text-md text-white/80">Member twilight rates</li>
                    <li className="text-md text-white/80">Track your rounds</li>
                </ul>
            </div>
        </div>
    ),
};

/** Sign up simple with social login leading — social buttons above an "or" divider, then the form. */
export const SimpleWithSocialLoginLeading: Story = {
    render: () => (
        <div className="min-h-screen bg-primary flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-sm">
                <div className="flex flex-col items-center text-center">
                    <SagamoreLogo className="h-20 w-auto" />
                    <h1 className="mt-6 text-2xl font-semibold text-primary">Create your account</h1>
                    <p className="mt-2 text-sm text-tertiary">Join Sagamore to book tee times and track your rounds.</p>
                </div>

                <div className="mt-8 flex flex-col gap-3">
                    <SocialButton social="google" theme="color" className="w-full">
                        Sign up with Google
                    </SocialButton>
                    <SocialButton social="apple" theme="color" className="w-full">
                        Sign up with Apple
                    </SocialButton>
                </div>

                <div className="my-6 flex items-center gap-3">
                    <span className="h-px flex-1 bg-border-secondary" />
                    <span className="text-sm text-tertiary">or</span>
                    <span className="h-px flex-1 bg-border-secondary" />
                </div>

                <form className="flex flex-col gap-5">
                    <Input label="Name" placeholder="Enter your name" isRequired />
                    <Input label="Email" type="email" placeholder="you@example.com" isRequired />
                    <Input label="Password" type="password" placeholder="Create a password" hint="Must be at least 8 characters." isRequired />
                    <Button size="lg" className="w-full">
                        Create account
                    </Button>
                </form>

                <p className="mt-8 text-center text-sm text-tertiary">
                    Already have an account?{" "}
                    <Button href="#" color="link-color" className="text-sm">
                        Log in
                    </Button>
                </p>
            </div>
        </div>
    ),
};

/** Sign up simple with a top header navigation bar (logo, nav links, log-in action). */
export const SimpleWithHeaderNavigation: Story = {
    render: () => (
        <div className="flex min-h-screen flex-col bg-primary">
            <header className="flex items-center justify-between border-b border-border-secondary px-6 py-4">
                <SagamoreLogo className="h-10 w-auto" />
                <nav className="hidden items-center gap-6 md:flex">
                    <Button href="#" color="link-gray" className="text-sm">
                        Courses
                    </Button>
                    <Button href="#" color="link-gray" className="text-sm">
                        Membership
                    </Button>
                    <Button href="#" color="link-gray" className="text-sm">
                        Dining
                    </Button>
                </nav>
                <div className="flex items-center gap-3">
                    <Button href="#" color="link-gray" size="md">
                        Log in
                    </Button>
                    <Button size="md">Sign up</Button>
                </div>
            </header>

            <div className="flex flex-1 items-center justify-center px-4 py-12">
                <div className="w-full max-w-sm">
                    <div className="flex flex-col items-center text-center">
                        <h1 className="text-2xl font-semibold text-primary">Create your account</h1>
                        <p className="mt-2 text-sm text-tertiary">Join Sagamore to book tee times and track your rounds.</p>
                    </div>

                    <form className="mt-8 flex flex-col gap-5">
                        <Input label="Name" placeholder="Enter your name" isRequired />
                        <Input label="Email" type="email" placeholder="you@example.com" isRequired />
                        <Input label="Password" type="password" placeholder="Create a password" hint="Must be at least 8 characters." isRequired />
                        <Button size="lg" className="w-full">
                            Create account
                        </Button>
                    </form>

                    <p className="mt-8 text-center text-sm text-tertiary">
                        Already have an account?{" "}
                        <Button href="#" color="link-color" className="text-sm">
                            Log in
                        </Button>
                    </p>
                </div>
            </div>
        </div>
    ),
};
