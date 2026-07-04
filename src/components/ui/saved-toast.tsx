"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/toast-provider";

export function SavedToast({ message = "Changes saved successfully." }: { message?: string }) {
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  useEffect(() => {
    if (searchParams.get("saved") === "1") {
      showToast(message);
    }
    const error = searchParams.get("error");
    if (error) {
      showToast(decodeURIComponent(error), "error");
    }
  }, [searchParams, showToast, message]);

  return null;
}
