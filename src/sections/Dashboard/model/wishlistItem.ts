import { ProductCard } from "../../inventoryProduct/model/productCard";

export interface WishlistItem{
    id:number | null;
    username?:string;
    wishlistId:number | null;
    productCode:string;
    itemId:number;
    addedOn:string;
    productCard:ProductCard
}
