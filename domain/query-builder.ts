import type { SearchFilters } from "@/types/search";

const PUSHED_MAP: Record<string, number> = {
  "1m": 30,
  "6m": 180,
  "1y": 365,
};

export function buildSearchQuery(
  filters: SearchFilters,
  translatedQ?: string,
): {
  q: string;
  sort?: string;
  order?: string;
} {
  const parts: string[] = [];

  // Main query
  const query = translatedQ || filters.q;
  if (query) parts.push(query);

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
