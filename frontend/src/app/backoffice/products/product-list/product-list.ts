import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CurrencyPipe } from "@angular/common";
import { TableModule, TableLazyLoadEvent } from "primeng/table";
import { DataTable } from "@shared/data-table/data-table";
import { InputText } from "primeng/inputtext";
import { Select } from "primeng/select";
import { Button } from "primeng/button";
import { Tag } from "primeng/tag";
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { Tooltip } from "primeng/tooltip";
import { extractErrorMessage } from "@core/utils/error";
import { TableState } from "@core/utils/table-state";
import { Toast } from "@core/utils/toast";
import { CategoryService } from "@backoffice/categories/category.service";
import { Category } from "@backoffice/categories/category.model";
import { ProductService } from "../product.service";
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
    CurrencyPipe,
    TableModule,
    DataTable,
    InputText,
    Select,
    Button,
    Tag,
    IconField,
    InputIcon,
    Tooltip,
  ],
  templateUrl: "./product-list.html",
})
export class ShopProductList implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly toast = inject(Toast);
  private readonly router = inject(Router);

  protected readonly table = new TableState<Product>(inject(ActivatedRoute), this.router);
  protected readonly statusOptions = STATUS_OPTIONS;
  protected categories: { label: string; value: string }[] = [];
  protected searchValue = "";
  protected categoryFilter = "";
  protected statusFilter = "";

  ngOnInit(): void {
    this.searchValue = this.table.readFilterParam("search");
    this.categoryFilter = this.table.readFilterParam("category");
    this.statusFilter = this.table.readFilterParam("isActive");
    this.loadCategories();
    this.loadProducts();
  }

  protected loadProducts(event?: TableLazyLoadEvent): void {
    const queryParams = {
      search: this.searchValue || undefined,
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

  protected onSearch(): void {
    this.table.resetPage();
    this.loadProducts();
  }

  protected onFilter(): void {
    this.table.resetPage();
    this.loadProducts();
  }

  protected navigateToNew(): void {
    this.router.navigate(["/backoffice/shop/products/new"]);
  }

  protected navigateToProduct(product: Product): void {
    this.router.navigate(["/backoffice/shop/products", product.id]);
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

  private loadCategories(): void {
    this.categoryService.list({ isActive: true, limit: 100 }).subscribe({
      next: response => {
        this.categories = [
          { label: "Toutes", value: "" },
          ...(response.data ?? []).map((c: Category) => ({ label: c.name, value: c.id })),
        ];
      },
    });
  }
}
