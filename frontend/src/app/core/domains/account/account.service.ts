import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { lastValueFrom, Observable } from "rxjs";
import { environment } from "@env/environment";
import { ApiResponse } from "@core/common/models/api-response";
import { AuthData, User } from "@auth/auth.models";
import { Invitation } from "@core/domains/shop/member/invitation/invitation.model";

@Injectable({ providedIn: "root" })
export class AccountService {
  static readonly resourcePath = "account";

  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/${AccountService.resourcePath}`;
  private readonly invitationsUrl = `${this.baseUrl}/invitations`;

  updateProfile(data: object): Observable<ApiResponse<User>> {
    return this.http.patch<ApiResponse<User>>(`${this.baseUrl}/profile`, data);
  }

  updateAvatar(file: Blob): Observable<ApiResponse<User>> {
    const formData = new FormData();
    formData.append("avatar", file, "avatar.png");
    return this.http.patch<ApiResponse<User>>(`${this.baseUrl}/avatar`, formData);
  }

  changePassword(data: object): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(`${this.baseUrl}/password`, data);
  }

  listInvitations(): Observable<ApiResponse<Invitation[]>> {
    return this.http.get<ApiResponse<Invitation[]>>(this.invitationsUrl);
  }

  listInvitationsQueryOptions() {
    return {
      queryKey: [AccountService.resourcePath, "invitations"] as const,
      queryFn: () => lastValueFrom(this.listInvitations()),
    };
  }

  acceptInvitation(id: string): Observable<ApiResponse<AuthData>> {
    return this.http.post<ApiResponse<AuthData>>(`${this.invitationsUrl}/${id}/accept`, {});
  }

  declineInvitation(id: string): Observable<ApiResponse<Invitation>> {
    return this.http.post<ApiResponse<Invitation>>(`${this.invitationsUrl}/${id}/decline`, {});
  }
}
