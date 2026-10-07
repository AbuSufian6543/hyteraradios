import Link from "next/link";
import { ArrowUpRight, Radio, Truck, Globe, Headphones } from "lucide-react";

const PATHS = [
  {
    href: "/categories/business-radios",
    title: "Business handhelds",
    text: "On-site teams in a hotel, shop, clinic, school, or yard. Push-to-talk inside one property.",
    icon: Radio,
  },
  {
    href: "/categories/mobile-radios",
    title: "Mobile radios",
    text: "A radio in the vehicle or on the dispatch desk, programmed to the same channels as the crew.",
    icon: Truck,
  },
  {
    href: "/categories/nationwide-radios",
    title: "Nationwide PoC",
    text: "Teams that leave the property. Push-to-talk over LTE and Wi-Fi, without a tower on site.",
    icon: Globe,
  },
  {
    href: "/categories/accessories",
    title: "Accessories",
    text: "Batteries, chargers, speaker mics, and earpieces. Match the part to the radio series.",
    icon: Headphones,
  },
] as const;

export function CatalogChooser() {
  return (
    <section className="mb-10">
      <p className="eyebrow">Start here</p>
      <h2 className="section-title mt-2">Which radio do you need?</h2>
      <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
        Most orders are a fleet, not a single radio. Pick the job first. If you
        are between two of these, ask us and we will match the gear and the
        programming.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {PATHS.map((path) => (
          <Link
            key={path.href}
            href={path.href}
            className="group flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
              <path.icon className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="flex items-center justify-between gap-2 text-base font-bold text-slate-900 group-hover:text-blue-600 dark:text-white">
                {path.title}
                <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-blue-600" />
              </span>
              <span className="mt-1 block text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {path.text}
              </span>
            </span>
          </Link>
        ))}
      </div>
      <p className="mt-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
        A larger site may need a{" "}
        <Link href="/categories/repeaters" className="font-semibold text-blue-600 hover:underline">
          repeater
        </Link>. Hazardous work needs an{" "}
        <Link
          href="/categories/intrinsically-safe"
          className="font-semibold text-blue-600 hover:underline"
        >
          intrinsically safe radio
        </Link>{" "}
        with the certification the site requires.
      </p>
    </section>
  );
}
