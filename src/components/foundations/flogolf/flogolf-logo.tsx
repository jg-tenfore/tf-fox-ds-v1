import type { ImgHTMLAttributes } from "react";
import { flogolfLogoSrc } from "../club-logo-src";

/**
 * The FloGolf Lounge logo. A convenience wrapper around the indexed logo asset —
 * size it with `className` (e.g. `h-16 w-auto`).
 */
export const FlogolfLogo = (props: Omit<ImgHTMLAttributes<HTMLImageElement>, "src">) => {
    return <img src={flogolfLogoSrc} alt="FloGolf Lounge" {...props} />;
};
