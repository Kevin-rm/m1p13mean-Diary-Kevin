import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { DatePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { injectQuery } from "@tanstack/angular-query-experimental";
import { TableModule } from "primeng/table";
import { Select } from "primeng/select";
import { Button } from "primeng/button";
import { DataTable } from "@shared/components/data-table/data-table";
import { AppTag } from "@shared/components/app-tag";
import { FullNamePipe } from "@shared/pipes/full-name";
import { NoValuePipe } from "@shared/pipes/no-value";
import { BreadcrumbService } from "@backoffice/layout/breadcrumb.service";
import { PageHeader } from "@backoffice/components/page-header";
import { TableState, injectTableQuery } from "@core/utils/table-state";
import { SelectOption } from "@core/common/resource.service";
import { ProductService } from "@core/domains/catalog/product/product.service";
import { StockMovementService } from "@core/domains/catalog/stock-movement/stock-movement.service";
import {
  StockMovement,
  MOVEMENT_TYPE_OPTIONS,
  MOVEMENT_TYPE_TAG,
} from "@core/domains/catalog/stock-movement/stock-movement.model";

@Component({
  selector: "app-stock-movement-list",
  imports: [
    FormsModule,
    DatePipe,
    RouterLink,
    TableModule,
    Select,
    Button,
    DataTable,
    AppTag,
    FullNamePipe,
    NoValuePipe,
    PageHeader,
  ],
  templateUrl: "./stock-movement-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StockMovementList implements OnInit {
  private readonly stockMovementService = inject(StockMovementService);
  private readonly productService = inject(ProductService);
  private readonly breadcrumb = inject(BreadcrumbService);
  private readonly router = inject(Router);
  private readonly productsQuery = injectQuery(() => this.productService.selectQueryOptions());

  protected readonly table = new TableState<StockMovement>(inject(ActivatedRoute), this.router);
  protected readonly typeFilter = signal(this.table.readFilterParam("type"));
  protected readonly productFilter = signal(this.table.readFilterParam("product"));

  protected readonly query = injectTableQuery(
    this.table,
    params => this.stockMovementService.listQueryOptions(params),
    {
      filters: () => ({
        type: this.typeFilter() || undefined,
        product: this.productFilter() || undefined,
      }),
    },
  );

  protected readonly typeOptions = MOVEMENT_TYPE_OPTIONS;
  protected readonly movementTypeTag = MOVEMENT_TYPE_TAG;

  protected readonly products = computed(() => [
    { label: "Tous les produits", value: "" },
    ...(this.productsQuery.data()?.data ?? []).map((p: SelectOption) => ({
      label: p.name,
      value: p.id,
    })),
  ]);

  ngOnInit(): void {
    this.breadcrumb.set([{ label: "Mouvements de stock" }]);
  }

  protected onFilter(): void {
    this.table.resetPage();
  }

  protected navigateToNew(): void {
    this.router.navigate(["/backoffice/shop/stock-movements/new"]);
  }
}
