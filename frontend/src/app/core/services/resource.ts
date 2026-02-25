import { inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "@env/environment";
import { ApiResponse } from "../models/api-response";
import { buildQueryParams } from "../utils/http-params";

export interface ListParams {
  search?: string;
  page?: number;
  limit?: number;
}

export abstract class ResourceService<T> {
  protected readonly http = inject(HttpClient);
  protected abstract readonly resourcePath: string;

  protected get baseUrl(): string {
    return `${environment.apiUrl}/${this.resourcePath}`;
  }

  list<P extends ListParams>(params: P = {} as P): Observable<ApiResponse<T[]>> {
    return this.http.get<ApiResponse<T[]>>(this.baseUrl, { params: buildQueryParams(params) });
  }

  getById(id: string): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(`${this.baseUrl}/${id}`);
  }

  create(data: FormData | object): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(this.baseUrl, data);
  }

  update(id: string, data: object): Observable<ApiResponse<T>> {
    return this.http.patch<ApiResponse<T>>(`${this.baseUrl}/${id}`, data);
  }
}

export abstract class ActivatableResourceService<T> extends ResourceService<T> {
  toggleActive(id: string): Observable<ApiResponse<T>> {
    return this.http.patch<ApiResponse<T>>(`${this.baseUrl}/${id}/toggle-active`, {});
  }
}
