import { searchRepositories } from "@/server/github";
import { translateSearchQuery } from "@/server/ai";
import { buildSearchQuery } from "@/domain/query-builder";
import type { SearchFilters } from "@/types/search";
import type { Repository } from "@/types/repository";

export const RESULTS_PER_PAGE = 10;

export type { Repository };

export interface SearchResponse {
  total_count: number;
  items: Repository[];
}

const aiEnabled = process.env.AI_ENABLED === "true";

export async function executeSearch(
  filters: SearchFilters,
  page: number = 1,
): Promise<SearchResponse> {
  // Step 1: Translate query to English
  const translatedQ = aiEnabled
    ? await translateSearchQuery(filters.q)
    : filters.q;

  // Step 2: Build GitHub search query
  const query = buildSearchQuery(filters, translatedQ);

  // Step 3: Search GitHub
  const result = await searchRepositories({
    ...query,
    page,
    per_page: RESULTS_PER_PAGE,
  });

  return {
    total_count: result.total_count,
    items: result.items,
  };
}
