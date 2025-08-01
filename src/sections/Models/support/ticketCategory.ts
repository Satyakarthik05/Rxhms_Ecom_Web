export enum TicketCategory {
  ORDER = "ORDER",
  PAYMENT = "PAYMENT",
  TECHNICAL = "TECHNICAL",
  OTHER = "OTHER",
}

export const TicketCategoryDisplay = {
  [TicketCategory.ORDER]: "Order",
  [TicketCategory.PAYMENT]: "Payment",
  [TicketCategory.TECHNICAL]: "Technical",
  [TicketCategory.OTHER]: "Other",
};
