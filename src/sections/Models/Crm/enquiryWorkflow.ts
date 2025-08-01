export interface EnquiryWorkflow {
  id: number;
  enquiryId: number;
  prevStatus: string; // Replace 'string' with the actual enum type
  curStatus: string; // Replace 'string' with the actual enum type
  updatedBy: string;
  updatedOn: Date;
}
