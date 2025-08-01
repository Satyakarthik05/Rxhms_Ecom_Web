export interface TicketResponse {
  id: bigint;
  ticketId: bigint;
  senderId: bigint;
  message: string;
  createdBy: string;
  createdOn: Date;
  modifiedBy: string;
  modifiedOn: Date;
}
