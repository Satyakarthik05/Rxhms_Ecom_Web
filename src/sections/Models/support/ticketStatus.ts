export enum TicketStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
}

export const TicketStatusDisplay = {
    [TicketStatus.OPEN]: "Open",
    [TicketStatus.IN_PROGRESS]: "In Progress",
    [TicketStatus.RESOLVED]: "Resolved",
    [TicketStatus.CLOSED]: "Closed",
   
}