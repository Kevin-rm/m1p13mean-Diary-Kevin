import { Injectable, inject, signal, computed } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
  Observable,
  tap,
  map,
  catchError,
  of,
  shareReplay,
  finalize,
  OperatorFunction,
} from "rxjs";
import { environment } from "@env/environment";
import { ApiResponse } from "@core/models/api-response";
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
  private refreshInFlight$: Observable<ApiResponse<void>> | null = null;

  readonly user = computed(() => this._authState().user);
  readonly context = computed(() => this._authState().context);
  readonly isAuthenticated = computed(() => this._authState().user !== null);
  readonly fullName = computed(() => {
    const user = this.user();
    if (!user) return "";
    return `${user.firstName} ${user.lastName}`;
  });
  readonly avatarLabel = computed(() => {
    const user = this.user();
    if (!user) return "";
    return (user.firstName[0] + user.lastName[0]).toUpperCase();
  });
  readonly avatarUrl = computed(() => this.user()?.avatarUrl ?? null);

  login(credentials: { email: string; password: string }): Observable<ApiResponse<AuthData>> {
    return this.http
      .post<ApiResponse<AuthData>>(`${this.authUrl}/login`, credentials)
      .pipe(this.setAuthState());
  }

  registerCustomer(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Observable<ApiResponse<AuthData>> {
    return this.http
      .post<ApiResponse<AuthData>>(`${this.authUrl}/register/customer`, data)
      .pipe(this.setAuthState());
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
    return this.http
      .post<ApiResponse<AuthData>>(`${this.authUrl}/register/shop`, data)
      .pipe(this.setAuthState());
  }

  checkAuthState(): Observable<boolean> {
    return this.http.get<ApiResponse<AuthData>>(`${this.authUrl}/me`).pipe(
      this.setAuthState(),
      map(() => true),
      catchError(() => {
        this.clearState();
        return of(false);
      }),
    );
  }

  logout(): Observable<unknown> {
    return this.http.post(`${this.authUrl}/logout`, {}).pipe(
      catchError(() => of(null)),
      tap(() => this.clearState()),
    );
  }

  refreshToken(): Observable<ApiResponse<void>> {
    if (this.refreshInFlight$) return this.refreshInFlight$;

    this.refreshInFlight$ = this.http.post<ApiResponse<void>>(`${this.authUrl}/refresh`, {}).pipe(
      finalize(() => (this.refreshInFlight$ = null)),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

    return this.refreshInFlight$;
  }

  hasPermission(...permissions: string[]): boolean {
    const profile = this._authState().context?.profile;
    if (!profile) return false;
    return permissions.every(p => profile.permissions.includes(p));
  }

  hasProfile(...codes: string[]): boolean {
    const profile = this._authState().context?.profile;
    if (!profile) return false;
    return codes.includes(profile.code);
  }

  clearState(): void {
    this._authState.set({ user: null, context: null });
  }

  private setAuthState(): OperatorFunction<ApiResponse<AuthData>, ApiResponse<AuthData>> {
    return tap(response => {
      if (response.data) this._authState.set(response.data);
    });
  }
}
