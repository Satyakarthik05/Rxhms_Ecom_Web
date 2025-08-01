export interface LoginRequest {
  username?: string | null;
  password?: string | null;
  emailId?: string | null;
  mobileNumber: string | null;
  txnId: string | null;
  otp: string | null;
}
