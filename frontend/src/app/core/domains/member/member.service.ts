import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { lastValueFrom, Observable } from "rxjs";
import { environment } from "@env/environment";
import { ApiResponse } from "@core/common/models/api-response";
import { Member } from "./member.model";

@Injectable({ providedIn: "root" })
export class MemberService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/shops/me/members`;

  list(): Observable<ApiResponse<Member[]>> {
    return this.http.get<ApiResponse<Member[]>>(this.baseUrl);
  }

  listQueryOptions() {
    return {
      queryKey: ["members"] as const,
      queryFn: () => lastValueFrom(this.list()),
    };
  }

  update(id: string, data: { roleId: string }): Observable<ApiResponse<Member>> {
    return this.http.patch<ApiResponse<Member>>(`${this.baseUrl}/${id}`, data);
  }

  toggleActive(id: string): Observable<ApiResponse<Member>> {
    return this.http.patch<ApiResponse<Member>>(`${this.baseUrl}/${id}/toggle-active`, {});
  }

  remove(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }
}
