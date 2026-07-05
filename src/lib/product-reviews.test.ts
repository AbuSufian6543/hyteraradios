import { describe, expect, it } from "vitest";
import {
  isReviewableOrderStatus,
  NON_REVIEWABLE_ORDER_STATUSES,
  REVIEWABLE_ORDER_STATUSES,
  reviewAuthorFromUser,
} from "./product-reviews";

describe("isReviewableOrderStatus", () => {
  it("allows paid-through-delivered statuses", () => {
    for (const status of REVIEWABLE_ORDER_STATUSES) {
      expect(isReviewableOrderStatus(status)).toBe(true);
    }
  });

  it("rejects pending, cancelled, and refunded orders", () => {
    for (const status of NON_REVIEWABLE_ORDER_STATUSES) {
      expect(isReviewableOrderStatus(status)).toBe(false);
    }
  });
});

describe("reviewAuthorFromUser", () => {
  it("prefers the user's display name", () => {
    expect(
      reviewAuthorFromUser({ name: "Jane Doe", email: "jane@example.com" }),
    ).toBe("Jane Doe");
  });

  it("falls back to the email local part", () => {
    expect(reviewAuthorFromUser({ name: null, email: "jane@example.com" })).toBe(
      "jane",
    );
  });
});
