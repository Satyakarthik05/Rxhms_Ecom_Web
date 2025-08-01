export interface UserSession {
  id: number;
  userId: number;
  sessionId: string;
  ipAddress: string;
  country: string;
  city: string;
  deviceType: string; 
  browser: string;
  os: string;
  sessionStart: Date;
  sessionEnd: Date;
}
