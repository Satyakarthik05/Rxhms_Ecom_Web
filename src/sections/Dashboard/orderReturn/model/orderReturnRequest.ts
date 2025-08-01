import { ReturnStatusType } from "../enum/returnStatusType";
import { OrderReturnItems } from "./orderReturnItems";

export interface OrderReturnRequest {
    id: number;
    orderId: number;
    requestedOn: string; 
    returnedOn: string;  
    status: ReturnStatusType;
    finalPrice: number;
    reasonId: number;
    explaination: string;
    returnItems: OrderReturnItems[];
  }
  