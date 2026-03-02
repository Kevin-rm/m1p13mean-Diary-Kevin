import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { lastValueFrom } from "rxjs";
import { injectMutation, injectQuery, QueryClient } from "@tanstack/angular-query-experimental";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { AriaryPipe } from "@shared/pipes/ariary";
import { TableModule } from "primeng/table";
import { DataTable } from "@shared/components/data-table/data-table";
import { Select } from "primeng/select";
import { Button } from "primeng/button";
import { ActiveTag } from "@shared/components/active-tag";
import { Tooltip } from "primeng/tooltip";
import { BreadcrumbService } from "@backoffice/layout/breadcrumb.service";
import { PageHeader } from "@backoffice/components/page-header";
import { extractErrorMessage } from "@core/utils/error";
import { TableState, injectTableQuery } from "@core/utils/table-state";
import { Toast } from "@core/utils/toast";
import { SelectOption } from "@core/common/resource.service";
import { CategoryService } from "@core/domains/catalog/category/category.service";
import { ProductService } from "@core/domains/catalog/product/product.service";
import { NoValuePipe } from "@shared/pipes/no-value";
import { Product } from "@core/domains/catalog/product/product.model";

const STATUS_OPTIONS = [
  { label: "Tous les statuts", value: "" },
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopProductList implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly breadcrumb = inject(BreadcrumbService);
  private readonly toast = inject(Toast);
  private readonly router = inject(Router);
  private readonly queryClient = inject(QueryClient);
  private readonly categoriesQuery = injectQuery(() => this.categoryService.selectQueryOptions());

  protected readonly table = new TableState<Product>(inject(ActivatedRoute), this.router);
  protected readonly categoryFilter = signal(this.table.readFilterParam("category"));
  protected readonly statusFilter = signal(this.table.readFilterParam("isActive"));

  protected readonly query = injectTableQuery(
    this.table,
    params => this.productService.listQueryOptions(params),
    {
      filters: () => ({
        category: this.categoryFilter() || undefined,
        isActive: this.statusFilter() ? this.statusFilter() === "true" : undefined,
      }),
    },
  );

  protected readonly toggleActiveMutation = injectMutation(() => ({
    mutationFn: (id: string) => lastValueFrom(this.productService.toggleActive(id)),
    onSuccess: (response: { message: string }) => {
      this.toast.success(response.message);
      this.queryClient.invalidateQueries({ queryKey: [this.productService.resourcePath] });
    },
    onError: error => {
      this.toast.error(extractErrorMessage(error, "Impossible de modifier le statut"));
    },
  }));

  protected readonly statusOptions = STATUS_OPTIONS;
  protected readonly categories = computed(() => [
    { label: "Toutes les catégories", value: "" },
    ...(this.categoriesQuery.data()?.data ?? []).map((c: SelectOption) => ({
      label: c.name,
      value: c.id,
    })),
  ]);

  ngOnInit(): void {
    this.breadcrumb.set([{ label: "Produits" }]);
  }

  protected onFilter(): void {
    this.table.resetPage();
  }

  protected navigateToNew(): void {
    this.router.navigate(["/backoffice/shop/products/new"]);
  }

  protected toggleActive(product: Product): void {
    this.toggleActiveMutation.mutate(product.id);
  }
}
