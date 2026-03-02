import { inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, lastValueFrom } from "rxjs";
import { environment } from "@env/environment";
import { ApiResponse } from "./models/api-response";
import { buildQueryParams } from "@core/utils/http-params";

export interface SelectOption {
  id: string;
  name: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AbstractCtor<T = object> = abstract new (...args: any[]) => T;

export abstract class ResourceService {
  protected readonly http = inject(HttpClient);
  abstract readonly resourcePath: string;

  protected get baseUrl(): string {
    return `${environment.apiUrl}/${this.resourcePath}`;
  }
}

export function Listable<T>() {
  return <TBase extends AbstractCtor<ResourceService>>(Base: TBase) => {
    abstract class ListableResource extends Base {
      list(params: Record<string, unknown> = {}): Observable<ApiResponse<T[]>> {
        return this.http.get<ApiResponse<T[]>>(this.baseUrl, { params: buildQueryParams(params) });
      }

      listQueryOptions(params: Record<string, unknown> = {}) {
        return {
          queryKey: [this.resourcePath, params] as const,
          queryFn: () => lastValueFrom(this.list(params)),
        };
      }
    }
    return ListableResource;
  };
}

export function Selectable() {
  return <TBase extends AbstractCtor<ResourceService>>(Base: TBase) => {
    abstract class SelectableResource extends Base {
      listForSelect(): Observable<ApiResponse<SelectOption[]>> {
        return this.http.get<ApiResponse<SelectOption[]>>(`${this.baseUrl}/select`);
      }

      selectQueryOptions() {
        return {
          queryKey: [this.resourcePath, "select"] as const,
          queryFn: () => lastValueFrom(this.listForSelect()),
        };
      }
    }
    return SelectableResource;
  };
}

export function Gettable<T>() {
  return <TBase extends AbstractCtor<ResourceService>>(Base: TBase) => {
    abstract class GettableResource extends Base {
      getById(id: string): Observable<ApiResponse<T>> {
        return this.http.get<ApiResponse<T>>(`${this.baseUrl}/${id}`);
      }

      getByIdQueryOptions(id: string) {
        return {
          queryKey: [this.resourcePath, id] as const,
          queryFn: () => lastValueFrom(this.getById(id)),
        };
      }
    }
    return GettableResource;
  };
}

export function Creatable<T>() {
  return <TBase extends AbstractCtor<ResourceService>>(Base: TBase) => {
    abstract class CreatableResource extends Base {
      create(data: FormData | object): Observable<ApiResponse<T>> {
        return this.http.post<ApiResponse<T>>(this.baseUrl, data);
      }
    }
    return CreatableResource;
  };
}

export function Editable<T>() {
  return <TBase extends AbstractCtor<ResourceService>>(Base: TBase) => {
    abstract class EditableResource extends Base {
      update(id: string, data: object): Observable<ApiResponse<T>> {
        return this.http.patch<ApiResponse<T>>(`${this.baseUrl}/${id}`, data);
      }

      toggleActive(id: string): Observable<ApiResponse<T>> {
        return this.http.patch<ApiResponse<T>>(`${this.baseUrl}/${id}/toggle-active`, {});
      }
    }
    return EditableResource;
  };
}
