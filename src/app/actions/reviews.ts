"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { getActorOrThrow } from "@/lib/admin-guard";
import { recordAudit } from "@/lib/audit";
import { getRequestIp } from "@/lib/request-ip";
import { rateLimitAction } from "@/lib/action-rate-limit";
import { prisma } from "@/lib/prisma";
import {
  getUserProductReview,
  reviewAuthorFromUser,
  userHasPurchasedProduct,
} from "@/lib/product-reviews";

type ActionResult = { success?: boolean; message?: string; error?: string };

const MIN_CONTENT = 10;
const MAX_CONTENT = 2000;

function parseRating(value: FormDataEntryValue | null): number | null {
  const rating = Math.round(Number(value));
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) return null;
  return rating;
}

function parseContent(value: FormDataEntryValue | null): string | null {
  const content = String(value ?? "").trim();
  if (content.length < MIN_CONTENT || content.length > MAX_CONTENT) return null;
  return content;
}

async function revalidateReviewPaths(review: {
  featured: boolean;
  product: { slug: string } | null;
}) {
  if (review.featured) {
    revalidatePath("/");
  }
  if (review.product?.slug) {
    revalidatePath(`/products/${review.product.slug}`);
  }
}

export async function submitProductReviewAction(
  formData: FormData,
): Promise<ActionResult> {
  const limited = await rateLimitAction("product-review", 10, 60_000);
  if (limited) return { error: limited };

  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be signed in to leave a review." };
  }

  const productId = String(formData.get("productId") ?? "").trim();
  const rating = parseRating(formData.get("rating"));
  const content = parseContent(formData.get("content"));

  if (!productId) return { error: "Product is required." };
  if (rating === null) return { error: "Please choose a rating from 1 to 5 stars." };
  if (!content) {
    return {
      error: `Review must be between ${MIN_CONTENT} and ${MAX_CONTENT} characters.`,
    };
  }

  const product = await prisma.product.findFirst({
    where: { id: productId, status: "ACTIVE" },
    select: { id: true, slug: true },
  });
  if (!product) return { error: "Product not found." };

  const purchased = await userHasPurchasedProduct(session.user.id, productId);
  if (!purchased) {
    return {
      error: "Only customers who purchased this product can leave a review.",
    };
  }

  const existing = await getUserProductReview(session.user.id, productId);
  if (existing) {
    return { error: "You have already reviewed this product." };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true },
  });
  if (!user) return { error: "Account not found." };

  await prisma.review.create({
    data: {
      productId,
      userId: session.user.id,
      author: reviewAuthorFromUser(user),
      content,
      rating,
      featured: false,
    },
  });

  revalidatePath(`/products/${product.slug}`);
  return { success: true, message: "Thank you! Your review has been published." };
}

export async function updateReviewAction(formData: FormData): Promise<ActionResult> {
  const actor = await getActorOrThrow();

  const id = String(formData.get("id") ?? "").trim();
  const author = String(formData.get("author") ?? "").trim();
  const rating = parseRating(formData.get("rating"));
  const content = parseContent(formData.get("content"));
  const featured = formData.get("featured") === "on" || formData.get("featured") === "true";

  if (!id) return { error: "Review is required." };
  if (!author) return { error: "Author is required." };
  if (rating === null) return { error: "Rating must be between 1 and 5." };
  if (!content) {
    return {
      error: `Review must be between ${MIN_CONTENT} and ${MAX_CONTENT} characters.`,
    };
  }

  const existing = await prisma.review.findUnique({
    where: { id },
    include: { product: { select: { slug: true } } },
  });
  if (!existing) return { error: "Review not found." };

  const updated = await prisma.review.update({
    where: { id },
    data: { author, content, rating, featured },
    include: { product: { select: { slug: true } } },
  });

  await recordAudit({
    actor,
    action: "UPDATE",
    entityType: "Review",
    entityId: id,
    summary: `Updated review by ${updated.author}`,
    ipAddress: await getRequestIp(),
  });

  await revalidateReviewPaths(updated);
  if (existing.featured) revalidatePath("/");
  if (existing.product?.slug) {
    revalidatePath(`/products/${existing.product.slug}`);
  }

  revalidatePath("/admin/reviews");
  return { success: true, message: "Review updated." };
}

export async function deleteReviewAction(formData: FormData): Promise<ActionResult> {
  const actor = await getActorOrThrow();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { error: "Review is required." };

  const existing = await prisma.review.findUnique({
    where: { id },
    include: { product: { select: { slug: true } } },
  });
  if (!existing) return { error: "Review not found." };

  await prisma.review.delete({ where: { id } });

  await recordAudit({
    actor,
    action: "DELETE",
    entityType: "Review",
    entityId: id,
    summary: `Deleted review by ${existing.author}`,
    ipAddress: await getRequestIp(),
  });

  await revalidateReviewPaths(existing);
  revalidatePath("/admin/reviews");
  return { success: true, message: "Review deleted." };
}
