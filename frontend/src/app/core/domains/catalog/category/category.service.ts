import { Injectable } from "@angular/core";
import {
  Creatable,
  Editable,
  Listable,
  ResourceService,
  Selectable,
} from "@core/common/resource.service";
import { Category } from "./category.model";

const _Base = Editable<Category>()(
  Creatable<Category>()(Selectable()(Listable<Category>()(ResourceService))),
);

@Injectable({ providedIn: "root" })
export class CategoryService extends _Base {
  readonly resourcePath = "categories";
}
