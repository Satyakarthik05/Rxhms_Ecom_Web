export interface CacheResource {
  id: number;
  code: string;
  cacheParams: object; // You can further define the structure of cacheParams if needed
  resourceCode: string;
  lastClearedOn: Date;
  lastClearedBy: string;
  createdBy: string;
  createdOn: Date;
  modifiedBy: string;
}
