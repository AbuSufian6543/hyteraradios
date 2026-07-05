import { describe, expect, it } from "vitest";
import { assertPurchasableLine } from "./cart-validation";

const activeSimple = {
  id: "prod-1",
  status: "ACTIVE" as const,
  hasVariants: false,
};

const activeVariantProduct = {
  id: "prod-2",
  status: "ACTIVE" as const,
  hasVariants: true,
};

const draftProduct = {
  id: "prod-3",
  status: "DRAFT" as const,
  hasVariants: false,
};

const variantForProd2 = {
  id: "var-1",
  productId: "prod-2",
};

const variantWrongProduct = {
  id: "var-2",
  productId: "other",
};

describe("assertPurchasableLine", () => {
  it("accepts an active product without variants", () => {
    const result = assertPurchasableLine(activeSimple, null, null);
    expect(result).toEqual({ line: { product: activeSimple, variant: null } });
  });

  it("rejects missing product", () => {
    expect(assertPurchasableLine(null, null, null)).toEqual({
      error: "Product not found.",
    });
  });

  it("rejects draft products", () => {
    expect(assertPurchasableLine(draftProduct, null, null)).toEqual({
      error: "This product is not available.",
    });
  });

  it("requires a variant when product has variants", () => {
    expect(assertPurchasableLine(activeVariantProduct, null, null)).toEqual({
      error: "Please select a product option.",
    });
  });

  it("accepts a matching variant", () => {
    const result = assertPurchasableLine(
      activeVariantProduct,
      variantForProd2,
      "var-1",
    );
    expect(result).toEqual({
      line: { product: activeVariantProduct, variant: variantForProd2 },
    });
  });

  it("rejects variant from a different product", () => {
    expect(
      assertPurchasableLine(activeVariantProduct, variantWrongProduct, "var-2"),
    ).toEqual({ error: "Invalid product option." });
  });

  it("rejects unexpected variant on a simple product", () => {
    expect(assertPurchasableLine(activeSimple, variantForProd2, "var-1")).toEqual({
      error: "Invalid product option.",
    });
  });
});
