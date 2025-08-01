export interface PageView {
  id: number;
  sessionId: string;
  userId: number;
  pageUrl: string;
  referrer: string;
  timeSpentSeconds: number;
  viewTimestamp: Date;
}
