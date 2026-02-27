import { Injectable } from "@angular/core";
import { Observable, shareReplay } from "rxjs";
import { ApiResponse } from "@core/models/api-response";
import { SelectOption } from "@core/models/select-option";
import { ActivatableResourceService } from "@core/services/resource";
import { Category } from "@core/models/category";

@Injectable({ providedIn: "root" })
export class CategoryService extends ActivatableResourceService<Category> {
  protected readonly resourcePath = "categories";

  private selectCache$: Observable<ApiResponse<SelectOption[]>> | null = null;

  override listForSelect(): Observable<ApiResponse<SelectOption[]>> {
    if (!this.selectCache$) {
      this.selectCache$ = super.listForSelect().pipe(shareReplay(1));
    }
    return this.selectCache$;
  }

  invalidateSelectCache(): void {
    this.selectCache$ = null;
  }
}
