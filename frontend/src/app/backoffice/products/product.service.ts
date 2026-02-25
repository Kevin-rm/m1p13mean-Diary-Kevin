import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiResponse } from "@core/models/api-response";
import { ResourceService } from "@core/services/resource";
import { Product } from "./product.model";

export interface ProductListParams {
  search?: string;
  category?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

@Injectable({ providedIn: "root" })
export class ProductService extends ResourceService<Product> {
  protected readonly resourcePath = "products";

  override list(params: ProductListParams = {}): Observable<ApiResponse<Product[]>> {
    return super.list(params);
  }

  create(formData: FormData): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(this.baseUrl, formData);
  }

  removeImage(id: string, imageUrl: string): Observable<ApiResponse<Product>> {
    return this.http.delete<ApiResponse<Product>>(`${this.baseUrl}/${id}/images`, {
      body: { imageUrl },
    });
  }
}
