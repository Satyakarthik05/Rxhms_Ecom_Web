export interface OrderReviews {
  id?: number | null;
  orderId: number;
  title: string;
  description: string;
  generatedOn?: string;
}
