import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Product } from 'app/products/data-access/product.model';
import { catchError, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private readonly http = inject(HttpClient);
  private readonly path = "/api/cartItems";
  
  private readonly _cartItems = signal<Product[]>([]);
  private readonly _totalItemsInCart= signal<number>(0);

  public readonly cartItems = this._cartItems.asReadonly();
  public readonly totalItemsInCart = this._totalItemsInCart.asReadonly();

  public addToCart(product: Product): Observable<boolean> {
    this._totalItemsInCart.update(total => total = total + product.quantity);
    return this.http.post<boolean>(this.path, product).pipe(
      catchError(() => of(true)), // Handle errors gracefully
      tap(() => {
        this._cartItems.update(cartItems => {
          const existingProduct = cartItems.find(item => item.id === product.id);
          if (existingProduct) {
            return cartItems.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + product.quantity }
                : item
            );
          } else {
            return [{ ...product }, ...cartItems];
          }
        });
      })
    );
  }
  public removeFromCart(product: Product): Observable<boolean> {
    this._totalItemsInCart.update(total => total = total - product.quantity);
    return this.http.delete<boolean>(`${this.path}/${product.id}`).pipe(
        catchError(() => {
            return of(true);
        }),
        tap(() => this._cartItems.update(cartItems => cartItems.filter(cartItem => cartItem.id !== product.id))),
    );
  }

  updateCart(quantityChange: number) {
    this._totalItemsInCart.update(total => total = total + quantityChange);
  }
  
}
