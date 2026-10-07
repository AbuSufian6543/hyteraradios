import { SITE_DOMAIN, SITE_EMAIL, SITE_PHONE, PARENT_COMPANY } from "@/lib/constants";

export function WarrantyPolicy() {
  const phoneHref = `tel:${SITE_PHONE.replace(/[^\d+]/g, "")}`;

  return (
    <div className="prose-store max-w-2xl space-y-4">
      <p>
        {SITE_DOMAIN} is operated by {PARENT_COMPANY} The warranty on this page
        applies to products bought from this store.
      </p>

      <h2 className="pt-2 text-lg font-bold text-slate-900 dark:text-white">Radios</h2>
      <p>
        Every radio includes a 1-year limited warranty from the date it ships.
        The warranty covers defects in materials and workmanship under normal
        use. We repair the radio, replace it, or refund the price of the radio
        if we cannot repair it.
      </p>
      <p>
        The warranty does not cover misuse, damage from a drop or liquid beyond
        the radio&apos;s rating, repair by anyone other than us, or a battery
        that has worn out through normal charging.
      </p>

      <h2 className="pt-2 text-lg font-bold text-slate-900 dark:text-white">Accessories</h2>
      <p>
        If an accessory arrives damaged or does not work, contact us with the
        order number. We replace that item or refund it.
      </p>

      <h2 className="pt-2 text-lg font-bold text-slate-900 dark:text-white">Programming</h2>
      <p>
        When you choose a frequency, or you send channel details with the order,
        we program the radio before it ships. If the channels do not match what
        you asked for, we correct the programming at no charge.
      </p>

      <h2 className="pt-2 text-lg font-bold text-slate-900 dark:text-white">How to start a claim</h2>
      <p>
        Call <a href={phoneHref} className="font-semibold text-blue-600 hover:underline">{SITE_PHONE}</a> or email{" "}
        <a href={`mailto:${SITE_EMAIL}`} className="font-semibold text-blue-600 hover:underline">{SITE_EMAIL}</a> with the order number
        and a short description of the problem. Keep the original packaging if
        you still have it. We will tell you whether to return the item.
      </p>
    </div>
  );
}
