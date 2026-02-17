import { Injectable, inject, signal, computed, OnDestroy, NgZone } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap, map, catchError, of, EMPTY } from "rxjs";
import { environment } from "../../environments/environment";
import { ApiResponse } from "../core/models/api-response.model";
import { AuthData, User, UserContext } from "./auth.models";

interface AuthState {
  user: User | null;
  context: UserContext | null;
}

const TOKEN_REFRESH_INTERVAL = 12 * 60 * 1000; // 12 minutes (80% of 15 min TTL)

@Injectable({ providedIn: "root" })
export class AuthService implements OnDestroy {
  private readonly http = inject(HttpClient);
  private readonly ngZone = inject(NgZone);
  private readonly authUrl = `${environment.apiUrl}/auth`;

  private readonly _authState = signal<AuthState>({ user: null, context: null });
  private refreshTimerId: ReturnType<typeof setTimeout> | null = null;
  private readonly onVisibilityChange = this.handleVisibilityChange.bind(this);

  readonly user = computed(() => this._authState().user);
  readonly context = computed(() => this._authState().context);
  readonly isAuthenticated = computed(() => this._authState().user !== null);

  constructor() {
    document.addEventListener("visibilitychange", this.onVisibilityChange);
  }

  ngOnDestroy(): void {
    this.cancelScheduledRefresh();
    document.removeEventListener("visibilitychange", this.onVisibilityChange);
  }

  login(credentials: { email: string; password: string }): Observable<ApiResponse<AuthData>> {
    return this.http.post<ApiResponse<AuthData>>(`${this.authUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.data) this._authState.set(response.data);
        this.scheduleTokenRefresh();
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
        this.scheduleTokenRefresh();
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
        this.scheduleTokenRefresh();
      }),
    );
  }

  checkAuthState(): Observable<boolean> {
    return this.http.get<ApiResponse<AuthData>>(`${this.authUrl}/me`).pipe(
      tap(response => {
        if (response.data) this._authState.set(response.data);
        this.scheduleTokenRefresh();
      }),
      map(() => true),
      catchError(() => {
        this.clearState();
        return of(false);
      }),
    );
  }

  logout(): Observable<unknown> {
    return this.http.post(`${this.authUrl}/logout`, {}).pipe(
      catchError(() => EMPTY),
      tap(() => this.clearState()),
    );
  }

  refreshToken(): Observable<ApiResponse<void>> {
    return this.http
      .post<ApiResponse<void>>(`${this.authUrl}/refresh`, {})
      .pipe(tap(() => this.scheduleTokenRefresh()));
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
    this.cancelScheduledRefresh();
    this._authState.set({ user: null, context: null });
  }

  private scheduleTokenRefresh(): void {
    this.cancelScheduledRefresh();
    this.ngZone.runOutsideAngular(() => {
      this.refreshTimerId = setTimeout(() => {
        this.ngZone.run(() => {
          this.refreshToken().subscribe({
            error: () => this.clearState(),
          });
        });
      }, TOKEN_REFRESH_INTERVAL);
    });
  }

  private cancelScheduledRefresh(): void {
    if (this.refreshTimerId !== null) {
      clearTimeout(this.refreshTimerId);
      this.refreshTimerId = null;
    }
  }

  private handleVisibilityChange(): void {
    if (document.visibilityState === "visible" && this.isAuthenticated()) {
      this.ngZone.run(() => {
        this.refreshToken().subscribe({
          error: () => this.clearState(),
        });
      });
    }
  }
}
