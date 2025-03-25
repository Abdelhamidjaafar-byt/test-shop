import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";

@Injectable({
    providedIn: "root"
})
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly loginUrl = "http://localhost:8080/token";

    private token: string | null = null;

    private authenticated = false;

    isAuthenticated(): boolean {
        return this.authenticated;
    }

    public login(email: string, password: string): Observable<string> {
        const body = { email, password };

        return this.http.post<{ token: string }>(this.loginUrl, body).pipe(
            map(response => response.token),
            tap(token => {
                this.token = token;
                localStorage.setItem("authToken", token);
                this.authenticated = true;
            }),
            catchError(error => {
                console.error("Login failed", error);
                return of("");
            })
        );
    }

    public getToken(): string | null {
        return this.token || localStorage.getItem("authToken");
    }

    public logout(): void {
        this.token = null;
        localStorage.removeItem("authToken");
    }
}