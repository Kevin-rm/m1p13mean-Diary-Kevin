import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { lastValueFrom, Observable } from "rxjs";
import { environment } from "@env/environment";
import { ApiResponse } from "@core/common/models/api-response";
import { buildQueryParams } from "@core/utils/http-params";
import { PublicShop, PublicProduct, PublicCategory } from "./public.models";

@Injectable({ providedIn: "root" })
export class PublicService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/public`;

  // Shops

  listShops(params: Record<string, unknown> = {}): Observable<ApiResponse<PublicShop[]>> {
    return this.http.get<ApiResponse<PublicShop[]>>(`${this.baseUrl}/shops`, {
      params: buildQueryParams(params),
    });
  }

  listShopsQueryOptions(params: Record<string, unknown> = {}) {
    return {
      queryKey: ["public-shops", params] as const,
      queryFn: () => lastValueFrom(this.listShops(params)),
    };
  }

  getShop(id: string): Observable<ApiResponse<PublicShop>> {
    return this.http.get<ApiResponse<PublicShop>>(`${this.baseUrl}/shops/${id}`);
  }

  getShopQueryOptions(id: string) {
    return {
      queryKey: ["public-shops", id] as const,
      queryFn: () => lastValueFrom(this.getShop(id)),
    };
  }

  listShopProducts(
    shopId: string,
    params: Record<string, unknown> = {},
  ): Observable<ApiResponse<PublicProduct[]>> {
    return this.http.get<ApiResponse<PublicProduct[]>>(`${this.baseUrl}/shops/${shopId}/products`, {
      params: buildQueryParams(params),
    });
  }

  listShopProductsQueryOptions(shopId: string, params: Record<string, unknown> = {}) {
    return {
      queryKey: ["public-shops", shopId, "products", params] as const,
      queryFn: () => lastValueFrom(this.listShopProducts(shopId, params)),
    };
  }

  // Products

  listProducts(params: Record<string, unknown> = {}): Observable<ApiResponse<PublicProduct[]>> {
    return this.http.get<ApiResponse<PublicProduct[]>>(`${this.baseUrl}/products`, {
      params: buildQueryParams(params),
    });
  }

  listProductsQueryOptions(params: Record<string, unknown> = {}) {
    return {
      queryKey: ["public-products", params] as const,
      queryFn: () => lastValueFrom(this.listProducts(params)),
    };
  }

  getProduct(id: string): Observable<ApiResponse<PublicProduct>> {
    return this.http.get<ApiResponse<PublicProduct>>(`${this.baseUrl}/products/${id}`);
  }

  getProductQueryOptions(id: string) {
    return {
      queryKey: ["public-products", id] as const,
      queryFn: () => lastValueFrom(this.getProduct(id)),
    };
  }

  // Categories

  listCategories(): Observable<ApiResponse<PublicCategory[]>> {
    return this.http.get<ApiResponse<PublicCategory[]>>(`${this.baseUrl}/categories`);
  }

  listCategoriesQueryOptions() {
    return {
      queryKey: ["public-categories"] as const,
      queryFn: () => lastValueFrom(this.listCategories()),
    };
  }
}
