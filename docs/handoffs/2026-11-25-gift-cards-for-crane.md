# Gift cards for Crane: the Nov 25 "New Concept" flow

**For:** the TF Crane DS session (`tf-crane-ds-v1`).
**Goal:** bring the gift card flow and its user experience into three Crane surfaces: the **iPhone app**, **Crane Web**, and **Crane Web checkout**.
**From:** the Fox review "Reviews › Nov 25 – Gift Cards › Nov 25 – New Concept", merged in Fox PRs #23, #24 and #25 and live on Pages.

## Where to look

| What | Link or path |
| --- | --- |
| The flow, live | https://jg-tenfore.github.io/tf-fox-ds-v1/?path=/story/nov-25-2026-gift-card-builder--choose |
| Review summary | https://jg-tenfore.github.io/tf-fox-ds-v1/?path=/story/nov-25-2026-gift-cards-summary--summary |
| Builder (choose step) | `tf-fox-ds-v1/src/components/gift-cards/gift-card-builder.tsx` |
| Data: designs, deals, amounts, helpers | `tf-fox-ds-v1/src/components/gift-cards/gift-card-catalog.ts` |
| Cart, Checkout, Confirmation, purchase email, Wallet wiring | `tf-fox-ds-v1/src/stories/reviews/nov-25-2026-gift-card-flow.tsx` |
| UPC-A barcode (SVG, scannable) | `tf-fox-ds-v1/src/components/gift-cards/upc-barcode.tsx` |
| Card art (10 files, 960 × 640 jpg) | `tf-fox-ds-v1/src/components/gift-cards/art/` |
| Wallet gift card list and "Sent as gifts" | `tf-fox-ds-v1/src/stories/profile/wallet-experience.tsx` (`WalletGiftCard`, `SentGiftCard`) |

Story ids, all under `nov-25-2026-gift-card-builder--`:

| Group | Stories |
| --- | --- |
| Builder | `choose`, `filled-in`, `deal-nudge`, `custom-amount`, `missing-details`, `emails-dont-match`, `for-me`, `print-at-home` |
| Checkout | `cart`, `checkout`, `confirmation` |
| Email | `self-email`, `gift-email` |
| Wallet | `wallet`, `wallet-for-me` |
| Phone | `phone-width` |

Crane already has these pieces:
- **Crane Web gift card page:** `src/screens/web/browse/gift-card-page.tsx`, at `/shop/gift-cards`. It is an older Fox port with amount chips, a design, a recipient and a message.
- **Web checkout:** `src/screens/web/checkout/*`, which covers cart, checkout, confirmation and the `cart-store`.
- **Account Wallet:** `src/screens/web/account/account-wallet-screen.tsx`.
- **iPhone Gift Cards screen:** `src/screens/profile/gift-cards-screen.tsx`.

The new flow should **replace the old gift card page** and **reuse Crane's own cart, checkout and confirmation layouts**. Fox did the same with Fox's Shop Checkout layouts; don't build a separate checkout for gift cards.

---

## 1. The idea in one paragraph

Buying a gift card is one page with three numbered steps:
1. **Choose an amount**, with deals first.
2. **Pick a design.**
3. **Who's it for?**

Beside the steps, a small card preview and a running total stay in view the whole way. "Pay $50, get a $60 card" is the first thing a golfer sees. **Add to cart** hands the order to the normal cart → checkout → confirmation. The buyer then gets a purchase email: Self or Gift. The card lands in the Wallet: under Gift cards if it's for you, or under **Sent as gifts** if it's for someone else.

## 2. The flow, screen by screen

1. **Shop › Gift cards (the builder).**
2. **Cart:** the gift card is the line item.
3. **Checkout:** "Send to" replaces "Ship to", and "Delivery" replaces "Shipping".
4. **Confirmation:** "Gift card details" replaces "Returns & exchanges".
5. **Purchase email:** Self Email or Gift Email. It opens from "View the email" on the confirmation.
6. **Wallet:** a success notice, the new card or the sent gift, and "Buy gift card" going back to step 1.

Back and Edit paths:
- In the cart, **Edit** reopens the builder with every choice kept: amount, design, recipient, fields and message.
- The back arrow walks the steps in reverse.

