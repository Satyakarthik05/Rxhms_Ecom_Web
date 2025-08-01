export enum ReturnStatusType {
    REQUESTED = "REQUESTED",
    PROCESSING = "PROCESSING",
    RETURNED = "RETURNED",
    CANCELLED = "CANCELLED",
}

export const ReturnStatusTypeDisplay = {
    [ReturnStatusType.REQUESTED]: "Requested",
    [ReturnStatusType.PROCESSING]: "Processing",
    [ReturnStatusType.RETURNED]: "Returned",
    [ReturnStatusType.CANCELLED]: "Cancelled",
   
}