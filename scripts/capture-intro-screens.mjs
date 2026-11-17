// Captures the prototype screens shown on Storybook's Start Here pages
// (Overview, Style guide, How to review) and the Archive note.
//
//   npm run storybook                                (in another terminal; serves :6017)
//   node scripts/capture-intro-screens.mjs           (every shot)
//   node scripts/capture-intro-screens.mjs p3-search (only the named shots)
//
// Playwright's Chromium, a 1440 × 900 window, each story opened on its own page,
// ~3 s to settle, then a screenshot. macOS `sips` turns it into a ~1200px JPEG in
// src/stories/start-here/screens/. Re-run after a visible change to a screen.
//
// Privacy: this Storybook is public. Before every shot, any email address or US phone
// number on the page (text and form values) is swapped for an obviously fake one, so a
// sample checkout's contact details or a staff number can never end up in a picture.
// The sample golfer's name is swapped for an invented one too.
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "src/stories/start-here/screens");
const base = process.env.STORYBOOK_URL ?? "http://localhost:6017/";
const WIDTH = 1440;
const HEIGHT = 900;
const SETTLE_MS = 3000;
mkdirSync(out, { recursive: true });

/** [file, story id] */
const SHOTS = [
    // MCG Prototype 3
    ["p3-search", "mcg-prototype-3-instruction--search"],
    ["p3-time", "mcg-prototype-3-instruction--choose-time"],
    // MCG Prototype 1
    ["p1-tee-sheet", "mcg-prototype-tee-times--tee-sheet"],
    ["p1-academy", "mcg-prototype-academy--instructors"],
    ["p1-pick-time", "mcg-prototype-lesson-booking--pick-a-time"],
    ["p1-packages", "instruction-packages-credits--browse-packages"],
    ["p1-shop", "mcg-prototype-shop--storefront"],
    ["p1-clinics", "mcg-prototype-events-clinics--browse-clinics"],
    ["p1-grill", "mcg-prototype-grill--courses"],
    ["p1-account", "mcg-prototype-account--account"],
    ["p1-settings", "mcg-prototype-account--settings"],
    // Golfer web · Sagamore & clubs
    ["club-shop", "global-nav-pro-shop-shop-all--default"],
    ["club-kettle-hills", "global-nav-tee-times-3-courses-kettle-hills--default"],
    // Archive
    ["archive-mcg-tee-sheet", "global-nav-tee-times-mcg-courses--default"],
];

const only = process.argv.slice(2);
const shots = only.length ? SHOTS.filter(([name]) => only.includes(name)) : SHOTS;

/** Runs in the page: replace every email and phone number with a fake one. */
function scrubContactDetails() {
    const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
    const PHONE = /(\+?1[\s.-]?)?\(?\b\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g;
    const NAMES = [
        [/\bJustin\b/g, "Jordan"],
        [/\bGirard\b/g, "Rivers"],
        [/^JG$/, "JR"],
    ];
    const clean = (s) => NAMES.reduce((t, [re, to]) => t.replace(re, to), s.replace(EMAIL, "golfer@example.com").replace(PHONE, "(555) 010-0199"));
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        const next = clean(n.nodeValue ?? "");
        if (next !== n.nodeValue) n.nodeValue = next;
    }
    for (const el of document.querySelectorAll("input, textarea")) {
        const next = clean(el.value);
        if (next !== el.value) el.value = next;
        const ph = el.getAttribute("placeholder");
        if (ph && clean(ph) !== ph) el.setAttribute("placeholder", clean(ph));
    }
    for (const a of document.querySelectorAll("a[href^='mailto:'], a[href^='tel:']")) a.removeAttribute("href");
}

const tmp = mkdtempSync(path.join(tmpdir(), "fox-capture-"));
const browser = await chromium.launch();
try {
    for (const [file, id] of shots) {
        // A fresh context per shot, so no session or storage carries from one story to the next.
        const context = await browser.newContext({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 1 });
        const page = await context.newPage();
        await page.goto(`${base}iframe.html?viewMode=story&id=${encodeURIComponent(id)}`, { waitUntil: "networkidle" });
        await page.waitForTimeout(SETTLE_MS);
        await page.evaluate(scrubContactDetails);
        const png = path.join(tmp, `${file}.png`);
        await page.screenshot({ path: png });
        await context.close();

        const jpg = path.join(out, `${file}.jpg`);
        execFileSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "62", "--resampleWidth", "1200", png, "--out", jpg], { stdio: "ignore" });
        console.log(`  ✓ ${file}  (${id})`);
    }
} finally {
    await browser.close();
    rmSync(tmp, { recursive: true, force: true });
}
