"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast-provider";
import { createReviewAction } from "@/app/actions/reviews";

export type ReviewProductOption = {
  id: string;
  name: string;
  slug: string;
  status: string;
};

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (rating: number) => void;
}) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const rating = i + 1;
        return (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            className={`text-xl ${rating <= value ? "text-amber-400" : "text-slate-300"}`}
            aria-label={`${rating} stars`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}

export function ReviewCreateForm({ products }: { products: ReviewProductOption[] }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [productId, setProductId] = useState("");
  const [homepageOnly, setHomepageOnly] = useState(false);
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [featured, setFeatured] = useState(false);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        (p.status === "DRAFT" && "draft".includes(q)),
    );
  }, [products, search]);

  function resetForm() {
    setSearch("");
    setProductId("");
    setHomepageOnly(false);
    setAuthor("");
    setRating(5);
    setContent("");
    setFeatured(false);
  }

  function handleHomepageOnlyChange(checked: boolean) {
    setHomepageOnly(checked);
    if (checked) {
      setProductId("");
      setFeatured(true);
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    startTransition(async () => {
      const formData = new FormData();
      formData.set("author", author);
      formData.set("content", content);
      formData.set("rating", String(rating));
      if (homepageOnly) {
        formData.set("homepageOnly", "true");
        formData.set("featured", "true");
      } else {
        if (productId) formData.set("productId", productId);
        if (featured) formData.set("featured", "true");
      }

      const result = await createReviewAction(formData);
      if (result?.error) {
        showToast(result.error, "error");
        return;
      }

      showToast(result?.message ?? "Review created.");
      resetForm();
      setOpen(false);
      router.refresh();
    });
  }

  if (!open) {
    return (
      <Button type="button" onClick={() => setOpen(true)}>
        Add review
      </Button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Add review
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Create a manual review for any product or a homepage testimonial.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            setOpen(false);
            resetForm();
          }}
        >
          Cancel
        </Button>
      </div>

      <div className="mt-6 space-y-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={homepageOnly}
            onChange={(e) => handleHomepageOnlyChange(e.target.checked)}
          />
          Homepage only (no product)
        </label>

        {!homepageOnly && (
          <div>
            <Label htmlFor="review-product-search">Product</Label>
            <Input
              id="review-product-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              className="mt-1"
            />
            <select
              id="review-product"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="mt-2 h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-950"
            >
              <option value="">Select a product…</option>
              {filteredProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                  {p.status === "DRAFT" ? " (Draft)" : ""}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <Label htmlFor="review-author">Author</Label>
          <Input
            id="review-author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label>Rating</Label>
          <div className="mt-1">
            <StarRating value={rating} onChange={setRating} />
          </div>
        </div>

        <div>
          <Label htmlFor="review-content">Content</Label>
          <textarea
            id="review-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            minLength={10}
            maxLength={2000}
            rows={4}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          />
        </div>

        {!homepageOnly && (
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
            Featured on homepage
          </label>
        )}
      </div>

      <div className="mt-6">
        <Button type="submit" disabled={pending}>
          {pending ? "Creating…" : "Create review"}
        </Button>
      </div>
    </form>
  );
}
