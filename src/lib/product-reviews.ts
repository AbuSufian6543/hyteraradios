import type { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const REVIEWABLE_ORDER_STATUSES: OrderStatus[] = [
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];

export const NON_REVIEWABLE_ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "CANCELLED",
  "REFUNDED",
];

export function isReviewableOrderStatus(status: OrderStatus): boolean {
  return REVIEWABLE_ORDER_STATUSES.includes(status);
}

export async function userHasPurchasedProduct(
  userId: string,
  productId: string,
): Promise<boolean> {
  const item = await prisma.orderItem.findFirst({
    where: {
      productId,
      order: {
        userId,
        status: { in: REVIEWABLE_ORDER_STATUSES },
      },
    },
    select: { id: true },
  });
  return item !== null;
}

export async function getUserProductReview(userId: string, productId: string) {
  return prisma.review.findFirst({
    where: { userId, productId },
    select: {
      id: true,
      author: true,
      content: true,
      rating: true,
      createdAt: true,
    },
  });
}

export type ProductReviewEligibility = {
  canReview: boolean;
  hasReviewed: boolean;
  existingReview: {
    id: string;
    author: string;
    content: string;
    rating: number;
    createdAt: Date;
  } | null;
};

export async function getProductReviewEligibility(
  userId: string | undefined,
  productId: string,
): Promise<ProductReviewEligibility> {
  if (!userId) {
    return { canReview: false, hasReviewed: false, existingReview: null };
  }

  const existingReview = await getUserProductReview(userId, productId);
  if (existingReview) {
    return { canReview: false, hasReviewed: true, existingReview };
  }

  const purchased = await userHasPurchasedProduct(userId, productId);
  return {
    canReview: purchased,
    hasReviewed: false,
    existingReview: null,
  };
}

export function reviewAuthorFromUser(user: {
  name: string | null;
  email: string;
}): string {
  const name = user.name?.trim();
  if (name) return name;
  const local = user.email.split("@")[0]?.trim();
  return local || user.email;
}

export type ProductReviewStats = {
  avgRating: number;
  reviewCount: number;
};

export function summarizeReviewRatings(
  ratings: number[],
): ProductReviewStats | null {
  if (ratings.length === 0) return null;
  const total = ratings.reduce((sum, rating) => sum + rating, 0);
  return {
    avgRating: total / ratings.length,
    reviewCount: ratings.length,
  };
}

export async function getReviewStatsByProductIds(
  productIds: string[],
): Promise<Map<string, ProductReviewStats>> {
  const uniqueIds = [...new Set(productIds.filter(Boolean))];
  if (uniqueIds.length === 0) return new Map();

  const reviews = await prisma.review.findMany({
    where: { productId: { in: uniqueIds } },
    select: { productId: true, rating: true },
  });

  const ratingsByProduct = new Map<string, number[]>();
  for (const review of reviews) {
    if (!review.productId) continue;
    const ratings = ratingsByProduct.get(review.productId) ?? [];
    ratings.push(review.rating);
    ratingsByProduct.set(review.productId, ratings);
  }

  const stats = new Map<string, ProductReviewStats>();
  for (const [productId, ratings] of ratingsByProduct) {
    const summary = summarizeReviewRatings(ratings);
    if (summary) stats.set(productId, summary);
  }
  return stats;
}
