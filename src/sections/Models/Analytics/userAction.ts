export interface UserAction {
  id: number;
  sessionId: string;
  userId: number;
  actionType: string; // Replace 'string' with the actual enum type
  actionDetails: Record<string, any>;
  actionTimestamp: Date;
}
