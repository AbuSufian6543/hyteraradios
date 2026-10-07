import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductCard } from "@/components/products/product-card";
import { SearchForm } from "@/components/forms/search-form";
import { StorePageHeader } from "@/components/layout/store-page-header";
import { BuyingGuide } from "@/components/catalog/buying-guide";
import { CatalogChooser } from "@/components/catalog/catalog-chooser";
import { CatalogHelp } from "@/components/catalog/catalog-help";
import { prisma } from "@/lib/prisma";
import { getCurrency } from "@/lib/currency-server";
import { getReviewStatsByProductIds } from "@/lib/product-reviews";

export const metadata: Metadata = {
  title: "Shop Radios and Accessories",
  description:
    "Browse Hytera business handhelds, mobile radios, nationwide PoC radios, and accessories. We program channels before the radio ships.",
  alternates: { canonical: "/products" },
  openGraph: {
    type: "website",
    title: "Shop Radios and Accessories",
    description:
      "Browse Hytera business handhelds, mobile radios, nationwide PoC radios, and accessories.",
    url: "/products",
  },
};

function catalogHref(category: string, page: number) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/products?${query}` : "/products";
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const { category = "", page = "1" } = await searchParams;
  const categorySlug = category.trim();
  const currency = await getCurrency();
  const pageNum = Math.max(1, Number(page) || 1);
  const perPage = 24;
  const skip = (pageNum - 1) * perPage;

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { name: true, slug: true, description: true },
  });
  const activeCategory = categorySlug
    ? categories.find((item) => item.slug === categorySlug)
    : undefined;
  if (categorySlug && !activeCategory) notFound();

  const where = {
    status: "ACTIVE" as const,
    ...(activeCategory
      ? { categories: { some: { category: { slug: activeCategory.slug } } } }
      : {}),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: [{ isBestSeller: "desc" }, { name: "asc" }],
      skip,
      take: perPage,
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(total / perPage);
  const reviewStats = await getReviewStatsByProductIds(products.map((product) => product.id));

  return (
    <>
      <StorePageHeader
        eyebrow="Catalog"
        title={activeCategory ? activeCategory.name : "Shop Radios and Accessories"}
        description={
          activeCategory?.description ??
          "Business handhelds, vehicle radios, nationwide PoC, and the accessories that go with them."
        }
      >
        <div className="mt-6 max-w-xl">
          <SearchForm />
        </div>
      </StorePageHeader>
      <div className="container-page py-10">
        {activeCategory ? (
          <BuyingGuide kind="category" slug={activeCategory.slug} />
        ) : (
          <CatalogChooser />
        )}

        <div className="flex flex-wrap gap-2">
          <Link
            href="/products"
            className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
              activeCategory
                ? "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                : "border-blue-600 bg-blue-600 text-white"
            }`}
          >
            All
          </Link>
          {categories.map((item) => {
            const selected = item.slug === activeCategory?.slug;
            return (
              <Link
                key={item.slug}
                href={catalogHref(item.slug, 1)}
                className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                  selected
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        <p className="mt-6 text-sm text-slate-600 dark:text-slate-300">
          {total} product{total === 1 ? "" : "s"}
          {totalPages > 1 ? ` · Page ${pageNum} of ${totalPages}` : ""}
        </p>

        {products.length === 0 ? (
          <p className="mt-8 text-slate-600 dark:text-slate-300">
            No products in this group yet.{" "}
            <Link href="/products" className="font-semibold text-blue-600 hover:underline">
              View the full catalog
            </Link>
            .
          </p>
        ) : (
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
        )}

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {pageNum > 1 && (
              <Link
                href={catalogHref(activeCategory?.slug ?? "", pageNum - 1)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                Previous
              </Link>
            )}
            {pageNum < totalPages && (
              <Link
                href={catalogHref(activeCategory?.slug ?? "", pageNum + 1)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                Next
              </Link>
            )}
          </div>
        )}

        <CatalogHelp />
      </div>
    </>
  );
}
