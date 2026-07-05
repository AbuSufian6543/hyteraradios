"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { ConfirmButton } from "@/components/ui/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast-provider";
import { deleteReviewAction, updateReviewAction } from "@/app/actions/reviews";

export type ReviewRow = {
  id: string;
  author: string;
  content: string;
  rating: number;
  featured: boolean;
  createdAt: string;
  productId: string | null;
  productName: string | null;
  productSlug: string | null;
  userId: string | null;
  userEmail: string | null;
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
            className={`text-lg ${rating <= value ? "text-amber-400" : "text-slate-300"}`}
            aria-label={`${rating} stars`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}

function ReviewEditForm({
  review,
  onCancel,
  onSaved,
}: {
  review: ReviewRow;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const { showToast } = useToast();
  const [pending, startTransition] = useTransition();
  const [author, setAuthor] = useState(review.author);
  const [content, setContent] = useState(review.content);
  const [rating, setRating] = useState(review.rating);
  const [featured, setFeatured] = useState(review.featured);

  function handleSave() {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("id", review.id);
      formData.set("author", author);
      formData.set("content", content);
      formData.set("rating", String(rating));
      if (featured) formData.set("featured", "true");

      const result = await updateReviewAction(formData);
      if (result?.error) {
        showToast(result.error, "error");
        return;
      }
      showToast(result?.message ?? "Updated.");
      onSaved();
    });
  }

  return (
    <div className="space-y-3 rounded-lg border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900 dark:bg-blue-950/20">
      <div>
        <Label htmlFor={`author-${review.id}`}>Author</Label>
        <Input
          id={`author-${review.id}`}
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="mt-1"
        />
      </div>
      <div>
        <Label>Rating</Label>
        <StarRating value={rating} onChange={setRating} />
      </div>
      <div>
        <Label htmlFor={`content-${review.id}`}>Content</Label>
        <textarea
          id={`content-${review.id}`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
        />
        Featured on homepage
      </label>
      <div className="flex gap-2">
        <Button type="button" size="sm" onClick={handleSave} disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

export function ReviewsManager({ reviews }: { reviews: ReviewRow[] }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    const formData = new FormData();
    formData.set("id", id);
    const result = await deleteReviewAction(formData);
    if (result?.error) showToast(result.error, "error");
    else {
      showToast(result?.message ?? "Deleted.");
      router.refresh();
    }
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-left dark:bg-slate-800/50">
          <tr>
            <th className="px-4 py-3 font-semibold">Date</th>
            <th className="px-4 py-3 font-semibold">Author</th>
            <th className="px-4 py-3 font-semibold">Rating</th>
            <th className="px-4 py-3 font-semibold">Content</th>
            <th className="px-4 py-3 font-semibold">Product</th>
            <th className="px-4 py-3 font-semibold">Type</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {reviews.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                No reviews yet.
              </td>
            </tr>
          ) : (
            reviews.map((review) => (
              <tr
                key={review.id}
                className="border-t border-slate-100 align-top dark:border-slate-800"
              >
                <td className="px-4 py-3 whitespace-nowrap text-slate-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                  {review.featured && (
                    <span className="mt-1 block text-xs font-medium text-amber-600">
                      Featured
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">
                  {review.author}
                  {review.userEmail && (
                    <div className="text-xs font-normal text-slate-500">
                      {review.userEmail}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-amber-500">
                  {"★".repeat(review.rating)}
                  <span className="text-slate-400">{"★".repeat(5 - review.rating)}</span>
                </td>
                <td className="px-4 py-3 max-w-xs">
                  {editingId === review.id ? (
                    <ReviewEditForm
                      review={review}
                      onCancel={() => setEditingId(null)}
                      onSaved={() => {
                        setEditingId(null);
                        router.refresh();
                      }}
                    />
                  ) : (
                    <p className="line-clamp-3 text-slate-600 dark:text-slate-300">
                      {review.content}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                  {review.productSlug ? (
                    <Link
                      href={`/products/${review.productSlug}`}
                      className="text-blue-600 hover:underline"
                      target="_blank"
                    >
                      {review.productName ?? review.productSlug}
                    </Link>
                  ) : (
                    <span className="text-slate-400">Homepage</span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                  {review.userId ? "Customer" : "Manual"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {editingId !== review.id && (
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setEditingId(review.id)}
                        className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800"
                        aria-label="Edit review"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <ConfirmButton
                        onConfirm={() => handleDelete(review.id)}
                        title="Delete review"
                        message="This cannot be undone."
                        confirmLabel="Delete"
                      >
                        <button
                          type="button"
                          className="rounded p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                          aria-label="Delete review"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </ConfirmButton>
                    </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
