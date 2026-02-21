import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { ApiResponse } from "../../core/models/api-response.model";
import { buildQueryParams } from "../../core/utils/http-params";
import { Shop } from "./shop.model";

export interface ShopListParams {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

@Injectable({ providedIn: "root" })
export class ShopService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/shops`;

  list(params: ShopListParams = {}): Observable<ApiResponse<Shop[]>> {
    return this.http.get<ApiResponse<Shop[]>>(this.baseUrl, {
      params: buildQueryParams(params),
    });
  }

  getById(id: string): Observable<ApiResponse<Shop>> {
    return this.http.get<ApiResponse<Shop>>(`${this.baseUrl}/${id}`);
  }

  validate(id: string): Observable<ApiResponse<Shop>> {
    return this.http.patch<ApiResponse<Shop>>(`${this.baseUrl}/${id}/validate`, {});
  }

  suspend(id: string): Observable<ApiResponse<Shop>> {
    return this.http.patch<ApiResponse<Shop>>(`${this.baseUrl}/${id}/suspend`, {});
  }
}
