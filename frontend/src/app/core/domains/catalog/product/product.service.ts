import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiResponse } from "@core/common/models/api-response";
import {
  Creatable,
  Editable,
  Gettable,
  Listable,
  ResourceService,
  Selectable,
} from "@core/common/resource.service";
import { Product } from "./product.model";

const _Base = Editable<Product>()(
  Creatable<Product>()(Selectable()(Gettable<Product>()(Listable<Product>()(ResourceService)))),
);

@Injectable({ providedIn: "root" })
export class ProductService extends _Base {
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
