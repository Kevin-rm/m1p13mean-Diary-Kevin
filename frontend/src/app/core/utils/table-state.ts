import { signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, finalize } from "rxjs";
import { TableLazyLoadEvent } from "primeng/table";
import { ApiResponse } from "@core/models/api-response";

export class TableState<T> {
  readonly items = signal<T[]>([]);
  readonly totalRecords = signal(0);
  readonly loading = signal(false);
  readonly first = signal(0);
  readonly rows = signal(10);
  readonly search = signal("");
  page = 1;
  limit = 10;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {
    const params = this.route.snapshot.queryParams;
    this.page = +(params["page"] ?? 1);
    this.limit = +(params["limit"] ?? 10);
    this.first.set((this.page - 1) * this.limit);
    this.rows.set(this.limit);
    this.search.set(params["search"] ?? "");
  }

  readFilterParam(key: string): string {
    return this.route.snapshot.queryParams[key] ?? "";
  }

  handleLazyLoad(event: TableLazyLoadEvent): void {
    this.page = Math.floor((event.first ?? 0) / (event.rows ?? 10)) + 1;
    this.limit = event.rows ?? 10;
  }

  resetPage(): void {
    this.page = 1;
  }

  syncQueryParams(extra: Record<string, string | number | undefined>): void {
    const queryParams: Record<string, string | number | undefined> = {
      ...extra,
      page: this.page > 1 ? this.page : undefined,
      limit: this.limit !== 10 ? this.limit : undefined,
    };
    this.router.navigate([], { queryParams, queryParamsHandling: "replace", replaceUrl: true });
  }

  load(
    source$: Observable<ApiResponse<T[]>>,
    options: {
      event?: TableLazyLoadEvent;
      queryParams?: Record<string, string | number | undefined>;
      onError?: () => void;
    } = {},
  ): void {
    if (options.event) this.handleLazyLoad(options.event);
    if (options.queryParams) this.syncQueryParams(options.queryParams);

    this.loading.set(true);
    source$.pipe(finalize(() => this.loading.set(false))).subscribe({
      next: response => {
        this.items.set(response.data ?? []);
        this.totalRecords.set((response.meta?.["total"] as number) ?? 0);
      },
      error: options.onError,
    });
  }
}
