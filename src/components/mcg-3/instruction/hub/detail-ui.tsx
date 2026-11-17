"use client";

/**
 * Detail-page and overlay pieces the hub and service pages use: back link, photo hero, inline
 * meta, detail sections, check list, the sticky side card, the spots meter, the mobile action bar
 * and the mobile bottom sheet. Ported from the Crane MCG prototype (`events/events-ui.tsx`,
 * `web-dialog.tsx`) onto Fox tokens and Untitled UI's modal primitives.
 */
import type { FC, ReactNode } from "react";
import { ArrowLeft, CheckCircle, XClose } from "@untitledui/icons";
import { Button as AriaButton, Heading as AriaHeading } from "react-aria-components";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { ProgressBarBase } from "@/components/base/progress-indicators/progress-indicators";
import { cx } from "@/utils/cx";
import { focusRing } from "../kit";
import { InstructionLink } from "../nav";

export const BackLink = ({ href, children }: { href: string; children: ReactNode }) => (
    <InstructionLink
        href={href}
        className={cx("inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-tertiary transition duration-100 ease-linear hover:text-secondary", focusRing)}
    >
        <ArrowLeft className="size-4" aria-hidden="true" /> {children}
    </InstructionLink>
);

/** The program photo across the top of a detail page. */
export const Hero = ({ src, alt = "" }: { src: string; alt?: string }) => (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-tertiary ring-1 ring-secondary ring-inset md:aspect-[5/2] md:rounded-3xl lg:aspect-[3/1]">
        <img src={src} alt={alt} className="size-full object-cover" />
    </div>
);

export const MetaInline = ({ icon: Icon, children }: { icon: FC<{ className?: string }>; children: ReactNode }) => (
    <span className="flex items-center gap-1.5">
        <Icon className="size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />
        {children}
    </span>
);

export const DetailSection = ({ title, children, first, action }: { title: ReactNode; children: ReactNode; first?: boolean; action?: ReactNode }) => (
    <section className={cx(!first && "border-t border-secondary pt-8")}>
        <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-primary">{title}</h2>
            {action}
        </div>
        <div className="mt-3">{children}</div>
    </section>
);

export const CheckList = ({ items }: { items: string[] }) => (
    <ul className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
        {items.map((item) => (
            <li key={item} className="flex items-start gap-2.5">
                <CheckCircle className="mt-0.5 size-5 shrink-0 text-fg-brand-primary" aria-hidden="true" />
                <span className="text-sm text-secondary">{item}</span>
            </li>
        ))}
    </ul>
);

/** The price / action card beside a detail page (sticky under the nav on desktop). */
export const SideCard = ({ children, className }: { children: ReactNode; className?: string }) => (
    <div className={cx("rounded-2xl bg-primary p-5 shadow-lg ring-1 ring-secondary lg:sticky lg:top-6", className)}>{children}</div>
);

export const SpotsMeter = ({ capacity, spotsLeft, noun = "spots", className }: { capacity: number; spotsLeft: number; noun?: string; className?: string }) => {
    const taken = capacity - spotsLeft;
    return (
        <div className={cx("flex flex-col gap-1.5", className)}>
            <div className="flex items-center justify-between text-sm">
                <span className="text-tertiary">
                    {taken} of {capacity} {noun} taken
                </span>
                <span className={cx("font-semibold tabular-nums", spotsLeft === 0 ? "text-error-primary" : spotsLeft <= 6 ? "text-warning-primary" : "text-primary")}>
                    {spotsLeft === 0 ? "Full" : `${spotsLeft} left`}
                </span>
            </div>
            <ProgressBarBase value={taken} max={capacity} />
        </div>
    );
};

/**
 * Mobile only: a bar pinned to the bottom of the viewport with the price and the main action, so
 * Register / Book is always one tap away while reading the details.
 */
export const MobileActionBar = ({ summary, action }: { summary: ReactNode; action: ReactNode }) => (
    <div className="sticky bottom-0 z-20 border-t border-secondary bg-primary/95 px-4 py-3 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">{summary}</div>
            {action}
        </div>
    </div>
);

/**
 * A bottom sheet for mobile (Crane's `WebDialog` on a narrow screen): title + description, a
 * scrolling body and a footer with an optional start action. Built on Untitled UI's modal.
 */
export const BottomSheet = ({
    isOpen,
    onOpenChange,
    title,
    description,
    children,
    footer,
    footerStart,
}: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: ReactNode;
    children: ReactNode;
    footer?: ReactNode;
    footerStart?: ReactNode;
}) => (
    <ModalOverlay isOpen={isOpen} onOpenChange={onOpenChange} isDismissable className="items-end px-0 pt-10 pb-0 sm:items-end sm:p-0">
        <Modal className="max-h-[88dvh] w-full max-sm:rounded-none">
            <Dialog aria-label={title} className="max-h-[88dvh] overflow-hidden rounded-t-2xl bg-primary shadow-xl">
                <span className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-quaternary" aria-hidden="true" />
                <div className="flex items-start justify-between gap-3 border-b border-secondary px-4 pt-2 pb-4">
                    <div className="flex min-w-0 flex-col gap-0.5">
                        <AriaHeading slot="title" className="text-lg font-semibold text-primary">
                            {title}
                        </AriaHeading>
                        {description && <p className="text-sm text-tertiary">{description}</p>}
                    </div>
                    <AriaButton
                        slot="close"
                        aria-label="Close"
                        className={cx("-mr-1 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-fg-quaternary hover:bg-primary_hover hover:text-fg-quaternary_hover", focusRing)}
                    >
                        <XClose className="size-5" aria-hidden="true" />
                    </AriaButton>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">{children}</div>
                {(footer || footerStart) && (
                    <div className="flex items-center justify-between gap-3 border-t border-secondary px-4 py-3">
                        <div>{footerStart}</div>
                        {footer}
                    </div>
                )}
            </Dialog>
        </Modal>
    </ModalOverlay>
);
