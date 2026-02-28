import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { lastValueFrom, Observable } from "rxjs";
import { environment } from "@env/environment";
import { ApiResponse } from "@core/common/models/api-response";
import { SelectOption } from "@core/common/models/select-option";

@Injectable({ providedIn: "root" })
export class RoleService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/roles`;

  select(): Observable<ApiResponse<SelectOption[]>> {
    return this.http.get<ApiResponse<SelectOption[]>>(`${this.baseUrl}/select`);
  }

  selectQueryOptions() {
    return {
      queryKey: ["roles", "select"] as const,
      queryFn: () => lastValueFrom(this.select()),
    };
  }
}
