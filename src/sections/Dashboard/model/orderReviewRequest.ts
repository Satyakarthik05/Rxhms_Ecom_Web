export interface OrderReviewRequest {
  orderId: number;
  title: string;
  description: string;
  ratings: Record<number, number>; 
}
