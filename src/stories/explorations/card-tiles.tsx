import { SagamoreLogo } from "@/components/foundations/sagamore/sagamore-logo";
import { CreditCard } from "@/components/shared-assets/credit-card/credit-card";
import { cx } from "@/utils/cx";
import { money, StarRating } from "./store-ui";

/**
 * Shop-all-style tiles for the two Pro Shop "card" products (gift card, punch card),
 * matching the ProductCard anatomy so they sit alongside real products. Shared by the
 * Cards "Shop All" story and the main Pro Shop Shop All grid.
 */

export const GiftCardTile = ({ onOpen }: { onOpen?: () => void }) => (
    <button type="button" onClick={onOpen} className="group flex flex-col text-left">
        <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-secondary p-5 ring-1 ring-secondary transition duration-100 ease-linear ring-inset group-hover:ring-brand">
            <CreditCard type="brand-dark" width={190} company="Sagamore Gift Card" cardHolder="Gift Card" cardNumber="$50 – $500" cardExpiration="No expiry" logo={<SagamoreLogo className="max-h-6 max-w-full object-contain" />} />
        </div>
        <p className="mt-3 truncate text-sm font-semibold tracking-wide text-primary uppercase">Digital Gift Card</p>
        <StarRating rating={4.9} count={128} className="mt-1" />
        <p className="mt-1 text-sm font-semibold text-primary tabular-nums">From {money(50)}</p>
    </button>
);

export const PunchCardTile = ({ onOpen }: { onOpen?: () => void }) => (
    <button type="button" onClick={onOpen} className="group flex flex-col text-left">
        <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-secondary p-6 ring-1 ring-secondary transition duration-100 ease-linear ring-inset group-hover:ring-brand">
            <div className="w-full max-w-[220px] rounded-xl bg-brand-primary p-4">
                <p className="text-xs font-semibold tracking-wide text-brand-secondary uppercase">Punch Card</p>
                <div className="mt-3 grid grid-cols-5 gap-2">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <span key={i} className={cx("aspect-square rounded-full", i < 3 ? "bg-brand-solid" : "bg-primary ring-1 ring-secondary ring-inset")} />
                    ))}
                </div>
            </div>
        </div>
        <p className="mt-3 truncate text-sm font-semibold tracking-wide text-primary uppercase">Punch Card</p>
        <StarRating rating={4.8} count={64} className="mt-1" />
        <p className="mt-1 text-sm font-semibold text-primary tabular-nums">From {money(200)}</p>
    </button>
);