### 2.1 The builder

The layout is two columns on desktop: the steps on the left, and on the right a sticky summary 360px wide. Below desktop it is one column.

**Header**
- Title: "Gift cards".
- Line under it: "Give a round, a lesson or lunch at {club}. Every card is good for golf, food & drink, alcohol and merchandise."
- On the right, a link "Your gift cards" that opens the Wallet.

**Step 1 · Choose an amount**
- **Deals** come first, as tiles. Each tile has:
  - a green "+$10 bonus" badge
  - "Pay $50"
  - "Get a **$60** card", with the value in brand color
  - an optional line such as "Ends Dec 31 · Limit 2 each"
- A **sold-out** deal stays visible but is disabled, with a gray "Sold out" badge.
- Then "Or pick an amount": $25, $50, $100 or $200.
- Then "Other amount": a dollar input with the hint "Any amount from $10 to $500."
- **Deal nudge:** if the golfer picks a standard amount that a live deal beats for the same money (e.g. $50 when "$50 → $60" is live), show a brand-tinted bar: "**Same $50, bigger card.** The deal gets you a $60 card instead." It has the button "Switch to the deal".

**Step 2 · Pick a design**
- 10 designs in 3 labelled groups, 4 across on desktop and 2 across on phone.
- Each tile is the art plus its name. The selected tile gets a brand ring and a check badge.
- **Classic:** Sunrise fairway, On the green, Clubhouse lights, Autumn round.
- **Destinations:** Desert canyon, Coastal cliffs, Mountain lake.
- **Holidays & occasions:** Snowy holiday, Birthday gift, Fireworks night.

**Step 3 · Who's it for?**

First the golfer chooses between two option tiles, each with a radio:
- "Someone else": "Send it as a gift, with a note."
- "Me": "It's saved to your wallet to spend."

**If "Someone else":**
1. "How should it get there?" has two tiles:
   - "Email it to them": "They get it today, ready to use."
   - "Email it to me to print": "Hand it over yourself."
2. **From box** (gray panel):
   - It shows "From" and "**Morgan Hale** (morgan.hale@example.com)", which is the signed-in golfer.
   - A **Change** link opens "Your name" and "Your email" inputs, and the link becomes "Done". "Your name" has the hint "It's on the card, so they know who it's from."
3. **To:**
   - First name and Last name are always required.
   - With **email** delivery, also: Email and Confirm email (required), then Phone (optional) and Confirm phone (optional).
   - **Print** needs only the name.
4. **Message (optional):**
   - A textarea capped at 300 characters, with the hint "{n}/300 characters · it goes on the card email."
   - Placeholder: "Happy birthday! First round's on me."

**Summary panel, "Your gift card"**
- The **card face**: a 3:2 card using the chosen art, with a dark gradient. It shows the club name, a "Gift card" pill and the value, e.g. "$60".
- Then the rows "Card value", "Deal bonus" (green, only when there is a bonus) and "You pay".
- Then a delivery line:
  - "To Alex Rivera · emailed today"
  - or "To … · emailed to you to print"
  - or "For you · saved to your wallet"
- Then the primary button "Add to cart", with a bag icon.

**Validation**
- Errors show only after Add to cart is pressed.
- If anything is missing, the panel shows "Fill in the highlighted fields to continue."

Field error copy:

| Field | Message |
| --- | --- |
| Other amount, empty | Enter an amount |
| Other amount, outside $10–$500 | Enter an amount from $10 to $500 |
| First name | Add their first name |
| Last name | Add their last name |
| Email | Add an email we can send the card to |
| Confirm email | The emails don't match (case-insensitive compare) |
| Confirm phone | The phone numbers don't match (digits-only compare; checked only when either phone field has a value) |
| Your name | Add who it's from |
| Your email | Add your email |

If the From fields are invalid, the From panel opens by itself.

### 2.2 Cart (Crane Web: reuse the cart page)

- Title "Your cart", with the line "Review your gift card before checkout."
- The line item shows:
  - a 3:2 thumbnail of the card art
  - "$60 Sagamore Spring gift card"
  - "{Design} · {delivery line}"
  - "Deal: pay $50, get a $60 card", in green, when there's a deal
  - **Edit** and **Remove**
