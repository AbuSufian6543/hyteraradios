import Link from "next/link";
import type { ShippingRegionData } from "@/lib/shipping";
import { formatPrice } from "@/lib/utils";
import { SITE_EMAIL, SITE_PHONE } from "@/lib/constants";

function countryName(code: string): string {
  if (code === "CA") return "Canada";
  if (code === "US") return "United States";
  return code;
}

function currencyFor(code: string): "CAD" | "USD" {
  return code === "US" ? "USD" : "CAD";
}

export function ShippingPolicy({ regions }: { regions: ShippingRegionData[] }) {
  const phoneHref = `tel:${SITE_PHONE.replace(/[^\d+]/g, "")}`;

  return (
    <div className="prose-store max-w-2xl space-y-4">
      <p>
        We ship to Canada and the United States from Sault Ste. Marie, Ontario.
        In-stock orders are processed within 1-2 business days.
      </p>
      <p>
        When an order includes channel programming, we program the radio before
        it leaves. Programming is part of the order and can take longer than the
        standard 1-2 business days. The shipping window starts after the radio
        is programmed.
      </p>
      <p>
        After an order ships, delivery is typically 3-7 business days, depending
        on the destination. We email tracking when the shipment is on its way.
      </p>

      <h2 className="pt-2 text-lg font-bold text-slate-900 dark:text-white">Free shipping</h2>
      {regions.length === 0 ? (
        <p>Shipping rates are confirmed at checkout.</p>
      ) : (
        <ul className="list-disc space-y-2 pl-5">
          {regions.map((region) => {
            const place = countryName(region.country);
            const currency = currencyFor(region.country);
            const threshold = formatPrice(region.thresholdCents, currency);
            const flat = formatPrice(region.flatRateCents, currency);
            return (
              <li key={region.country}>
                {region.displayMessage ? (
                  region.displayMessage
                ) : region.freeShippingEnabled ? (
                  <>
                    Free shipping to {place} on orders of {threshold} or more.
                    Orders under that amount ship for {flat}.
                  </>
                ) : (
                  <>Shipping to {place} is {flat}.</>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <h2 className="pt-2 text-lg font-bold text-slate-900 dark:text-white">Duties and taxes</h2>
      <p>
        Checkout includes the product price and our shipping charge. An order
        that crosses the border may also be assessed duties or taxes by customs.
        Those charges are billed to the recipient. They are not added by us at
        checkout.
      </p>

      <p>
        Questions about a shipment: call{" "}
        <a href={phoneHref} className="font-semibold text-blue-600 hover:underline">{SITE_PHONE}</a> or email{" "}
        <a href={`mailto:${SITE_EMAIL}`} className="font-semibold text-blue-600 hover:underline">{SITE_EMAIL}</a>. Warranty coverage is
        on the <Link href="/warranty" className="font-semibold text-blue-600 hover:underline">warranty page</Link>.
      </p>
    </div>
  );
}
