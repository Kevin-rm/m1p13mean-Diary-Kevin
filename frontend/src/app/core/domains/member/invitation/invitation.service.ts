import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { lastValueFrom, Observable } from "rxjs";
import { environment } from "@env/environment";
import { ApiResponse } from "@core/common/models/api-response";
import { Invitation } from "./invitation.model";

@Injectable({ providedIn: "root" })
export class InvitationService {
  static readonly resourcePath = "invitations";

  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/shops/me/members/${InvitationService.resourcePath}`;

  invite(data: { email: string; roleId: string }): Observable<ApiResponse<Invitation>> {
    return this.http.post<ApiResponse<Invitation>>(this.baseUrl, data);
  }

  list(): Observable<ApiResponse<Invitation[]>> {
    return this.http.get<ApiResponse<Invitation[]>>(this.baseUrl);
  }

  listQueryOptions() {
    return {
      queryKey: [InvitationService.resourcePath] as const,
      queryFn: () => lastValueFrom(this.list()),
    };
  }

  cancel(id: string): Observable<ApiResponse<Invitation>> {
    return this.http.delete<ApiResponse<Invitation>>(`${this.baseUrl}/${id}`);
  }
}
