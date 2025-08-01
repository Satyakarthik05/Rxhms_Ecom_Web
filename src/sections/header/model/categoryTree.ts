import { StatusType } from "../enum/statusType";

export interface CategoryTree {
  id: number;
  title: string;
  imageUrl: string;
  slug: string;
  level: number;
  status: StatusType;
  childCategory: CategoryTree[];
}
