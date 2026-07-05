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
