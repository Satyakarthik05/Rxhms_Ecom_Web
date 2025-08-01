import { CancelledByType } from "./cancelledByType";

export interface OrderCancellation {
    id:number | null;
    orderId:number;
    orderNum?:number | null
    cancelledOn: Date | null;
    cancelledBy: CancelledByType;
    reason: string;
    cancelledCharges: number | null;
    cancelledAmount: number | null;
    isRefunded?: boolean | null;
}


