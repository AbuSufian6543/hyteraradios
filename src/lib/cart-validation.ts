import type { Product, ProductVariant } from "@prisma/client";
import { prisma } from "./prisma";

type PurchasableProduct = Pick<Product, "id" | "status" | "hasVariants">;

type PurchasableVariant = Pick<ProductVariant, "id" | "productId">;

export type PurchasableLine = {
  product: PurchasableProduct;
  variant: PurchasableVariant | null;
};

/**
 * Pure validation for a product/variant pair. Used at add-to-cart and checkout.
 */
export function assertPurchasableLine(
  product: PurchasableProduct | null,
  variant: PurchasableVariant | null,
  variantId: string | null,
): { error: string } | { line: PurchasableLine } {
  if (!product) {
    return { error: "Product not found." };
  }

  if (product.status !== "ACTIVE") {
    return { error: "This product is not available." };
  }

  if (product.hasVariants) {
    if (!variantId || !variant) {
      return { error: "Please select a product option." };
    }
    if (variant.productId !== product.id) {
      return { error: "Invalid product option." };
    }
    return { line: { product, variant } };
  }

  if (variantId) {
    return { error: "Invalid product option." };
  }

  return { line: { product, variant: null } };
}

/**
 * Loads product/variant from the DB and validates purchasability.
 */
export async function validatePurchasableLine(
  productId: string,
  variantId: string | null,
): Promise<{ error: string } | { line: PurchasableLine }> {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, status: true, hasVariants: true },
  });

  const variant = variantId
    ? await prisma.productVariant.findUnique({
        where: { id: variantId },
        select: { id: true, productId: true },
      })
    : null;

  return assertPurchasableLine(product, variant, variantId);
}
