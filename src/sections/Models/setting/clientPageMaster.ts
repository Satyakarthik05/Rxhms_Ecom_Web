export interface ClientPageMaster {
  id: number;
  code: string;
  title: string; // Corrected spelling from 'tittle' to 'title'
  description: string;
  clientCode: string;
  channelCode?: string; // Optional field
  createdBy: string;
  createdOn: Date;
  modifiedBy?: string; // Optional field
  modifiedOn?: Date; // Optional field for tracking modifications
}
