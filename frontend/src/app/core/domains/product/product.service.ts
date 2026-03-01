import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiResponse } from "@core/common/models/api-response";
import { ResourceService } from "@core/common/resource.service";
import { Product } from "./product.model";

@Injectable({ providedIn: "root" })
export class ProductService extends ResourceService<Product> {
  readonly resourcePath = "products";

  addImages(id: string, files: File[]): Observable<ApiResponse<Product>> {
    const formData = new FormData();
    for (const file of files) {
      formData.append("images", file);
    }
    return this.http.post<ApiResponse<Product>>(`${this.baseUrl}/${id}/images`, formData);
  }

  removeImage(id: string, imageUrl: string): Observable<ApiResponse<Product>> {
    return this.http.delete<ApiResponse<Product>>(`${this.baseUrl}/${id}/images`, {
      body: { imageUrl },
    });
  }
}
