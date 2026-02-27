import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ActivatedRoute, Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { QueryClient } from "@tanstack/angular-query-experimental";
import { TableModule } from "primeng/table";
import { ContactLink } from "@shared/components/contact-link";
import { AppTag, TagConfig } from "@shared/components/app-tag";
import { DataTable } from "@shared/components/data-table/data-table";
import { Select } from "primeng/select";
import { Button } from "primeng/button";
import { Tooltip } from "primeng/tooltip";
import { BreadcrumbService } from "@backoffice/layout/breadcrumb.service";
import { PageHeader } from "@backoffice/layout/page-header";
import { FullNamePipe } from "@shared/pipes/full-name";
import { extractErrorMessage } from "@core/utils/error";
import { TableState, injectTableQuery } from "@core/utils/table-state";
import { Toast } from "@core/utils/toast";
import { ShopService } from "@core/domains/shop/shop.service";
import { Shop } from "@core/domains/shop/shop.model";

const STATUS_OPTIONS = [
  { label: "Tous", value: "" },
  { label: "En attente", value: "pending" },
  { label: "Actif", value: "active" },
  { label: "Suspendu", value: "suspended" },
];

const SHOP_STATUS_CONFIG: Record<string, TagConfig> = {
  pending: { label: "En attente", severity: "warn" },
  active: { label: "Actif", severity: "success" },
  suspended: { label: "Suspendu", severity: "danger" },
};

@Component({
  selector: "app-admin-shops",
  imports: [
    FormsModule,
    TableModule,
    ContactLink,
    AppTag,
    DataTable,
    Select,
    Button,
    Tooltip,
    PageHeader,
    FullNamePipe,
  ],
  templateUrl: "./shops.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminShops implements OnInit {
  private readonly shopService = inject(ShopService);
  private readonly breadcrumb = inject(BreadcrumbService);
  private readonly toast = inject(Toast);
  private readonly destroyRef = inject(DestroyRef);
  private readonly queryClient = inject(QueryClient);

  protected readonly table = new TableState<Shop>(inject(ActivatedRoute), inject(Router));
  protected readonly statusFilter = signal(this.table.readFilterParam("status"));

  protected readonly query = injectTableQuery(
    this.table,
    params => this.shopService.listQueryOptions(params),
    { filters: () => ({ status: this.statusFilter() || undefined }) },
  );

  protected readonly statusOptions = STATUS_OPTIONS;
  protected readonly statusConfig = SHOP_STATUS_CONFIG;

  ngOnInit(): void {
    this.breadcrumb.set([{ label: "Boutiques" }]);
  }

  protected onStatusFilter(): void {
    this.table.resetPage();
  }

  protected validateShop(shop: Shop): void {
    this.shopService
      .validate(shop.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => {
          this.toast.success(response.message);
          this.queryClient.invalidateQueries({ queryKey: [this.shopService.resourcePath] });
        },
        error: error => {
          this.toast.error(extractErrorMessage(error, "Impossible de valider la boutique"));
        },
      });
  }

  protected suspendShop(shop: Shop): void {
    this.shopService
      .suspend(shop.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => {
          this.toast.success(response.message);
          this.queryClient.invalidateQueries({ queryKey: [this.shopService.resourcePath] });
        },
        error: error => {
          this.toast.error(extractErrorMessage(error, "Impossible de suspendre la boutique"));
        },
      });
  }
}
