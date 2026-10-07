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

/** Official badge, shown at its own proportions. No crop, ring, or recolor. */
function DealerBadge({
  className,
  title,
}: {
  className: string;
  title?: string;
}) {
  return (
    <Image
      src={BADGE_SRC}
      alt="Authorized Dealer of Hytera"
      width={283}
      height={284}
      title={title}
      style={{ width: "auto" }}
      className={`keep-light w-auto max-w-none shrink-0 object-contain object-left ${className}`}
    />
  );
}

/** Official badge in the existing header row. It does not add a banner. */
export function DealerMark({ className = "" }: { className?: string }) {
  return (
    <DealerBadge
      title={HYTERA_DEALER_DISCLAIMER}
      className={`hidden h-[4.5rem] lg:block ${className}`}
    />
  );
}

/** Homepage treatment: official badge beside the independence sentence. */
export function DealerHeroNote({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex max-w-xl items-center gap-4 rounded-2xl border border-white/80 bg-white/75 py-2.5 pl-2.5 pr-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/80 ${className}`}
      title={HYTERA_DEALER_DISCLAIMER}
    >
      <DealerBadge className="h-20" />
      <DisclaimerText className="min-w-0 text-[12px] leading-snug text-slate-600 sm:text-[13px]" />
    </div>
  );
}
