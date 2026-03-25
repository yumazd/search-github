import "server-only";
import { searchRepositories } from "@/server/github";
import { translateSearchQuery } from "@/server/ai";
import { buildSearchQuery } from "@/domain/query-builder";
import type { SearchFilters } from "@/types/search";
import type { Repository } from "@/types/repository";
import { RESULTS_PER_PAGE } from "@/lib/constants";

export interface SearchResponse {
  total_count: number;
  items: Repository[];
  translatedQ?: string;
}

const aiEnabled = process.env.AI_ENABLED === "true";

export function containsJapanese(text: string): boolean {
  return /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(text);
}

export async function executeSearch(
  filters: SearchFilters,
  page: number = 1,
): Promise<SearchResponse> {
  // Step 1: Translate query to English (only if Japanese is detected)
  const needsTranslation = aiEnabled && containsJapanese(filters.q);
  const translatedQ = needsTranslation
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
    translatedQ: needsTranslation ? translatedQ : undefined,
  };
}
