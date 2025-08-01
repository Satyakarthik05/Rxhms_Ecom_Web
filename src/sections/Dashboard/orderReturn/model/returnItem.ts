export interface ReturnItem {
  orderNum: string;
  returnItems: Record<number, number>;
  reasonId: number | null;
  reason: string;

}
