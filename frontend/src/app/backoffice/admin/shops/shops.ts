import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { TableModule, TableLazyLoadEvent } from "primeng/table";
import { ContactLink } from "@shared/components/contact-link";
import { DataTable } from "@shared/components/data-table/data-table";
import { Select } from "primeng/select";
import { Button } from "primeng/button";
import { Tag } from "primeng/tag";
import { Tooltip } from "primeng/tooltip";
import { BreadcrumbService } from "@backoffice/layout/breadcrumb.service";
import { PageHeader } from "@backoffice/layout/page-header";
import { NO_VALUE } from "@shared/pipes/no-value";
import { extractErrorMessage } from "@core/utils/error";
import { TableState } from "@core/utils/table-state";
import { Toast } from "@core/utils/toast";
import { ShopService } from "./shop.service";
import { Shop } from "./shop.model";

const STATUS_OPTIONS = [
  { label: "Tous", value: "" },
  { label: "En attente", value: "pending" },
  { label: "Actif", value: "active" },
  { label: "Suspendu", value: "suspended" },
];

const STATUS_CONFIG: Record<string, { label: string; severity: "warn" | "success" | "danger" }> = {
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
    DataTable,
    Select,
    Button,
    Tag,
    Tooltip,
    PageHeader,
  ],
  templateUrl: "./shops.html",
})
export class AdminShops implements OnInit {
  private readonly shopService = inject(ShopService);
  private readonly breadcrumb = inject(BreadcrumbService);
  private readonly toast = inject(Toast);

  protected readonly table = new TableState<Shop>(inject(ActivatedRoute), inject(Router));
  protected readonly statusOptions = STATUS_OPTIONS;
  protected statusFilter = "";

  ngOnInit(): void {
    this.breadcrumb.set([{ label: "Boutiques" }]);
    this.statusFilter = this.table.readFilterParam("status");
    this.loadShops();
  }

  protected loadShops(event?: TableLazyLoadEvent): void {
    const filters = {
      search: this.table.search() || undefined,
      status: this.statusFilter || undefined,
    };
    this.table.load(
      this.shopService.list({ ...filters, page: this.table.page, limit: this.table.limit }),
      {
        event,
        queryParams: filters,
        onError: () => this.toast.error("Impossible de charger les boutiques"),
      },
    );
  }

  protected onStatusFilter(): void {
    this.table.resetPage();
    this.loadShops();
  }

  protected statusLabel(status: string): string {
    return STATUS_CONFIG[status]?.label ?? status;
  }

  protected statusSeverity(status: string): "warn" | "success" | "danger" {
    return STATUS_CONFIG[status]?.severity ?? "warn";
  }

  protected ownerName(shop: Shop): string {
    if (!shop.owner) return NO_VALUE;
    return `${shop.owner.firstName} ${shop.owner.lastName}`;
  }

  protected validateShop(shop: Shop): void {
    this.shopService.validate(shop.id).subscribe({
      next: response => {
        this.toast.success(response.message);
        this.loadShops();
      },
      error: error => {
        this.toast.error(extractErrorMessage(error, "Impossible de valider la boutique"));
      },
    });
  }

  protected suspendShop(shop: Shop): void {
    this.shopService.suspend(shop.id).subscribe({
      next: response => {
        this.toast.success(response.message);
        this.loadShops();
      },
      error: error => {
        this.toast.error(extractErrorMessage(error, "Impossible de suspendre la boutique"));
      },
    });
  }
}
