export interface Enquiry {
  id: number;
  subject: string;
  description: string;
  status: string; // Replace 'string' with the actual enum type
  createdBy: string;
  createdOn: Date;
  modifiedBy: string;
  modifiedOn: Date;
}
