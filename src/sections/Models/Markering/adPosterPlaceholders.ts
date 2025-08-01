export interface DPosterPlaceholders {
  id: number;
  posterId: number;
  shape: string; // Replace 'string' with the actual enum type
  layType: string; // Replace 'string' with the actual enum type
  width: number;
  height: number;
  positionX: number;
  positionY: number;
  createdBy: string;
  createdOn: Date;
  modifiedBy: string;
}
