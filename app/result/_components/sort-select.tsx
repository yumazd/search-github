"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { SORT_OPTIONS } from "@/lib/search-options";

function sortLabel(value: string) {
  return SORT_OPTIONS.find((o) => o.value === value)?.label ?? "関連度順";
}

export function SortSelect({ currentSort }: { currentSort: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (value: string | null) => {
    if (!value) return;
    const params = new URLSearchParams(searchParams.toString());
    if (value === "best") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    router.push(`/result?${params.toString()}`);
  };

  return (
    <Select value={currentSort} onValueChange={handleChange}>
      <SelectTrigger className="border border-gray-200 text-sm text-gray-200 hover:opacity-80">
        <span>{sortLabel(currentSort)}</span>
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
