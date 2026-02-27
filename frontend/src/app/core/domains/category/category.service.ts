import { Injectable } from "@angular/core";
import { Observable, shareReplay } from "rxjs";
import { ApiResponse } from "@core/common/models/api-response";
import { SelectOption } from "@core/common/models/select-option";
import { ActivatableResourceService } from "@core/common/resource.service";
import { Category } from "./category.model";

@Injectable({ providedIn: "root" })
export class CategoryService extends ActivatableResourceService<Category> {
  private selectCache$: Observable<ApiResponse<SelectOption[]>> | null = null;

  protected readonly resourcePath = "categories";

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
