export enum AddressType {
  SHIPPING = "SHIPPING",
  BILLING = "BILLING",
}

export const KeyTypeDisplay = {
    [AddressType.SHIPPING]: "Shipping",
    [AddressType.BILLING]: "billing",

};
