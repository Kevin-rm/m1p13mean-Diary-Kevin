import { signal, effect } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TableLazyLoadEvent } from "primeng/table";
import { injectQuery, keepPreviousData } from "@tanstack/angular-query-experimental";
import { ApiResponse } from "@core/common/models/api-response";
import { buildQueryParams } from "./http-params";

export class TableState<T> {
  readonly items = signal<T[]>([]);
  readonly totalRecords = signal(0);
  readonly loading = signal(false);
  readonly first = signal(0);
  readonly rows = signal(10);
  readonly search = signal("");
  readonly page = signal(1);
  readonly limit = signal(10);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {
    const params = this.route.snapshot.queryParams;
    const p = +(params["page"] ?? 1);
    const l = +(params["limit"] ?? 10);
    this.page.set(p);
    this.limit.set(l);
    this.first.set((p - 1) * l);
    this.rows.set(l);
    this.search.set(params["search"] ?? "");
  }

  readFilterParam(key: string): string {
    return this.route.snapshot.queryParams[key] ?? "";
  }

  handleLazyLoad(event: TableLazyLoadEvent): void {
    this.page.set(Math.floor((event.first ?? 0) / (event.rows ?? 10)) + 1);
    this.limit.set(event.rows ?? 10);
    this.first.set(event.first ?? 0);
    this.rows.set(event.rows ?? 10);
  }

  resetPage(): void {
    this.page.set(1);
    this.first.set(0);
  }

  syncQueryParams(extra: Record<string, unknown> = {}): void {
    const queryParams = buildQueryParams({
      ...extra,
      search: this.search() || undefined,
      page: this.page() > 1 ? this.page() : undefined,
      limit: this.limit() !== 10 ? this.limit() : undefined,
    });
    this.router.navigate([], { queryParams, queryParamsHandling: "replace", replaceUrl: true });
  }
}

export interface TableQueryOptions {
  filters?: () => Record<string, unknown>;
}

export function injectTableQuery<T>(
  table: TableState<T>,
  optionsFn: (params: Record<string, unknown>) => {
    queryKey: readonly unknown[];
    queryFn: () => Promise<ApiResponse<T[]>>;
  },
  options: TableQueryOptions = {},
) {
  const query = injectQuery(() => {
    const extra = options.filters?.() ?? {};
    const params: Record<string, unknown> = {
      ...extra,
      search: table.search() || undefined,
      page: table.page(),
      limit: table.limit(),
    };
    return {
      ...optionsFn(params),
      placeholderData: keepPreviousData,
    };
  });

  effect(() => {
    const data = query.data();
    if (data) {
      table.items.set(data.data ?? []);
      table.totalRecords.set((data.meta?.["total"] as number) ?? 0);
    }
    table.loading.set(query.isPending());
    table.syncQueryParams(options.filters?.() ?? {});
  });

  return query;
}
