import { AddressType } from "../enum/addressType";
import { AddressMaster } from "./addressMaster";

export interface CustomerAddress {
  id?: number | null;
  customerId?: number | null;
  title: string;
  addressType: AddressType;
  address: AddressMaster;
  isDefault: boolean;
  username: string;
  addressTypes?: string[];
}
