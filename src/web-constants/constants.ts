import axios from "axios";
// import { LoginResponse } from "../sections/login/model/loginResponse";
// const loginResponseData: LoginResponse = JSON.parse(
//   localStorage.getItem("loginResponse") || "{}"
// );

export const BeseAxios = axios.create({
  baseURL: "http://13.203.127.30:999/aurave-api/",
  headers: {
    "Content-Type": "application/json",
    client_id: "RXHMS_WEBSITE",
    // username: loginResponseData.username || null,
    username: null,
    channel_id: "RXHMS_WEBSITE_WEB",
    // Authorization: loginResponseData.token
    Authorization: `Bearer ${null}`,
    // ? `Bearer ${loginResponseData.token}`
    // : null,
  },
});

export enum PageState {
  IDLE = "IDLE",
  LOADING = "LOADING",
  ERROR = "ERROR",
  SUCCESS = "SUCCESS",
  OTP = "OTP",
  OTP_ERROR = "OTP_ERROR",
  OTP_SUCCESS = "OTP_SUCCESS",
  REGISTRATION = "REGISTRATION",
  PAYMENT_PROCESS = "PAYMENT_PROCESS",
  PAYMENT_SUCCESS = "PAYMENT_SUCCESS",
  PAYMENT_FAILED = "PAYMENT_FAILED",
}

export function setLocalText(code: string, data: string): void {
  if (code) {
    try {
      window.localStorage.setItem(code, data);
    } catch (error) {
      console.error("setLocalText(): Error setting local data!", error);
    }
  }
}

export function getLocalText(code: string): string | null {
  return window.localStorage.getItem(code);
}

export function clearLocalText(code: string) {
  if (code) {
    try {
      window.localStorage.removeItem(code);
    } catch (error) {
      console.error("clearLocalText(): Error setting local data!", error);
    }
  }
}

export const WEBSITE_BASE_URL_FOR_SHARE = "https://13.203.127.30:3000";
