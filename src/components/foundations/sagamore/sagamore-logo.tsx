import type { ImgHTMLAttributes } from "react";
import { sagamoreLogoSrc } from "../club-logo-src";

/**
 * The Sagamore Spring Golf Club course logo. A convenience wrapper around the
 * indexed logo asset — size it with `className` (e.g. `h-16 w-auto`).
 */
export const SagamoreLogo = (props: Omit<ImgHTMLAttributes<HTMLImageElement>, "src">) => {
    return <img src={sagamoreLogoSrc} alt="Sagamore Spring Golf Club" {...props} />;
};
