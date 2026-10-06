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
  const emphasis = "not the official Hytera website";
  const emphasisAt = after.indexOf(emphasis);

  return (
    <p className={className}>
      {before}
      <a
        href={PARENT_COMPANY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-[#1d4ed8] underline decoration-[#1d4ed8]/30 underline-offset-2 transition hover:decoration-[#1d4ed8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d4ed8]"
      >
        {PARENT_COMPANY}
      </a>
      {emphasisAt === -1 ? (
        after
      ) : (
        <>
          {after.slice(0, emphasisAt)}
          <span className="font-semibold text-[#1e293b]">{emphasis}</span>
          {after.slice(emphasisAt + emphasis.length)}
        </>
      )}
    </p>
  );
}

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
      alt="Authorized Dealer of Hytera"
      width={283}
      height={284}
      priority={priority}
      className={`keep-light shrink-0 rounded-[3px] bg-white object-contain shadow-[0_1px_2px_rgba(15,23,42,0.12)] ring-1 ring-[#c5d99a] ${className}`}
    />
  );
}

export function AuthorizedDealerNotice({
  variant = "header",
  className = "",
}: {
  variant?: "header" | "compact";
  className?: string;
}) {
  if (variant === "compact") {
    return (
      <div
        role="note"
        className={`grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3 rounded-xl border border-[#d5e7ad] bg-[linear-gradient(145deg,#ffffff_0%,#f4f9e8_72%)] p-3 ${className}`}
      >
        <DealerBadge className="h-16 w-16" />
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#2f5d14]">
            Authorized Dealer of Hytera
          </p>
          <DisclaimerText className="mt-1 text-xs leading-relaxed text-[#1e293b]" />
        </div>
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-label="Authorized dealer notice"
      className={`w-full max-w-full border-b-2 border-[#7db52a] bg-[linear-gradient(100deg,#ffffff_0%,#ffffff_18%,#f4f9e8_55%,#e7f3c8_100%)] ${className}`}
    >
      <div className="container-page grid w-full grid-cols-[auto_minmax(0,1fr)] items-center gap-3 py-2.5 sm:gap-4 sm:py-3">
        <DealerBadge
          priority
          className="h-16 w-16 sm:h-20 sm:w-20"
        />
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#2f5d14] sm:text-xs">
            Authorized Dealer of Hytera
          </p>
          <DisclaimerText className="mt-1 text-[13px] font-medium leading-snug text-[#1e293b] [overflow-wrap:anywhere] sm:text-sm sm:[overflow-wrap:normal]" />
        </div>
      </div>
    </div>
  );
}
