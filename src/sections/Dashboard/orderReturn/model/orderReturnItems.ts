import { ProductCard } from "../../../inventoryProduct/model/productCard";

export interface OrderReturnItems {
    id:number;
    returnId:number;
    productId:number;
    itemId:number;
    qty:number;
    unitPrice:number;
    totalPrice:number;
    totalMrp:number;
    productCard: ProductCard;
} 


