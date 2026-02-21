import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { ApiResponse } from "../../core/models/api-response.model";
import { buildQueryParams } from "../../core/utils/http-params";
import { Category } from "./category.model";

export interface CategoryListParams {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

@Injectable({ providedIn: "root" })
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/categories`;

  list(params: CategoryListParams = {}): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(this.baseUrl, {
      params: buildQueryParams(params),
    });
  }

  getById(id: string): Observable<ApiResponse<Category>> {
    return this.http.get<ApiResponse<Category>>(`${this.baseUrl}/${id}`);
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
