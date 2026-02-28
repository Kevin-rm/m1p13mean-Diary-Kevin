import { inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, lastValueFrom } from "rxjs";
import { environment } from "@env/environment";
import { ApiResponse } from "./models/api-response";
import { SelectOption } from "./models/select-option";
import { buildQueryParams } from "@core/utils/http-params";

export interface ListParams {
  search?: string;
  page?: number;
  limit?: number;
}

export abstract class ResourceService<T> {
  protected readonly http = inject(HttpClient);
  abstract readonly resourcePath: string;

  protected get baseUrl(): string {
    return `${environment.apiUrl}/${this.resourcePath}`;
  }

  list<P extends ListParams>(params: P = {} as P): Observable<ApiResponse<T[]>> {
    return this.http.get<ApiResponse<T[]>>(this.baseUrl, { params: buildQueryParams(params) });
  }

  listQueryOptions(params: Record<string, unknown> = {}) {
    return {
      queryKey: [this.resourcePath, params] as const,
      queryFn: () => lastValueFrom(this.list(params)),
    };
  }

  listForSelect(): Observable<ApiResponse<SelectOption[]>> {
    return this.http.get<ApiResponse<SelectOption[]>>(`${this.baseUrl}/select`);
  }

  selectQueryOptions() {
    return {
      queryKey: [this.resourcePath, "select"] as const,
      queryFn: () => lastValueFrom(this.listForSelect()),
    };
  }

  getById(id: string): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(`${this.baseUrl}/${id}`);
  }

  getByIdQueryOptions(id: string) {
    return {
      queryKey: [this.resourcePath, id] as const,
      queryFn: () => lastValueFrom(this.getById(id)),
    };
  }

  create(data: FormData | object): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(this.baseUrl, data);
  }

  update(id: string, data: object): Observable<ApiResponse<T>> {
    return this.http.patch<ApiResponse<T>>(`${this.baseUrl}/${id}`, data);
  }

  toggleActive(id: string): Observable<ApiResponse<T>> {
    return this.http.patch<ApiResponse<T>>(`${this.baseUrl}/${id}/toggle-active`, {});
  }
}
