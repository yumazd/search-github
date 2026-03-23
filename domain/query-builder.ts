import type { SearchFilters } from "@/types/search";

const TYPE_KEYWORDS: Record<string, string> = {
  library: "library",
  template: "template",
  example: "example",
  boilerplate: "boilerplate",
};

const PUSHED_MAP: Record<string, number> = {
  "1m": 30,
  "6m": 180,
  "1y": 365,
};

const SIZE_MAP: Record<string, string> = {
  small: "size:<1000",
  medium: "size:1000..10000",
  large: "size:>10000",
};

export function buildSearchQuery(filters: SearchFilters, translatedQ?: string): {
  q: string;
  sort?: string;
  order?: string;
} {
  const parts: string[] = [];

  // Main query
  const query = translatedQ || filters.q;
  if (query) parts.push(query);

  // Type keyword
  if (filters.type !== "all" && TYPE_KEYWORDS[filters.type]) {
    parts.push(TYPE_KEYWORDS[filters.type]);
    if (filters.type === "template") {
      parts.push("template:true");
    }
  }

  // Language
  if (filters.lang !== "all") {
    parts.push(`language:${filters.lang}`);
  }

  // Stars
  if (filters.stars !== "any") {
    parts.push(`stars:>=${filters.stars}`);
  }

  // Pushed
  if (filters.pushed !== "any" && PUSHED_MAP[filters.pushed]) {
    const date = new Date();
    date.setDate(date.getDate() - PUSHED_MAP[filters.pushed]);
    parts.push(`pushed:>${date.toISOString().split("T")[0]}`);
  }

  // License
  if (filters.license !== "any") {
    parts.push(`license:${filters.license}`);
  }

  // Size
  if (filters.size !== "any" && SIZE_MAP[filters.size]) {
    parts.push(SIZE_MAP[filters.size]);
  }

  // Always exclude archived and forks
  parts.push("archived:false");
  parts.push("fork:false");

  const result: { q: string; sort?: string; order?: string } = {
    q: parts.join(" "),
  };

  // Sort
  if (filters.sort !== "best") {
    result.sort = filters.sort;
    result.order = "desc";
  }

  return result;
}
