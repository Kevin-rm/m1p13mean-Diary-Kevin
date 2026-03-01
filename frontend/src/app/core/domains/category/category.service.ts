import { Injectable } from "@angular/core";
import { ResourceService } from "@core/common/resource.service";
import { Category } from "./category.model";

@Injectable({ providedIn: "root" })
export class CategoryService extends ResourceService<Category> {
  readonly resourcePath = "categories";
}
