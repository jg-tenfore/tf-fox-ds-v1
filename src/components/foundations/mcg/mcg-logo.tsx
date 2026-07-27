import type { ImgHTMLAttributes } from "react";
import { mcgLogo } from "./mcg-assets";

/**
 * The Montgomery County Golf (MCG) group logo. A convenience wrapper around the
 * indexed logo asset — size it with `className` (e.g. `h-11 w-auto`).
 */
export const McgLogo = (props: Omit<ImgHTMLAttributes<HTMLImageElement>, "src">) => {
    return <img src={mcgLogo} alt="Montgomery County Golf" {...props} />;
};
