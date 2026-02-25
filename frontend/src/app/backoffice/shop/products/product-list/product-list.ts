import { Component, inject, OnInit } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { map } from "rxjs";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { AriaryPipe } from "@shared/pipes/ariary";
import { TableModule, TableLazyLoadEvent } from "primeng/table";
import { DataTable } from "@shared/components/data-table/data-table";
import { Select } from "primeng/select";
import { Button } from "primeng/button";
import { ActiveTag } from "@shared/components/active-tag";
import { Tooltip } from "primeng/tooltip";
import { BreadcrumbService } from "@backoffice/layout/breadcrumb.service";
import { PageHeader } from "@backoffice/layout/page-header";
import { extractErrorMessage } from "@core/utils/error";
import { TableState } from "@core/utils/table-state";
import { Toast } from "@core/utils/toast";
import { SelectOption } from "@core/models/select-option";
import { CategoryService } from "@backoffice/admin/categories/category.service";
import { ProductService } from "../product.service";
import { NoValuePipe } from "@shared/pipes/no-value";
import { Product } from "../product.model";

const STATUS_OPTIONS = [
  { label: "Tous", value: "" },
  { label: "Actif", value: "true" },
  { label: "Inactif", value: "false" },
];

@Component({
  selector: "app-shop-product-list",
  imports: [
    FormsModule,
    AriaryPipe,
    TableModule,
    DataTable,
    Select,
    Button,
    ActiveTag,
    Tooltip,
    RouterLink,
    PageHeader,
    NoValuePipe,
  ],
  templateUrl: "./product-list.html",
})
export class ShopProductList implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly breadcrumb = inject(BreadcrumbService);
  private readonly toast = inject(Toast);
  private readonly router = inject(Router);

  protected readonly table = new TableState<Product>(inject(ActivatedRoute), this.router);
  protected readonly statusOptions = STATUS_OPTIONS;
  protected readonly categories = toSignal(
    this.categoryService
      .listForSelect()
      .pipe(
        map(r => [
          { label: "Toutes", value: "" },
          ...(r.data ?? []).map((c: SelectOption) => ({ label: c.name, value: c.id })),
        ]),
      ),
    { initialValue: [] as { label: string; value: string }[] },
  );
  protected categoryFilter = "";
  protected statusFilter = "";

  ngOnInit(): void {
    this.breadcrumb.set([{ label: "Produits" }]);
    this.categoryFilter = this.table.readFilterParam("category");
    this.statusFilter = this.table.readFilterParam("isActive");
    this.loadProducts();
  }

  protected loadProducts(event?: TableLazyLoadEvent): void {
    const queryParams = {
      search: this.table.search() || undefined,
      category: this.categoryFilter || undefined,
      isActive: this.statusFilter || undefined,
    };
    this.table.load(
      this.productService.list({
        ...queryParams,
        isActive: this.statusFilter ? this.statusFilter === "true" : undefined,
        page: this.table.page,
        limit: this.table.limit,
      }),
      {
        event,
        queryParams,
        onError: () => this.toast.error("Impossible de charger les produits"),
      },
    );
  }

  protected onFilter(): void {
    this.table.resetPage();
    this.loadProducts();
  }

  protected navigateToNew(): void {
    this.router.navigate(["/backoffice/shop/products/new"]);
  }

  protected toggleActive(product: Product): void {
    this.productService.toggleActive(product.id).subscribe({
      next: response => {
        this.toast.success(response.message);
        this.loadProducts();
      },
      error: error => {
        this.toast.error(extractErrorMessage(error, "Impossible de modifier le statut"));
      },
    });
  }
}
