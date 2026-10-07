import Link from "next/link";
import { CATEGORY_GUIDES, INDUSTRY_GUIDES } from "@/lib/buying-guides";

export function BuyingGuide({
  kind,
  slug,
}: {
  kind: "category" | "industry";
  slug: string;
}) {
  const guide = kind === "category" ? CATEGORY_GUIDES[slug] : INDUSTRY_GUIDES[slug];
  if (!guide) return null;

  const links = "also" in guide ? guide.also : guide.startWith;

  return (
    <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
      <p className="eyebrow">How to choose</p>
      <h2 className="mt-2 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
        {guide.headline}
      </h2>
      <div className="mt-4 max-w-3xl space-y-3 text-[15px] leading-7 text-slate-600 dark:text-slate-300">
        {guide.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {links.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
