import { GenderType } from "./genderType";

export interface Customer {
  id: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  gender: GenderType;
  dob: string;
  anniversary?: number;
  mobileNumber: string;
  emailId: string;
  referredBy?: number;
  prefLang: string;
  registeredOn: string;
  currency: string;
  username: string;
}
