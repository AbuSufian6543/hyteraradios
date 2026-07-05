"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast-provider";
import { submitProductReviewAction } from "@/app/actions/reviews";

export function ProductReviewForm({
  productId,
  onSubmitted,
}: {
  productId: string;
  onSubmitted?: () => void;
}) {
  const { showToast } = useToast();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [pending, setPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const formData = new FormData(e.currentTarget);
    formData.set("productId", productId);
    formData.set("rating", String(rating));

    const result = await submitProductReviewAction(formData);
    setPending(false);

    if (result?.error) {
      showToast(result.error, "error");
      return;
    }

    showToast(result?.message ?? "Review submitted.");
    setSubmitted(true);
    onSubmitted?.();
  }

  if (submitted) {
    return (
      <div className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
        Thank you! Your review has been published.
      </div>
    );
  }

  const displayRating = hoverRating || rating;

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 rounded-2xl border border-slate-200 bg-slate-50 p-5"
    >
      <h3 className="text-lg font-semibold text-slate-900">Write a review</h3>
      <p className="mt-1 text-sm text-slate-600">
        Share your experience with this product.
      </p>

      <div className="mt-4">
        <span className="text-sm font-medium text-slate-700">Your rating</span>
        <div className="mt-2 flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => {
            const value = i + 1;
            const filled = value <= displayRating;
            return (
              <button
                key={value}
                type="button"
                aria-label={`${value} star${value === 1 ? "" : "s"}`}
                className="rounded p-0.5 transition hover:scale-110"
                onMouseEnter={() => setHoverRating(value)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(value)}
              >
                <Star
                  className={`h-7 w-7 ${
                    filled ? "fill-amber-400 text-amber-400" : "text-slate-300"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="review-content" className="text-sm font-medium text-slate-700">
          Your review
        </label>
        <textarea
          id="review-content"
          name="content"
          required
          minLength={10}
          maxLength={2000}
          rows={4}
          placeholder="What did you like or dislike? How has it performed for your team?"
          className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <Button type="submit" disabled={pending} className="mt-4">
        {pending ? "Submitting…" : "Submit review"}
      </Button>
    </form>
  );
}
