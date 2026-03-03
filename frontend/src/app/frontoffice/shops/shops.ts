import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { injectQuery, keepPreviousData } from "@tanstack/angular-query-experimental";
import { Paginator, PaginatorState } from "primeng/paginator";
import { Rating } from "primeng/rating";
import { Select } from "primeng/select";
import { PublicService } from "@core/domains/public/public.service";
import { Empty } from "@frontoffice/components/empty";
import { Catalog, CatalogFilters } from "@frontoffice/layout/catalog/catalog";
import { ShopCardSkeleton } from "./shop-card-skeleton";

@Component({
  selector: "app-shops",
  templateUrl: "./shops.html",
  imports: [
    RouterLink,
    FormsModule,
    Paginator,
    Rating,
    Select,
    Empty,
    Catalog,
    CatalogFilters,
    ShopCardSkeleton,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Shops {
  private readonly publicService = inject(PublicService);
  private readonly query = injectQuery(() => {
    const params: Record<string, unknown> = {
      page: this.page(),
      limit: this.limit(),
      search: this.search() || undefined,
      sort: this.sortBy() ?? undefined,
    };
    return {
      ...this.publicService.listShopsQueryOptions(params),
      placeholderData: keepPreviousData,
    };
  });

  protected readonly search = signal("");
  protected readonly page = signal(1);
  protected readonly limit = signal(12);
  protected readonly sortBy = signal<string | undefined>(undefined);

  protected readonly sortOptions = [
    { label: "Nom A-Z", value: "name" },
    { label: "Nom Z-A", value: "-name" },
    { label: "Meilleures notes", value: "-rating" },
    { label: "Notes croissantes", value: "rating" },
  ];

  protected readonly shops = computed(() => this.query.data()?.data ?? []);
  protected readonly totalRecords = computed(
    () => (this.query.data()?.meta?.["total"] as number) ?? 0,
  );
  protected readonly loading = computed(() => this.query.isPending());

  protected onPageChange(event: PaginatorState): void {
    this.page.set(Math.floor((event.first ?? 0) / (event.rows ?? this.limit())) + 1);
  }

  protected onSortChange(value: string | undefined): void {
    this.sortBy.set(value);
    this.page.set(1);
  }

  protected clearFilters(): void {
    this.search.set("");
    this.sortBy.set(undefined);
    this.page.set(1);
  }
}
