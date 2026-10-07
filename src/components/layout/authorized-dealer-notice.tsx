import Image from "next/image";
import {
  HYTERA_DEALER_DISCLAIMER,
  PARENT_COMPANY,
  PARENT_COMPANY_URL,
} from "@/lib/constants";

const BADGE_SRC = "/branding/hytera-authorized-dealer.png";

/** Removed only from the footer line. The rest of the sentence stays intact. */
const FOOTER_OMITTED_CLAUSE = " and is not the official Hytera website.";

function DisclaimerText({
  className,
  linkClassName = "font-semibold text-[#1d4ed8] underline decoration-[#1d4ed8]/30 underline-offset-2 hover:decoration-[#1d4ed8]",
  trailing = "full",
}: {
  className: string;
  linkClassName?: string;
  trailing?: "full" | "footer";
}) {
  const splitAt = HYTERA_DEALER_DISCLAIMER.indexOf(PARENT_COMPANY);

  if (splitAt === -1) {
    return <p className={className}>{HYTERA_DEALER_DISCLAIMER}</p>;
  }

  const before = HYTERA_DEALER_DISCLAIMER.slice(0, splitAt);
  const after = HYTERA_DEALER_DISCLAIMER.slice(splitAt + PARENT_COMPANY.length);
  const suffix =
    trailing === "footer" && after === FOOTER_OMITTED_CLAUSE ? "" : after;

  return (
    <p className={className}>
      {before}
      <a
        href={PARENT_COMPANY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClassName}
      >
        {PARENT_COMPANY}
      </a>
      {suffix}
    </p>
  );
}

/**
 * Official artwork, unmodified. No crop, circle, recolor, or extra frame.
 * Callers only set the height; width follows the file.
 */
function DealerBadge({
  className,
  priority = false,
}: {
  className: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={BADGE_SRC}
      alt="Hytera Authorized Dealer"
      width={283}
      height={284}
      priority={priority}
      className={`keep-light block w-auto max-w-none shrink-0 rounded-none object-contain object-left ${className}`}
    />
  );
}

/** Desktop header lockup. Sits in the existing row and does not add a banner. */
export function DealerMark({ className = "" }: { className?: string }) {
  return (
    <div
      className={`hidden shrink-0 items-center gap-3 lg:flex ${className}`}
      title={HYTERA_DEALER_DISCLAIMER}
    >
      <span aria-hidden className="h-8 w-px bg-slate-300" />
      <DealerBadge className="h-16" priority />
    </div>
  );
}

/** Mobile menu. The top bar is too narrow for the full badge. */
export function DealerDrawerNote() {
  return (
    <div className="flex items-center gap-3 border-t border-slate-200 pt-4">
      <DealerBadge className="h-16" />
      <DisclaimerText className="min-w-0 text-[12px] leading-snug text-[#475569]" />
    </div>
  );
}

/** Homepage and about: the official badge beside the full independence sentence. */
export function DealerHeroNote({ className = "" }: { className?: string }) {
  return (
    <div
      className={`keep-light flex max-w-xl items-center gap-3.5 rounded-2xl border border-[#e2e8f0] bg-white py-2.5 pl-2.5 pr-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)] ${className}`}
    >
      <DealerBadge className="h-[4.75rem]" />
      <DisclaimerText className="min-w-0 text-[13px] leading-snug text-[#475569]" />
    </div>
  );
}

/** Footer line on every page. The official-website clause is omitted here only. */
export function DealerFooterLine() {
  return (
    <div className="container-page flex flex-col items-center justify-center gap-3 py-5 sm:flex-row sm:gap-4">
      <DealerBadge className="h-16" />
      <DisclaimerText
        trailing="footer"
        linkClassName="font-semibold text-blue-600 underline decoration-blue-600/30 underline-offset-2 hover:decoration-blue-600"
        className="max-w-xl text-center text-xs leading-relaxed text-slate-500 sm:text-left"
      />
    </div>
  );
}
