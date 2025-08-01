import { StatusType } from "../../header/enum/statusType";
import { RequestType } from "./requestType";

export interface ReasonMaster {
    id: number;
    reason: string;
    requestType: RequestType;
    status: StatusType;
}


