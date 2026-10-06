import Image from "next/image";
import {
  HYTERA_DEALER_DISCLAIMER,
  PARENT_COMPANY,
  PARENT_COMPANY_URL,
} from "@/lib/constants";

const BADGE_SRC = "/branding/hytera-authorized-dealer.png";

function DisclaimerText({ className }: { className: string }) {
  const splitAt = HYTERA_DEALER_DISCLAIMER.indexOf(PARENT_COMPANY);

  if (splitAt === -1) {
    return <p className={className}>{HYTERA_DEALER_DISCLAIMER}</p>;
  }

  const before = HYTERA_DEALER_DISCLAIMER.slice(0, splitAt);
  const after = HYTERA_DEALER_DISCLAIMER.slice(splitAt + PARENT_COMPANY.length);

  return (
    <p className={className}>
      {before}
      <a
        href={PARENT_COMPANY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-blue-700 underline decoration-blue-700/30 underline-offset-2 hover:decoration-blue-700 dark:text-blue-400 dark:decoration-blue-400/30"
      >
        {PARENT_COMPANY}
      </a>
      {after}
    </p>
  );
}

function DealerBadge({ className }: { className: string }) {
  return (
    <Image
      src={BADGE_SRC}
      alt="Authorized Dealer of Hytera"
      width={283}
      height={284}
      className={`keep-light shrink-0 bg-white object-contain ${className}`}
    />
  );
}

/** Small lockup for the existing header row. It does not add a banner. */
export function DealerMark({ className = "" }: { className?: string }) {
  return (
    <div
      className={`hidden items-center gap-2 rounded-full border border-[#d7e8b0] bg-[#f7fbea] py-1 pl-1 pr-3 lg:flex ${className}`}
      title={HYTERA_DEALER_DISCLAIMER}
    >
      <DealerBadge className="h-9 w-9 rounded-full" />
      <span className="text-[10px] font-bold uppercase leading-tight tracking-[0.12em] text-[#2f5d14]">
        Authorized
        <br />
        Dealer
      </span>
    </div>
  );
}

/** Homepage treatment: sits in the hero content, not in the sticky header. */
export function DealerHeroNote({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex max-w-xl items-center gap-3 rounded-2xl border border-white/80 bg-white/80 p-2 pr-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/80 ${className}`}
    >
      <DealerBadge className="h-12 w-12 rounded-xl" />
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#3a6b12]">
          Authorized Dealer of Hytera
        </p>
        <DisclaimerText className="mt-0.5 text-[12px] leading-snug text-slate-600 sm:text-[13px]" />
      </div>
    </div>
  );
}

/** One quiet line in the footer, on every page. */
export function DealerFooterLine() {
  return (
    <div className="container-page flex items-center justify-center gap-2.5 py-3.5">
      <DealerBadge className="h-8 w-8 rounded-md" />
      <DisclaimerText className="max-w-3xl text-left text-[11px] leading-snug text-slate-500 sm:text-xs" />
    </div>
  );
}
