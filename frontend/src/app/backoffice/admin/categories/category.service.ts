import { Injectable } from "@angular/core";
import { ActivatableResourceService } from "@core/services/resource";
import { Category } from "./category.model";

@Injectable({ providedIn: "root" })
export class CategoryService extends ActivatableResourceService<Category> {
  protected readonly resourcePath = "categories";
}
