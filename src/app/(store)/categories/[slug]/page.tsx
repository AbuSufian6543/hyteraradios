import { notFound } from "next/navigation";
import { ProductCard } from "@/components/products/product-card";
import { StorePageHeader } from "@/components/layout/store-page-header";
import { BuyingGuide } from "@/components/catalog/buying-guide";
import { CatalogHelp } from "@/components/catalog/catalog-help";
import { prisma } from "@/lib/prisma";
import { getCurrency } from "@/lib/currency-server";
import { getReviewStatsByProductIds } from "@/lib/product-reviews";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
    select: { name: true, description: true },
  });
  if (!category) return { title: "Category Not Found" };
  const description =
    category.description ??
    `Shop ${category.name} from our professional two-way radio catalog.`;
  return {
    title: category.name,
    description,
    alternates: { canonical: `/categories/${slug}` },
    openGraph: {
      type: "website",
      title: category.name,
      description,
      url: `/categories/${slug}`,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const currency = await getCurrency();

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        where: { product: { status: "ACTIVE" } },
        include: { product: true },
      },
    },
  });

  if (!category) notFound();

  const products = category.products.map((p) => p.product);
  const reviewStats = await getReviewStatsByProductIds(products.map((p) => p.id));

  return (
    <>
      <StorePageHeader
        eyebrow="Shop by category"
        title={category.name}
        description={category.description ?? undefined}
      />
    <div className="container-page py-10">
      <BuyingGuide kind="category" slug={category.slug} />
      {products.length === 0 ? (
        <p className="text-slate-600">No products in this category yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
      <CatalogHelp />
    </div>
    </>
  );
}
