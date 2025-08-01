export interface LoginResponse {
  isExist?: boolean;
  token: string;
  username: string;
  isCustomerExist: boolean;
}
