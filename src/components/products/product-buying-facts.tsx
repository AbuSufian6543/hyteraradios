import Link from "next/link";

export type ProductBuyingFactsData = {
  fitNote: string | null;
  categories: { name: string; slug: string }[];
  industries: { name: string; slug: string }[];
  signalTypes: string[];
  frequencyBands: string[];
  pairsWith: { name: string; slug: string }[];
  programming: boolean;
  accessoryOnly: boolean;
  quoteHref: string;
};

function Fact({
  label,
  children,
  wide = false,
}: {
  label: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm leading-relaxed text-slate-800 dark:text-slate-100">{children}</dd>
    </div>
  );
}

export function ProductBuyingFacts({ facts }: { facts: ProductBuyingFactsData }) {
  const hasFacts =
    Boolean(facts.fitNote) ||
    facts.categories.length > 0 ||
    facts.industries.length > 0 ||
    facts.signalTypes.length > 0 ||
    facts.frequencyBands.length > 0 ||
    facts.pairsWith.length > 0 ||
    facts.programming;

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
      {facts.fitNote ? (
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">{facts.fitNote}</p>
      ) : null}

      {hasFacts ? (
        <dl className={`grid gap-4 sm:grid-cols-2 ${facts.fitNote ? "mt-4" : ""}`}>
          {facts.signalTypes.length > 0 ? (
            <Fact label="Signal">{facts.signalTypes.join(", ")}</Fact>
          ) : null}
          {facts.frequencyBands.length > 0 ? (
            <Fact label="Band">{facts.frequencyBands.join(", ")}</Fact>
          ) : null}
          {facts.categories.length > 0 ? (
            <Fact label="Type">
              {facts.categories.map((category, index) => (
                <span key={category.slug}>
                  {index > 0 ? ", " : null}
                  <Link
                    href={`/categories/${category.slug}`}
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    {category.name}
                  </Link>
                </span>
              ))}
            </Fact>
          ) : null}
          {facts.industries.length > 0 ? (
            <Fact label="Often used in">
              {facts.industries.map((industry, index) => (
                <span key={industry.slug}>
                  {index > 0 ? ", " : null}
                  <Link
                    href={`/industries/${industry.slug}`}
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    {industry.name}
                  </Link>
                </span>
              ))}
            </Fact>
          ) : null}
          {facts.programming ? (
            <Fact label="Programming" wide>
              We program this radio before it ships. Choose a listed frequency, or
              enter the transmit and receive frequencies your fleet uses.
            </Fact>
          ) : null}
          {facts.pairsWith.length > 0 ? (
            <Fact label="Pairs with" wide>
              {facts.pairsWith.map((item, index) => (
                <span key={item.slug}>
                  {index > 0 ? ", " : null}
                  <Link
                    href={`/products/${item.slug}`}
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    {item.name}
                  </Link>
                </span>
              ))}
            </Fact>
          ) : facts.accessoryOnly ? (
            <Fact label="Fit" wide>
              <Link href="/products" className="font-semibold text-blue-600 hover:underline">
                Find the radio
              </Link>{" "}
              this part belongs with, or ask us to check the model.
            </Fact>
          ) : (
            <Fact label="Accessories" wide>
              <Link
                href="/categories/accessories"
                className="font-semibold text-blue-600 hover:underline"
              >
                Batteries, mics, and earpieces
              </Link>{" "}
              depend on the series. We can confirm what fits.
            </Fact>
          )}
        </dl>
      ) : null}

      <p className={`text-sm text-slate-600 dark:text-slate-300 ${hasFacts || facts.fitNote ? "mt-4" : ""}`}>
        <Link href={facts.quoteHref} className="font-semibold text-blue-600 hover:underline">
          Not sure this is the right fit? Request a quote
        </Link>{" "}
        and we will confirm the model for your site.
      </p>
    </section>
  );
}
