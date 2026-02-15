import { Injectable, inject, signal, computed } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap, map, catchError, of } from "rxjs";
import { environment } from "../../environments/environment";
import { ApiResponse } from "../core/models/api-response.model";
import { AuthData, User, UserContext } from "./auth.models";

interface AuthState {
  user: User | null;
  context: UserContext | null;
}

@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly authUrl = `${environment.apiUrl}/auth`;

  private readonly _authState = signal<AuthState>({ user: null, context: null });

  readonly user = computed(() => this._authState().user);
  readonly context = computed(() => this._authState().context);
  readonly isAuthenticated = computed(() => this._authState().user !== null);

  login(credentials: { email: string; password: string }): Observable<ApiResponse<AuthData>> {
    return this.http.post<ApiResponse<AuthData>>(`${this.authUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.data) this._authState.set(response.data);
      }),
    );
  }

  registerCustomer(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Observable<ApiResponse<AuthData>> {
    return this.http.post<ApiResponse<AuthData>>(`${this.authUrl}/register/customer`, data).pipe(
      tap(response => {
        if (response.data) this._authState.set(response.data);
      }),
    );
  }

  registerShop(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    shopName: string;
    shopDescription: string;
    contactEmail: string;
    contactPhone: string;
  }): Observable<ApiResponse<AuthData>> {
    return this.http.post<ApiResponse<AuthData>>(`${this.authUrl}/register/shop`, data).pipe(
      tap(response => {
        if (response.data) this._authState.set(response.data);
      }),
    );
  }

  checkAuthState(): Observable<boolean> {
    return this.http.get<ApiResponse<AuthData>>(`${this.authUrl}/me`).pipe(
      tap(response => {
        if (response.data) this._authState.set(response.data);
      }),
      map(() => true),
      catchError(() => {
        this._authState.set({ user: null, context: null });
        return of(false);
      }),
    );
  }

  clearState(): void {
    this._authState.set({ user: null, context: null });
  }
}
