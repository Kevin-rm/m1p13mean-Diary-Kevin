import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiResponse } from "@core/models/api-response";
import { ActivatableResourceService } from "@core/services/resource";
import { Product } from "./product.model";

@Injectable({ providedIn: "root" })
export class ProductService extends ActivatableResourceService<Product> {
  protected readonly resourcePath = "products";

  removeImage(id: string, imageUrl: string): Observable<ApiResponse<Product>> {
    return this.http.delete<ApiResponse<Product>>(`${this.baseUrl}/${id}/images`, {
      body: { imageUrl },
    });
  }
}
