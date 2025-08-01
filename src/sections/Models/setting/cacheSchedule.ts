export interface CacheSchedule {
  id: number;
  scheduleCode: string;
  frequency: string; // e.g., 'daily', 'weekly', 'monthly'
  startTime: Date; // When the cache should start clearing
  endTime: Date; // When the cache should stop clearing (if applicable)
  lastRun: Date; // The last time the cache was cleared
  nextRun: Date; // The next scheduled time for clearing
  createdBy: string;
  createdOn: Date;
  modifiedBy: string;
}
