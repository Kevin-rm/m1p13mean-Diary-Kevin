import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  ViewChild,
  inject,
  input,
  output,
  TemplateRef,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgTemplateOutlet } from "@angular/common";
import { Table, TableModule, TableLazyLoadEvent } from "primeng/table";
import { InputText } from "primeng/inputtext";
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { TableState } from "@core/utils/table-state";

@Component({
  selector: "app-data-table",
  imports: [FormsModule, NgTemplateOutlet, TableModule, InputText, IconField, InputIcon],
  templateUrl: "./data-table.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTable {
  @ViewChild(Table, { static: true }) private table!: Table;
  private readonly parentInjector = inject(Injector);
  private _tableInjector?: Injector;

  state = input.required<TableState<unknown>>();
  headerTpl = input.required<TemplateRef<unknown>>();
  bodyTpl = input.required<TemplateRef<unknown>>();
  columns = input.required<number>();
  searchPlaceholder = input("Rechercher...");
  emptyMessage = input("Aucun élément trouvé");
  tableStyle = input<Record<string, string>>({});
  lazyLoad = output<TableLazyLoadEvent>();
  searchChange = output<void>();

  protected onSearch(): void {
    this.state().resetPage();
    this.searchChange.emit();
  }

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
