import { ItemType } from "./itemType";

export interface CarouselSlide {
  id: number;
  carouselId: number;
  title: string;
  description: string;
  itemType: ItemType;
  fileId: number;
  contentUrl: string;
  sequence: number;
}
