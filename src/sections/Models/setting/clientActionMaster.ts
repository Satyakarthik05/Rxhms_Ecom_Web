export interface ClientActionMaster {
  id: number;
  eventType: string; // Using string for ENUM types
  name: string;
  pageUrl: string;
  pageCode: string;
  clientCode: string;
  channelCode?: string; // Optional field
  createdBy: string;
  createdOn: Date; // Use Date type for DATETIME
  modifiedBy?: string; // Optional field
}
