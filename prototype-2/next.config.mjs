/** @type {import('next').NextConfig} */

// MCG Prototype 2 — a separate copy of the prototype for independent changes.
//
// Its screens live in `src/components/mcg-2` and `src/components/instruction-2`, and
// its routes in `prototype-2/app`, so nothing here can change Prototype 1. Only the
// design-system layer (`src/components/base`, `application`, `foundations`, tokens)
// is shared.
//
//   https://jg-tenfore.github.io/tf-fox-ds-v1/prototype/    → Prototype 1
//   https://jg-tenfore.github.io/tf-fox-ds-v1/prototype-2/  → this app
//
// PAGES=1 switches on the subpath. Local `npm run dev:2` serves it at :3001.
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "..");

const isPages = process.env.PAGES === "1";
const basePath = isPages ? "/tf-fox-ds-v1/prototype-2" : "";

const nextConfig = {
    output: "export",
    trailingSlash: true,
    basePath,
    images: { unoptimized: true },
    env: {
        NEXT_PUBLIC_ASSET_BASE: `${basePath}/`,
    },
    // The app imports the shared `src/` tree one level up, so the bundler root is the repo.
    turbopack: { root: repoRoot },
    outputFileTracingRoot: repoRoot,
    experimental: {
        optimizePackageImports: ["@untitledui/icons"],
    },
};

export default nextConfig;
