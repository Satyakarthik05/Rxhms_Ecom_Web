export interface TicketLog {
  id: bigint;
  ticketId: bigint;
  changedBy: bigint;
  oldStatus: string; // Replace with ENUM type as needed
  newStatus: string; // Replace with ENUM type as needed
  changeDate: Date;
  createdBy: string;
  createdOn: Date;
  modifiedBy: string;
  modifiedOn: Date;
}
