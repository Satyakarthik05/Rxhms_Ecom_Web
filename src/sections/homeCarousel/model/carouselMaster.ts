import { StatusType } from "../../header/enum/statusType";
import { CarouselSlide } from "./carouselSlide";

export interface CarouselMaster {
  id: number;
  channelCode: string;
  name: string;
  description: string;
  slides: CarouselSlide[];
  status: StatusType;
}
