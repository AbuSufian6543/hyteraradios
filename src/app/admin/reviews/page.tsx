import { requireAdmin } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { ReviewsManager, type ReviewRow } from "@/components/admin/reviews-manager";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  await requireAdmin();

  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      product: { select: { name: true, slug: true } },
      user: { select: { email: true } },
    },
  });

  const rows: ReviewRow[] = reviews.map((r) => ({
    id: r.id,
    author: r.author,
    content: r.content,
    rating: r.rating,
    featured: r.featured,
    createdAt: r.createdAt.toISOString(),
    productId: r.productId,
    productName: r.product?.name ?? null,
    productSlug: r.product?.slug ?? null,
    userId: r.userId,
    userEmail: r.user?.email ?? null,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Reviews
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Edit or remove customer and seed reviews. Featured reviews appear on the homepage.
        </p>
      </div>
      <ReviewsManager reviews={rows} />
    </div>
  );
}
