import type { Metadata } from "next";
import { StorePageHeader } from "@/components/layout/store-page-header";
import { WarrantyPolicy } from "@/components/policies/warranty-policy";

export const metadata: Metadata = {
  title: "Warranty",
  description:
    "1-year limited warranty on radios bought from Hyteraradios.ca, plus how to start a claim.",
  alternates: { canonical: "/warranty" },
  openGraph: { type: "website", title: "Warranty", url: "/warranty" },
};

export default function WarrantyPage() {
  return (
    <>
      <StorePageHeader
        eyebrow="Coverage"
        title="Warranty"
        description="Radios include a 1-year limited warranty from the day they ship."
      />
      <div className="container-page py-10">
        <WarrantyPolicy />
      </div>
    </>
  );
}
