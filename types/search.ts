export interface SearchFilters {
  q: string;
  sort: string;
  stars: string;
  pushed: string;
}

export const DEFAULT_FILTERS: SearchFilters = {
  q: "",
  sort: "stars",
  stars: "any",
  pushed: "any",
};
