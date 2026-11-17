"use client";

import { ThemeProvider } from "next-themes";

export function Theme({ children }: { children: React.ReactNode }) {
    // Locked to light (Nov 17, 2026): reviewers whose computers run in dark mode were seeing
    // the MCG prototypes in an unfinished dark theme. Remove `forcedTheme` (and restore
    // `enableSystem`) once dark mode has been audited.
    return (
        <ThemeProvider attribute="class" value={{ light: "light-mode", dark: "dark-mode" }} forcedTheme="light">
            {children}
        </ThemeProvider>
    );
}
