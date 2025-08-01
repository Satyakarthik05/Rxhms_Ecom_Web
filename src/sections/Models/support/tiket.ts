import { TicketCategory } from "./ticketCategory";
import { TicketPriority } from "./ticketPriority";
import { TicketStatus } from "./ticketStatus";

export interface Ticket {
  id?: number | null;
  username: string;
  orderNum: number;
  email: string;
  mobileNum: string;
  category: TicketCategory;
  subject: string;
  description: string; 
  priority?: TicketPriority;
  status?: TicketStatus;
  assignedTo?: number | null; 
  generatedOn?: Date;

}

