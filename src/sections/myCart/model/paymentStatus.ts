export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUND_IN_PROGRESS = "REFUND_IN_PROGRESS",
  REFUNDED = "REFUNDED",
}

export const PaymentStatusDisplay: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: "Payment Pending",
  [PaymentStatus.COMPLETED]: "Payment Completed",
  [PaymentStatus.FAILED]: " Payment Failed",
  [PaymentStatus.REFUND_IN_PROGRESS]: "Refund in Progress",
  [PaymentStatus.REFUNDED]: "Payment Refunded",
};
