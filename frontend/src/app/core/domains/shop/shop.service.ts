import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiResponse } from "@core/common/models/api-response";
import { ResourceService } from "@core/common/resource.service";
import { Shop } from "./shop.model";

@Injectable({ providedIn: "root" })
export class ShopService extends ResourceService<Shop> {
  readonly resourcePath = "shops";

  validate(id: string): Observable<ApiResponse<Shop>> {
    return this.http.patch<ApiResponse<Shop>>(`${this.baseUrl}/${id}/validate`, {});
  }

  suspend(id: string): Observable<ApiResponse<Shop>> {
    return this.http.patch<ApiResponse<Shop>>(`${this.baseUrl}/${id}/suspend`, {});
  }
}
