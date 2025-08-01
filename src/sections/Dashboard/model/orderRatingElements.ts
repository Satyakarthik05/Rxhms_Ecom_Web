import { StatusType } from "../../header/enum/statusType";
import { RatingType } from "./ratingType";

export interface OrderRatingElements {
  id: number;
  code?: string;
  title: string;
  ratingType?: RatingType;
  status?: StatusType;
}
