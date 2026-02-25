import { Injectable, signal } from "@angular/core";
import { MenuItem } from "primeng/api";

@Injectable({ providedIn: "root" })
export class BreadcrumbService {
  private readonly _items = signal<MenuItem[]>([]);
  readonly items = this._items.asReadonly();

  set(items: MenuItem[]): void {
    this._items.set(items);
  }
}
