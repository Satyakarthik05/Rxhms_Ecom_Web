import { StatusType } from "../../header/enum/statusType";
import { FlagItems } from "./flagItems";

export interface FlagMaster {
  id: number;
  flag: string;
  description: string;
  startDate: string;
  endDate: string;
  flagColour: string;
  textColour?: string;
  status: StatusType;
  flagItems: FlagItems[];
}
