export interface SearchFilters {
  q: string;
  type: string;
  lang: string;
  sort: string;
  stars: string;
  pushed: string;
  license: string;
  size: string;
}

export const DEFAULT_FILTERS: SearchFilters = {
  q: "",
  type: "all",
  lang: "all",
  sort: "best",
  stars: "any",
  pushed: "any",
  license: "any",
  size: "any",
};
