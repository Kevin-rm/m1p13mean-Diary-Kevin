import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { lastValueFrom, Observable } from "rxjs";
import { environment } from "@env/environment";
import { ApiResponse } from "@core/common/models/api-response";
import { AuthData } from "@auth/auth.models";
import { Invitation } from "./invitation.model";

@Injectable({ providedIn: "root" })
export class InvitationService {
  private readonly http = inject(HttpClient);
  readonly resourcePath = "invitations";
  private readonly shopUrl = `${environment.apiUrl}/shops/me/members/invitations`;
  private readonly accountUrl = `${environment.apiUrl}/account/invitations`;

  invite(data: { email: string; roleId: string }): Observable<ApiResponse<Invitation>> {
    return this.http.post<ApiResponse<Invitation>>(this.shopUrl, data);
  }

  listByShop(): Observable<ApiResponse<Invitation[]>> {
    return this.http.get<ApiResponse<Invitation[]>>(this.shopUrl);
  }

  listByShopQueryOptions() {
    return {
      queryKey: [this.resourcePath, "shop"] as const,
      queryFn: () => lastValueFrom(this.listByShop()),
    };
  }

  listByUser(): Observable<ApiResponse<Invitation[]>> {
    return this.http.get<ApiResponse<Invitation[]>>(this.accountUrl);
  }

  listByUserQueryOptions() {
    return {
      queryKey: [this.resourcePath, "user"] as const,
      queryFn: () => lastValueFrom(this.listByUser()),
    };
  }

  accept(id: string): Observable<ApiResponse<AuthData>> {
    return this.http.post<ApiResponse<AuthData>>(`${this.accountUrl}/${id}/accept`, {});
  }

  decline(id: string): Observable<ApiResponse<Invitation>> {
    return this.http.post<ApiResponse<Invitation>>(`${this.accountUrl}/${id}/decline`, {});
  }

  cancel(id: string): Observable<ApiResponse<Invitation>> {
    return this.http.delete<ApiResponse<Invitation>>(`${this.shopUrl}/${id}`);
  }
}