- The line price is what the golfer **pays** ($50), not the card value.
- **Order summary:**
  - Instead of the discount-code input: "Discount codes and gift cards can't be used to buy gift cards."
  - The rows are:

    | Row | Value |
    | --- | --- |
    | Subtotal · 1 item | $50.00 |
    | Deal bonus (card value) | +$10.00, in green |
    | Delivery — email | Free |
    | Taxes | $0.00 |
    | Total | USD $50.00 |

  - The button is "Checkout".
  - The footnote is "Gift cards are emailed, so there's no shipping or tax."
- **Empty cart:** "Your cart is empty." and the button "Buy a gift card".

### 2.3 Checkout (Crane Web checkout: reuse the checkout page)

**Left column**
- The buyer's email line.
- A sections card with three sections:
  - **Send to** replaces Ship to. It is collapsible:
    - For a gift: the recipient's name, then their email (or "Emailed to you to print · {buyer email}"). Expanded, it adds the message, "Their phone …" when given, and "From {name}".
    - For yourself, the label is "For": "Morgan Hale (you)" and "Saved to your wallet".
  - **Delivery** replaces Shipping:
    - For a gift: "Email · Sent today, right after you pay · Free".
    - For yourself: "Wallet · Ready to use right after you pay · Free".
  - **Payment:** the saved cards as radios with brand chips, plus "Pay another way". This is unchanged from shop checkout.
- The primary button reads "**Pay now · $50.00**".

**Right column (summary)**
- The line item with its thumbnail.
- Instead of rewards and discount code: "Points, rewards and discount codes can't be used on gift cards."
- The same totals as the cart.

### 2.4 Confirmation (reuse the confirmation page)

**Top**
- A check icon, then "ORDER CONFIRMATION" and the order number "#SG-100519".
- "Thank you, Morgan!"
- "Your gift card order is confirmed." followed by one of:
  - "Alex Rivera gets the card by email today."
  - "We've emailed the printable card to {buyer email}."
  - "Your $60 gift card is in your wallet."
- A pill: "Emailed to Alex Rivera today", "Emailed to you to print" or "Saved to your wallet".

**Sections**
1. **Items (1)**, with a "Paid" badge.
2. **Delivery**: SEND TO / FOR and METHOD (Email or Wallet · Today, plus the message).
3. **Payment details**: Subtotal, Deal bonus, Delivery — email Free, Taxes $0.00, Total charged, the card used and "Download PDF receipt".
   - Under it: "Paid online on November 25, 2026. We emailed your receipt to {email}. **View the email**". The link opens the purchase email.
4. **Gift card details** replaces Returns & exchanges:
   - "Card code {code}." The code is masked for a gift and full for yourself.
   - Then: "Good for … at {club}. It doesn't expire, and gift cards can't be returned or exchanged for cash."
   - Buttons:
     - "See it in your wallet" (for yourself) or "See your gift cards" (for a gift)
     - "Resend the email" (email gifts only)
     - "Buy another gift card"
5. **Where to find help**: unchanged.

Confetti on arrival, as the shop confirmation already does.

### 2.5 Purchase email: Self Email and Gift Email

The layout follows the tf-emails template "Gift Cards › Purchase".

**Overall structure**
- A 600px card on a gray page.
- Club header: logo, club name and address.
- Eyebrow "GIFT CARD", then the title:
  - Self: "Your gift card is ready, {first name}."
  - Gift: "Your gift card is on its way."
- Stamps: "GIFT CARD {code}" (masked for a gift) and "ORDER #SG-100519".

**Self Email**
- The card face with the **full code**.
- Then: "Scan the barcode at the Pro Shop, or enter the code at checkout online. It's also in your wallet."

**Gift Email**
- A row with the card thumbnail: "$60 Sagamore Spring gift card" and "{Design} design".
- A success alert, "Gift sent":
  - Email delivery: "We sent the $60.00 gift card to Alex Rivera. They'll get a separate email with the card and its code."
  - Print delivery: "We sent you a separate email with the $60.00 card to print and give to Alex Rivera."
- **No code or barcode for the buyer.**

