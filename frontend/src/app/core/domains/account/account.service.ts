import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "@env/environment";
import { ApiResponse } from "@core/common/models/api-response";
import { User } from "@auth/auth.models";

@Injectable({ providedIn: "root" })
export class AccountService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/account`;

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
}
