import { StatusType } from "../enum/statusType";

export interface Category {
  id: number;
  slug: string;
  sectionId: number;
  title: string;
  description: string;
  fileId: number;
  imageUrl: string;
  status: StatusType;
}
