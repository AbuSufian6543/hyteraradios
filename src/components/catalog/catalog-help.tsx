import Link from "next/link";

export function CatalogHelp() {
  return (
    <aside className="mt-12 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-6 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
      <div>
        <p className="font-bold text-slate-900 dark:text-white">Need help choosing?</p>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          Tell us the site, how many people need radios, and whether they leave
          the property. We will match the model and program the channels.
        </p>
      </div>
      <Link
        href="/stay-connected"
        className="inline-flex h-11 shrink-0 items-center justify-center rounded-lg bg-blue-600 px-5 text-sm font-bold text-white hover:bg-blue-700"
      >
        Request a Quote
      </Link>
    </aside>
  );
}
