import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiResponse } from "@core/models/api-response";
import { ResourceService } from "@core/services/resource";
import { Shop } from "./shop.model";

export interface ShopListParams {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

@Injectable({ providedIn: "root" })
export class ShopService extends ResourceService<Shop> {
  protected readonly resourcePath = "shops";

  override list(params: ShopListParams = {}): Observable<ApiResponse<Shop[]>> {
    return super.list(params);
  }

  getByOwnerEmail(email: string | undefined): Observable<ApiResponse<Shop>> {
    return this.http.get<ApiResponse<Shop>>(`${this.baseUrl}/owner/${email}`, {});
  }

  validate(id: string): Observable<ApiResponse<Shop>> {
    return this.http.patch<ApiResponse<Shop>>(`${this.baseUrl}/${id}/validate`, {});
  }

  suspend(id: string): Observable<ApiResponse<Shop>> {
    return this.http.patch<ApiResponse<Shop>>(`${this.baseUrl}/${id}/suspend`, {});
  }
}
