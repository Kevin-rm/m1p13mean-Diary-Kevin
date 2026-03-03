import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Directive,
  input,
  model,
  output,
  signal,
  TemplateRef,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import { InputText } from "primeng/inputtext";
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { Button } from "primeng/button";
import { Drawer } from "primeng/drawer";

@Directive({ selector: "[catalogFilters]" })
export class CatalogFilters {}

@Component({
  selector: "app-catalog",
  templateUrl: "./catalog.html",
  imports: [NgTemplateOutlet, InputText, IconField, InputIcon, Button, Drawer],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Catalog {
  private searchTimeout?: ReturnType<typeof setTimeout>;
  protected readonly mobileFiltersOpen = signal(false);

  @ContentChild(CatalogFilters, { read: TemplateRef })
  protected filtersTemplate?: TemplateRef<unknown>;

  title = input.required<string>();
  subtitle = input<string>();
  searchPlaceholder = input("Rechercher...");
  search = model("");
  totalRecords = input(0);

  clearFilters = output<void>();

  protected onSearchInput(value: string): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => this.search.set(value), 400);
  }
}
