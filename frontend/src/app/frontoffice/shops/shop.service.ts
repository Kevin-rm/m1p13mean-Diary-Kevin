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
}
