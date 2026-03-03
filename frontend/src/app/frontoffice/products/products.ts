import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { injectQuery, keepPreviousData } from "@tanstack/angular-query-experimental";
import { InputGroup } from "primeng/inputgroup";
import { InputGroupAddon } from "primeng/inputgroupaddon";
import { InputNumber } from "primeng/inputnumber";
import { Paginator, PaginatorState } from "primeng/paginator";
import { Select } from "primeng/select";
import { PublicService } from "@core/domains/public/public.service";
import { Empty } from "@frontoffice/components/empty";
import { ProductCard } from "@frontoffice/components/product-card/product-card";
import { Loader } from "@shared/components/loader";
import { Catalog, CatalogFilters } from "@frontoffice/layout/catalog/catalog";

@Component({
  selector: "app-products",
  templateUrl: "./products.html",
  imports: [
    FormsModule,
    InputGroup,
    InputGroupAddon,
    InputNumber,
    Paginator,
    Select,
    Empty,
    Loader,
    Catalog,
    CatalogFilters,
    ProductCard,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Products {
  private readonly route = inject(ActivatedRoute);
  private readonly publicService = inject(PublicService);

  protected readonly search = signal("");
  protected readonly page = signal(1);
  protected readonly limit = signal(12);
  protected readonly categoryFilter = signal<string | undefined>(
    this.route.snapshot.queryParams["category"] || undefined,
  );
  protected readonly sortBy = signal<string | undefined>(undefined);
  protected readonly minPrice = signal<number | undefined>(undefined);
  protected readonly maxPrice = signal<number | undefined>(undefined);

  protected readonly sortOptions = [
    { label: "Plus récents", value: "newest" },
    { label: "Nom A-Z", value: "name" },
    { label: "Nom Z-A", value: "-name" },
    { label: "Prix croissant", value: "price" },
    { label: "Prix décroissant", value: "-price" },
  ];

  private readonly categoriesQuery = injectQuery(() =>
    this.publicService.listCategoriesQueryOptions(),
  );

  protected readonly categories = computed(() => this.categoriesQuery.data()?.data ?? []);

  private readonly productsQuery = injectQuery(() => {
    const params: Record<string, unknown> = {
      page: this.page(),
      limit: this.limit(),
      search: this.search() || undefined,
      category: this.categoryFilter() || undefined,
      sort: this.sortBy() ?? undefined,
      minPrice: this.minPrice() ?? undefined,
      maxPrice: this.maxPrice() ?? undefined,
    };
    return {
      ...this.publicService.listProductsQueryOptions(params),
      placeholderData: keepPreviousData,
    };
  });

  protected readonly products = computed(() => this.productsQuery.data()?.data ?? []);
  protected readonly totalRecords = computed(
    () => (this.productsQuery.data()?.meta?.["total"] as number) ?? 0,
  );
  protected readonly loading = computed(() => this.productsQuery.isPending());

  protected onCategoryChange(value: string | undefined): void {
    this.categoryFilter.set(value);
    this.page.set(1);
  }

  protected onSortChange(value: string | undefined): void {
    this.sortBy.set(value);
    this.page.set(1);
  }

  protected onMinPriceChange(value: number | undefined): void {
    this.minPrice.set(value);
    this.page.set(1);
  }

  protected onMaxPriceChange(value: number | undefined): void {
    this.maxPrice.set(value);
    this.page.set(1);
  }

  protected onPageChange(event: PaginatorState): void {
    this.page.set(Math.floor((event.first ?? 0) / (event.rows ?? this.limit())) + 1);
  }

  protected clearFilters(): void {
    this.search.set("");
    this.categoryFilter.set(undefined);
    this.sortBy.set(undefined);
    this.minPrice.set(undefined);
    this.maxPrice.set(undefined);
    this.page.set(1);
  }
}
