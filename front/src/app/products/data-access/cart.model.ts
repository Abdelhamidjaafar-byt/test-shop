import { Product } from "./product.model";

// Assuming you have a CartItem model similar to Product
export interface CartItem {
    id: number; // Product ID
    quantity: number;
    product: Product; // Reference to the product details
}