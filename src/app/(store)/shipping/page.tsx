import type { Metadata } from "next";
import { StorePageHeader } from "@/components/layout/store-page-header";
import { ShippingPolicy } from "@/components/policies/shipping-policy";
import { getShippingRegions } from "@/lib/shipping";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description:
    "Processing times, programming, free-shipping thresholds, and delivery for orders across Canada and the United States.",
  alternates: { canonical: "/shipping" },
  openGraph: { type: "website", title: "Shipping Policy", url: "/shipping" },
};

export default async function ShippingPage() {
  const regions = await getShippingRegions();

  return (
    <>
      <StorePageHeader
        eyebrow="Delivery"
        title="Shipping Policy"
        description="Processing, programming, and delivery across Canada and the United States."
      />
      <div className="container-page py-10">
        <ShippingPolicy regions={regions} />
      </div>
    </>
  );
}
