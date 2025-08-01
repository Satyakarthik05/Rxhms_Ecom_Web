export interface AdPoster {
  id: number;
  posterUrl: string;
  type: string; // Replace 'string' with the actual enum type
  customisable: boolean;
  resource: string;
  createdBy: string;
  createdOn: Date;
  modifiedBy: string;
  modifiedOn: Date;
}
