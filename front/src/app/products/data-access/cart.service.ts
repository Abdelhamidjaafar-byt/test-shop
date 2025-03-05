import { Injectable, inject, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable, of, tap } from "rxjs";
import { CartItem } from "./cart.model";

@Injectable({
    providedIn: "root"
})
export class CartService {
    private readonly http = inject(HttpClient);
    private readonly cartFilePath = "/assets/cart.json"; // Path to the JSON file

    private readonly _cartItems = signal<CartItem[]>([]);
    public readonly cartItems = this._cartItems.asReadonly();

    constructor() {
        this.loadCartFromFile(); // Load cart data when the service is initialized
    }

    /**
     * Loads the cart items from the JSON file.
     */
    private loadCartFromFile(): void {
        this.http.get<CartItem[]>(this.cartFilePath).pipe(
            catchError((error) => {
                console.error("Failed to load cart items from file:", error);
                return of([]); // Fallback to an empty cart if the file is not found or there's an error
            }),
            tap((cartItems) => this._cartItems.set(cartItems))
        ).subscribe();
    }

    /**
     * Adds a product to the cart or updates its quantity if it already exists.
     * @param productId - The ID of the product to add.
     * @param productName - The name of the product to add.
     * @param quantity - The quantity to add (default is 1).
     */
    public add(productId: number, productName: string, quantity: number ,price : number): Observable<boolean> {
        const newCartItem: CartItem = {
            id: productId,
            product: { id: productId, name: productName, price: price,quantity }, // Mock product data
            quantity
        };

        this._cartItems.update((items) => {
            const existingItemIndex = items.findIndex((item) => item.id === productId);

            if (existingItemIndex !== -1) {
                // Update the quantity of the existing item
                const updatedItems = [...items];
                updatedItems[existingItemIndex].quantity += quantity;
                return updatedItems;
            } else {
                // Add the new item to the cart
                return [...items, newCartItem];
            }
        });

        this.saveCartToFile(); // Save the cart to the file (simulated)
        return of(true); // Simulate success
    }

    /**
     * Updates the quantity of a product in the cart.
     * @param productId - The ID of the product to update.
     * @param quantity - The new quantity.
     */
    public updateQuantity(productId: number, quantity: number): Observable<boolean> {
        this._cartItems.update((items) =>
            items.map((item) => (item.id === productId ? { ...item, quantity } : item))
        );

        this.saveCartToFile(); // Save the cart to the file (simulated)
        return of(true); // Simulate success
    }

    /**
     * Removes a product from the cart.
     * @param productId - The ID of the product to remove.
     */
    public remove(productId: number): Observable<boolean> {
        this._cartItems.update((items) => items.filter((item) => item.id !== productId));
        this.saveCartToFile(); // Save the cart to the file (simulated)
        return of(true); // Simulate success
    }

    /**
     * Clears all items from the cart.
     */
    public clear(): Observable<boolean> {
        this._cartItems.set([]);
        this.saveCartToFile(); // Save the cart to the file (simulated)
        return of(true); // Simulate success
    }

    /**
     * Calculates the total price of all items in the cart.
     * @returns The total price of the cart.
     */
    public getTotalPrice(): number {
        return this.cartItems().reduce((total, item) => total + item.product.price * item.quantity, 0);
    }

    /**
     * Saves the current cart items to the JSON file (simulated).
     */
    private saveCartToFile(): void {
        // Simulate saving to a file (in a real app, this would be handled by a backend API)
        console.log("Cart items saved (simulated):", this.cartItems());
    }
}