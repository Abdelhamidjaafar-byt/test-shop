import { Injectable, inject, signal } from "@angular/core";
import { Product } from "./product.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, map, Observable, of, tap } from "rxjs";

@Injectable({
    providedIn: "root"
}) 
export class ProductsService {
    private readonly http = inject(HttpClient);
    private readonly path = "http://localhost:8080/products";
    private token: string;
    
    private readonly _products = signal<Product[]>([]);
    public readonly products = this._products.asReadonly();

    constructor() {
        // Initialize token from localStorage
        this.token = 'Bearer ' + localStorage.getItem('token');
    }

    /**
     * Gets the authentication headers for API requests
     */
    private getAuthHeaders(): HttpHeaders {
        // Refresh token in case it was updated
        this.token = 'Bearer ' + localStorage.getItem('token');
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('authToken')
        });
    }

    public get(): Observable<Product[]> {
        return this.http.get<{ content: Product[] }>(this.path, {
            headers: this.getAuthHeaders()
        }).pipe(
            catchError((error) => {
                console.error('Error fetching products:', error);
                return this.http.get<{ content: Product[] }>("http://localhost:8080/products", {
                    headers: this.getAuthHeaders()
                });
            }),
            map((response) => {
                const products = response.content ?? []; // Extraction de la liste des produits
                return products.map(product => ({
                    ...product,
                    quantity: product.quantity ?? 1,
                }));
            }),
            tap((products) => this._products.set(products)),
        );
    }
    
    

    public create(product: Product): Observable<boolean> {
        return this.http.post<boolean>(this.path, product, {
            headers: this.getAuthHeaders()
        }).pipe(
            catchError((error) => {
                console.error('Error creating product:', error);
                return of(true);
            }),
            tap(() => this._products.update(products => [product, ...products])),
        );
    }

    public update(product: Product): Observable<boolean> {
        return this.http.patch<boolean>(`${this.path}/${product.id}`, product, {
            headers: this.getAuthHeaders()
        }).pipe(
            catchError((error) => {
                console.error(`Error updating product ${product.id}:`, error);
                return of(true);
            }),
            tap(() => this._products.update(products => {
                return products.map(p => p.id === product.id ? product : p)
            })),
        );
    }

    public delete(productId: number): Observable<boolean> {
        return this.http.delete<boolean>(`${this.path}/${productId}`, {
            headers: this.getAuthHeaders()
        }).pipe(
            catchError((error) => {
                console.error(`Error deleting product ${productId}:`, error);
                return of(true);
            }),
            tap(() => this._products.update(products => products.filter(product => product.id !== productId))),
        );
    }
}