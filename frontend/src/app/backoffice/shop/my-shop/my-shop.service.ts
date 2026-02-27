import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "@env/environment";
import { ApiResponse } from "@core/common/models/api-response";
import { Shop } from "@core/domains/shop/shop.model";

@Injectable({ providedIn: "root" })
export class MyShopService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/shops`;

  get(): Observable<ApiResponse<Shop>> {
    return this.http.get<ApiResponse<Shop>>(`${this.baseUrl}/me`);
  }

  update(data: Partial<Shop>): Observable<ApiResponse<Shop>> {
    return this.http.patch<ApiResponse<Shop>>(`${this.baseUrl}/me`, data);
  }

  uploadLogo(file: File): Observable<ApiResponse<Shop>> {
    const formData = new FormData();
    formData.append("logo", file);
    return this.http.post<ApiResponse<Shop>>(`${this.baseUrl}/me/logo`, formData);
  }

  uploadImage(file: File): Observable<ApiResponse<{ shop: Shop }>> {
    const formData = new FormData();
    formData.append("shopImage", file);
    return this.http.post<ApiResponse<{ shop: Shop }>>(`${this.baseUrl}/me/image`, formData);
  }
}
