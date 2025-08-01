export interface SearchHistory {
  id: number;
  sessionId: string;
  userId: number;
  searchQuery: string;
  filtersApplied: Record<string, any>; // jsonobject
  searchTimestamp: Date;
}
