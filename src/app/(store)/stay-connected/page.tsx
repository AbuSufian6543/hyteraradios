import Link from "next/link";
import { QuoteForm } from "@/components/forms/quote-form";
import { StorePageHeader } from "@/components/layout/store-page-header";

export default async function StayConnectedPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product = "" } = await searchParams;

  return (
    <>
      <StorePageHeader
        eyebrow="No-cost consultation"
        title="Need a Quote? Let's Connect."
        description="Tell us what you need and our team will get back to you with pricing and availability."
      />
    <div className="container-page py-10">
      <div className="mx-auto max-w-2xl">
        <div>
          <QuoteForm defaultProduct={product} />
        </div>
        <p className="mt-6 text-center text-sm text-slate-500">
          Prefer to call?{" "}
          <Link href="/contact" className="text-blue-600 hover:underline">
            View our contact info
          </Link>
        </p>
      </div>
    </div>
    </>
  );
}
