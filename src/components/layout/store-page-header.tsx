import { SignalField } from "@/components/home/signal-field";

type StorePageHeaderProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  compact?: boolean;
};

export function StorePageHeader({
  eyebrow,
  title,
  description,
  children,
  compact = false,
}: StorePageHeaderProps) {
  return (
    <section className="hero-light relative overflow-hidden border-b border-slate-200 dark:border-slate-800">
      <SignalField className="signal-field-banner max-lg:hidden" />
      <div
        className={`container-page relative z-10 ${compact ? "py-5" : "py-10 lg:py-14"}`}
      >
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        {title ? (
          <h1 className="mt-2 max-w-3xl text-balance text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100">
            {title}
          </h1>
        ) : null}
        {description ? (
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300">
            {description}
          </p>
        ) : null}
        {children}
      </div>
    </section>
  );
}
