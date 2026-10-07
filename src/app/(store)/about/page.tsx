import Link from "next/link";
import type { Metadata } from "next";
import { DealerHeroNote } from "@/components/layout/authorized-dealer-notice";
import { StorePageHeader } from "@/components/layout/store-page-header";
import { PARENT_COMPANY, PARENT_COMPANY_URL, SITE_DOMAIN, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${SITE_NAME} and our professional two-way radio and communication solutions.`,
  alternates: { canonical: "/about" },
  openGraph: { type: "website", title: "About Us", url: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <StorePageHeader
        eyebrow="Who we are"
        title={`About ${SITE_NAME}`}
        description="Professional two-way radio and communication solutions for teams across Canada and the US."
      />
    <div className="container-page py-12">
      <div className="prose-store max-w-3xl space-y-4">
        <p>
          {SITE_NAME} delivers professional two-way radio and communication
          solutions for businesses across hospitality, retail, healthcare,
          education, construction, security, and public safety. We offer a
          complete range of digital radios, accessories, expert programming, and
          nationwide sales and support.
        </p>
        <p>
          {SITE_DOMAIN} is owned and operated by{" "}
          <Link
            href={PARENT_COMPANY_URL}
            target="_blank"
            className="font-semibold text-blue-600 hover:underline"
          >
            {PARENT_COMPANY}
          </Link>
          , a trusted communications provider based in Sault Ste. Marie, Ontario,
          with decades of experience serving teams across Canada and the US.
        </p>
        <DealerHeroNote />
        <p>
          Whether you need compact business radios, rugged commercial units, or
          nationwide push-to-talk over LTE, our team will match the right gear and
          programming to your workflows and existing fleets.
        </p>
      </div>
    </div>
    </>
  );
}
