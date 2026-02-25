import { Component, Injector, ViewChild, inject, input, output, TemplateRef } from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import { Table, TableModule, TableLazyLoadEvent } from "primeng/table";
import { TableState } from "@core/utils/table-state";

@Component({
  selector: "app-data-table",
  imports: [NgTemplateOutlet, TableModule],
  templateUrl: "./data-table.html",
})
export class DataTable {
  @ViewChild(Table, { static: true }) private table!: Table;
  private readonly parentInjector = inject(Injector);
  private _tableInjector?: Injector;

  state = input.required<TableState<unknown>>();
  headerTpl = input.required<TemplateRef<unknown>>();
  bodyTpl = input.required<TemplateRef<unknown>>();
  columns = input.required<number>();
  emptyMessage = input("Aucun élément trouvé");
  tableStyle = input<Record<string, string>>({});
  lazyLoad = output<TableLazyLoadEvent>();

  protected get tableInjector(): Injector {
    if (!this._tableInjector) {
      this._tableInjector = Injector.create({
        providers: [{ provide: Table, useValue: this.table }],
        parent: this.parentInjector,
      });
    }
    return this._tableInjector;
  }
}