**Details table, in this order**
1. **Gift Card ID** (Self only): the 12-digit number.
2. Right under it (Self only), centered:
   - a **UPC-A barcode**, about 2:1, with no digits under the bars (190×88 at 2px per bar), matching the live email
   - the caption "Scannable barcode for easy redemption"
   - **No QR code in the emails** (decided Nov 25: barcode only).
3. Card value.
4. You paid: "$50.00 (deal: +$10.00 bonus)", only with a deal.
5. Gift-only rows: Recipient, Recipient email (or Delivery "Printable copy, emailed to you"), Recipient phone (if given), Message, From.
6. Design, Expiration "Doesn't expire", Use for, Purchased, Paid with.

**After the table**
- A primary button "Manage gift cards →", which opens the Wallet.
- "Need help? Contact the pro shop."
- The TenFore footer.

The **Gift Card ID** is a 12-digit number, as on the live shop (e.g. `284716093352`).
- The barcode encodes it as UPC-A: 11 digits plus a check digit.
- Chromium's BarcodeDetector reads it as EAN-13 `0284716093352`, which is the same code.
- Port `upc-barcode.tsx` as is.

### 2.6 Wallet

- **Notice** at the top (a success alert):
  - For yourself: "Your $60 gift card is in your wallet" and "Use it at checkout or at the Pro Shop counter."
  - For a gift: "Your gift to Alex Rivera is on its way" and "You'll find it under Gift cards › Sent as gifts."
- **Gift cards list:**
  - Each card shows an art thumbnail (or the gift icon), "Sagamore Gift Card", "···· 3352" and the balance.
  - A green "New" pill marks a card just bought.
- **"Sent as gifts"** is a new sub-section. Each row shows:
  - the thumbnail
  - "**Alex Rivera** · alex@example.com" and the date
  - "$60.00 card"
  - "Paid $50.00 · +$10.00 bonus"
  - a status badge: "Sent" or "Ready to print"
- **"Buy gift card"** opens the builder. It no longer opens a modal.

## 3. Data

Shown in Fox's types; rename them to fit Crane.

```ts
type Recipient = "someone" | "me";
type Delivery = "email" | "print";

interface CardDesign { id: string; name: string; art: Image; theme: "classic" | "destinations" | "occasions" }

interface GiftCardDeal {
  id: string;
  price: number;        // what the golfer pays
  value: number;        // what the card is worth
  endsOn?: string;      // YYYY-MM-DD
  limitPerCustomer?: number;
  soldOut?: boolean;
}

interface GiftCardOrder {
  design: CardDesign;
  value: number;        // card value
  price: number;        // charged
  deal?: GiftCardDeal;
  recipient: Recipient;
  delivery: Delivery;
  toFirstName: string; toLastName: string; toName: string; // toName = "First Last"
  toEmail: string;
  toPhone?: string;     // only with email delivery
  message: string;      // ≤ 300 chars
  fromName: string; fromEmail: string;
}
```

**Rules**
- `value` is either `deal.value` or the amount.
- `price` is either `deal.price` or the amount.
- Custom amounts must be from $10 to $500 and are rounded to cents.
- Gift cards have **no shipping and no tax**, and can't take discount codes, rewards or gift-card payment.

**Sample deals**

| Deal | Status | Source |
| --- | --- | --- |
| Pay $50 → $60 | live | live shop |
| Pay $200 → $250 | ends Dec 31, limit 2 | a sample |
| Pay $100 → $120 | sold out, ends Nov 30, limit 2 | live shop |

**Card art.** Copy the 10 files from `tf-fox-ds-v1/src/components/gift-cards/art/` into Crane, so Crane stays self-contained. Convert them to webp if that's the Crane convention.

| File | Design name |
| --- | --- |
| `sunrise-fairway.jpg` | Sunrise fairway |
| `on-the-green.jpg` | On the green |
| `clubhouse-lights.jpg` | Clubhouse lights |
| `autumn-round.jpg` | Autumn round |
| `desert-canyon.jpg` | Desert canyon |
| `coastal-cliffs.jpg` | Coastal cliffs |
| `mountain-valley.jpg` | Mountain lake (its id is `mountain-lake`) |
| `holiday-snow.jpg` | Snowy holiday |
| `birthday-gift.jpg` | Birthday gift |
| `celebration-fireworks.jpg` | Fireworks night |

