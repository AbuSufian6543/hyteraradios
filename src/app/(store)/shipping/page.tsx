import type { Metadata } from "next";
import { getFreeShippingMessage } from "@/lib/shipping";
import { StorePageHeader } from "@/components/layout/store-page-header";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description:
    "Shipping information, processing times, and delivery details for orders across Canada and the United States.",
  alternates: { canonical: "/shipping" },
  openGraph: { type: "website", title: "Shipping Policy", url: "/shipping" },
};

export default async function ShippingPage() {
  const freeShippingMessage = await getFreeShippingMessage();

  return (
    <>
      <StorePageHeader
        eyebrow="Delivery"
        title="Shipping Policy"
        description="Processing times and delivery across Canada and the United States."
      />
    <div className="container-page py-10">
      <div className="max-w-2xl prose-store space-y-4">
        <p>
          We ship to the United States and Canada. Orders are processed within 1-2
          business days from our fulfillment center.
        </p>
        {freeShippingMessage && <p>{freeShippingMessage}</p>}
        <p>
          Standard shipping typically arrives within 3-7 business days depending on
          your location. Tracking information is provided once your order ships.
        </p>
      </div>
    </div>
    </>
  );
}
