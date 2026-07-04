"use client";

import { useRef, useState } from "react";
import { slugify } from "@/lib/utils";
import { Input, Label } from "@/components/ui/input";

type ProductSlugFieldsProps = {
  defaultName?: string;
  defaultSlug?: string;
};

export function ProductSlugFields({
  defaultName = "",
  defaultSlug = "",
}: ProductSlugFieldsProps) {
  const slugTouched = useRef(defaultSlug.length > 0);
  const [slug, setSlug] = useState(defaultSlug);

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (slugTouched.current) return;
    setSlug(slugify(e.target.value));
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    slugTouched.current = true;
    setSlug(e.target.value);
  }

  return (
    <>
      <div>
        <Label htmlFor="name">Product Name *</Label>
        <Input
          id="name"
          name="name"
          defaultValue={defaultName}
          required
          onChange={handleNameChange}
        />
      </div>
      <div>
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" name="slug" value={slug} onChange={handleSlugChange} />
        <p className="mt-1 text-xs text-slate-500">
          Leave blank to auto-generate from product name (e.g. test 2 → test-2)
        </p>
      </div>
    </>
  );
}
