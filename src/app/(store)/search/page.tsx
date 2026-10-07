import Link from "next/link";
import { redirect } from "next/navigation";
import { ProductCard } from "@/components/products/product-card";
import { prisma } from "@/lib/prisma";
import { getCurrency } from "@/lib/currency-server";
import { getReviewStatsByProductIds } from "@/lib/product-reviews";
import { SearchForm } from "@/components/forms/search-form";
import { StorePageHeader } from "@/components/layout/store-page-header";
import type { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}): Promise<Metadata> {
  const { q = "" } = await searchParams;
  const query = q.trim();
  return {
    title: query ? `Search: ${query}` : "Search",
    description: query
      ? `Search results for "${query}" in our two-way radio catalog.`
      : "Search our full catalog of professional two-way radios and accessories.",
    alternates: { canonical: "/search" },
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q = "", page = "1" } = await searchParams;
  const query = q.trim();
  if (!query) redirect("/products");
  const currency = await getCurrency();
  const pageNum = Math.max(1, Number(page) || 1);
  const perPage = 24;
  const skip = (pageNum - 1) * perPage;

  const where = query
    ? {
        status: "ACTIVE" as const,
        OR: [
          { name: { contains: query, mode: "insensitive" as const } },
          { brand: { contains: query, mode: "insensitive" as const } },
          { description: { contains: query, mode: "insensitive" as const } },
        ],
      }
    : { status: "ACTIVE" as const };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { name: "asc" },
      skip,
      take: perPage,
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(total / perPage);
  const reviewStats = await getReviewStatsByProductIds(products.map((p) => p.id));

  return (
    <>
      <StorePageHeader
        eyebrow="Catalog"
        title="Search Products"
        description="Business, commercial, and nationwide radios, plus the accessories that go with them."
      >
        <div className="mt-6 max-w-xl">
          <SearchForm initialQuery={query} />
        </div>
      </StorePageHeader>
    <div className="container-page py-10">
      <p className="text-sm text-slate-600">
        {total} product{total === 1 ? "" : "s"} found for &ldquo;{query}&rdquo;
        {totalPages > 1 && ` · Page ${pageNum} of ${totalPages}`}
        {" · "}
        <Link href="/products" className="font-semibold text-blue-600 hover:underline">
          Browse the catalog
        </Link>
      </p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            currency={currency}
            reviewStats={reviewStats.get(product.id) ?? null}
          />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {pageNum > 1 && (
            <a
              href={`/search?${new URLSearchParams({ ...(query ? { q: query } : {}), page: String(pageNum - 1) }).toString()}`}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50"
            >
              Previous
            </a>
          )}
          {pageNum < totalPages && (
            <a
              href={`/search?${new URLSearchParams({ ...(query ? { q: query } : {}), page: String(pageNum + 1) }).toString()}`}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50"
            >
              Next
            </a>
          )}
        </div>
      )}
    </div>
    </>
  );
}
