import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { ApiResponse } from "../../core/models/api-response.model";
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
    let httpParams = new HttpParams();
    if (params.search) httpParams = httpParams.set("search", params.search);
    if (params.isActive !== undefined)
      httpParams = httpParams.set("isActive", String(params.isActive));
    if (params.page) httpParams = httpParams.set("page", String(params.page));
    if (params.limit) httpParams = httpParams.set("limit", String(params.limit));

    return this.http.get<ApiResponse<Category[]>>(this.baseUrl, { params: httpParams });
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
