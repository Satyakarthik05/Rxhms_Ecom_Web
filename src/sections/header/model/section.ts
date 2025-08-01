import { StatusType } from "../enum/statusType";
import { CategoryTree } from "./categoryTree";

export interface Section {
  id: number;
  slug: string;
  title: string;
  description: string;
  fileId: number;
  imageUrl: string;
  status?: StatusType;
  childCategory?: CategoryTree[];
}
