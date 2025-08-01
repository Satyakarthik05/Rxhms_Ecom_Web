import { GenderType } from "./genderType";

export interface CustomerRegistration {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  gender?: GenderType;
  dob?: string;
  mobileNumber?: string | null;
  emailId?: string;
  password?: string;
  username: string;
}