**Sample people.** Fox used Morgan Hale (morgan.hale@example.com) as the buyer and Alex Rivera (alex@example.com, (555) 010-2481) as the recipient. Use Crane's own sample people and domain if Crane has a convention. Don't put any real personal details in.

## 4. Per surface

### Crane Web (1440, 1024, 390)
- Replace `/shop/gift-cards` with the builder.
  - Desktop: steps plus a sticky summary on the right.
  - Laptop: the same, narrower.
  - Mobile web (390): one column, with the summary card at the bottom (or a sticky bottom bar with "You pay" and "Add to cart").
- Keep it deep-linkable, in Crane's style. Suggestion: `?amount=deal-60-for-50|50|custom&design=birthday-gift&for=someone|me`.
- Gift card lines go into Crane's existing cart (`cart-store`). See the open question on mixed carts below.

### Crane Web checkout
- **Cart page:** the gift card line item (thumbnail, title, design and delivery line, deal line, Edit/Remove). Edit returns to the builder with every choice restored.
- **Checkout page:** when the order is gift cards only, swap Ship to → **Send to** and Shipping → **Delivery**. Tax is $0 and shipping isn't needed, so skip the address and tax-by-ZIP step for gift cards.
- **Confirmation page:** **Gift card details** replaces returns, plus the "View the email" link.
- **Account › Wallet:** add the "New" pill, card art thumbnails and the **Sent as gifts** section, and point "Buy gift card" at the builder.
- **Email:** the Self Email and Gift Email as stories, linked from the confirmation.

### iPhone app (402 × 874)

**Entry points**
- Profile › Gift Cards gets a "Buy a gift card" action.
- If the app has a Store tab, add a Gift cards entry there too.

**The builder as a pushed screen**
- The same three steps, stacked.
- Designs: 2 across, or one horizontal row per group.
- A **sticky bottom bar** holds the card thumbnail, "You pay $50", and "Add to cart" (or "Continue"), in place of the right-hand panel.
- "Change" sender can open inline or as a sheet.

**Checkout**
- Use the app's own review-and-pay pattern: the summary sheet and saved cards in `wallet-cards.tsx`.
- Then a confirmation screen with the same content and order as 2.4.

**Wallet and Gift Cards screen**
- The card detail should show the **barcode and QR** for scanning at the Pro Shop counter, which matters most on a phone.
- Add "New" on a just-bought card.
- Add a "Sent as gifts" list.
- Use the dark mode tokens Crane already has (Warm Dark).

**Emails** are the same for every surface.

## 5. Still open (carried over from Fox)

1. **Mixed carts.** Can a gift card share a cart with pro shop items, or does it check out on its own like food?
   - Crane's current gift card page adds it as `retail`.
   - If it mixes, the gift card line must be exempt from shipping and tax.
   - Fox only tested gift-card-only carts.
2. Whether the **$200 → $250** deal (a sample) and the **$10–$500** custom range are real rules.
3. Whether a gift can be **scheduled** for a later date.
4. What the **recipient's phone** is used for. A text with the card?
5. Sign-in: the live site asks before buying. This flow assumes a signed-in golfer.

## 6. Done when

- [ ] Builder: deals first, a sold-out deal, the deal nudge, presets and a custom amount, 10 designs in 3 groups, Someone else / Me, email / print, From with Change, the confirm fields, and the validation copy above.
- [ ] The summary panel (or bottom bar on phone) updates live: card face, value, bonus, you pay, delivery line.
- [ ] Cart → Checkout → Confirmation run in Crane's own layouts, with the gift card substitutions above. Edit restores the builder.
- [ ] Self Email and Gift Email, with a scannable UPC-A barcode (no QR) on the Self Email only.
- [ ] Wallet: the notice, "New", art thumbnails, "Sent as gifts", and "Buy gift card" opening the builder.
- [ ] iPhone app: the builder screen, review and pay, confirmation, and the card detail with barcode and QR.
- [ ] Stories for each state, mirroring the Fox story list, plus the prototype routes.
