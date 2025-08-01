export enum PaymentMethod {
  CREDITCARD = "CREDIT_CARD",
  DEBITCARD = "DEBIT_CARD",
  PAYPAL = "PAYPAL",
  UPI = "UPI",
  NET_BANKING = "NET_BANKING",
}

export const paymentMethodMapping: { [key in PaymentMethod]: string } = {
  [PaymentMethod.CREDITCARD]: "card",
  [PaymentMethod.DEBITCARD]: "card",
  [PaymentMethod.PAYPAL]: "paypal",
  [PaymentMethod.UPI]: "upi",
  [PaymentMethod.NET_BANKING]: "Net Banking",
};
