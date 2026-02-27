import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiResponse } from "@core/common/models/api-response";
import { ResourceService, ListParams } from "@core/common/resource.service";
import { Shop } from "./shop.model";

export interface ShopListParams extends ListParams {
  status?: string;
}

@Injectable({ providedIn: "root" })
export class ShopService extends ResourceService<Shop> {
  protected readonly resourcePath = "shops";

  override list(params: ShopListParams = {}): Observable<ApiResponse<Shop[]>> {
    return super.list(params);
  }
}
