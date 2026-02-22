import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiResponse } from "@core/models/api-response";
import { ResourceService } from "@core/services/resource";
import { Category } from "./category.model";

export interface CategoryListParams {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

@Injectable({ providedIn: "root" })
export class CategoryService extends ResourceService<Category> {
  protected readonly resourcePath = "categories";

  override list(params: CategoryListParams = {}): Observable<ApiResponse<Category[]>> {
    return super.list(params);
  }

  create(data: { name: string; description?: string }): Observable<ApiResponse<Category>> {
    return this.http.post<ApiResponse<Category>>(this.baseUrl, data);
  }

  update(
    id: string,
    data: { name?: string; description?: string },
  ): Observable<ApiResponse<Category>> {
    return this.http.patch<ApiResponse<Category>>(`${this.baseUrl}/${id}`, data);
  }

  toggleActive(id: string): Observable<ApiResponse<Category>> {
    return this.http.patch<ApiResponse<Category>>(`${this.baseUrl}/${id}/toggle-active`, {});
  }
}
