import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "@/components/mcg/session";
import { RouteProvider } from "@/providers/router-provider";
import { Theme } from "@/providers/theme";
import "@/styles/globals.css";
import { cx } from "@/utils/cx";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

export const metadata: Metadata = {
    title: "Montgomery County Golf — Prototype",
    description: "A clickable MCG booking prototype built on the Tenfore Fox design system.",
};

export const viewport: Viewport = {
    themeColor: "#1E8E4E",
    colorScheme: "light dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={cx(inter.variable, "bg-primary antialiased")}>
                <RouteProvider>
                    <Theme>
                        <SessionProvider>{children}</SessionProvider>
                    </Theme>
                </RouteProvider>
            </body>
        </html>
    );
}
