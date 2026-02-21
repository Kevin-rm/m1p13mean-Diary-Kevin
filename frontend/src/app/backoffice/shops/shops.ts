import { Component, inject, signal, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { finalize } from "rxjs";
import { TableModule, TableLazyLoadEvent } from "primeng/table";
import { InputText } from "primeng/inputtext";
import { Select } from "primeng/select";
import { Button } from "primeng/button";
import { Tag } from "primeng/tag";
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { Tooltip } from "primeng/tooltip";
import { Toast } from "../../core/utils/toast";
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
    InputText,
    Select,
    Button,
    Tag,
    IconField,
    InputIcon,
    Tooltip,
  ],
  templateUrl: "./shops.html",
})
export class AdminShops implements OnInit {
  private readonly shopService = inject(ShopService);
  private readonly toast = inject(Toast);
  private currentPage = 1;
  private currentLimit = 10;

  protected readonly shops = signal<Shop[]>([]);
  protected readonly totalRecords = signal(0);
  protected readonly loading = signal(false);
  protected readonly statusOptions = STATUS_OPTIONS;
  protected searchValue = "";
  protected statusFilter = "";

  ngOnInit(): void {
    this.loadShops();
  }

  protected loadShops(event?: TableLazyLoadEvent): void {
    if (event) {
      this.currentPage = Math.floor((event.first ?? 0) / (event.rows ?? 10)) + 1;
      this.currentLimit = event.rows ?? 10;
    }

    this.loading.set(true);
    this.shopService
      .list({
        search: this.searchValue || undefined,
        status: this.statusFilter || undefined,
        page: this.currentPage,
        limit: this.currentLimit,
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: response => {
          this.shops.set(response.data ?? []);
          this.totalRecords.set((response.meta?.["total"] as number) ?? 0);
        },
        error: () => {
          this.toast.error("Impossible de charger les boutiques");
        },
      });
  }

  protected onSearch(): void {
    this.currentPage = 1;
    this.loadShops();
  }

  protected onStatusFilter(): void {
    this.currentPage = 1;
    this.loadShops();
  }

  protected statusLabel(status: string): string {
    return STATUS_CONFIG[status]?.label ?? status;
  }

  protected statusSeverity(status: string): "warn" | "success" | "danger" {
    return STATUS_CONFIG[status]?.severity ?? "warn";
  }

  protected ownerName(shop: Shop): string {
    if (!shop.owner) return "—";
    return `${shop.owner.firstName} ${shop.owner.lastName}`;
  }

  protected validateShop(shop: Shop): void {
    this.shopService.validate(shop.id).subscribe({
      next: response => {
        this.toast.success(response.message);
        this.loadShops();
      },
      error: response => {
        this.toast.error(response.error?.message ?? "Impossible de valider la boutique");
      },
    });
  }

  protected suspendShop(shop: Shop): void {
    this.shopService.suspend(shop.id).subscribe({
      next: response => {
        this.toast.success(response.message);
        this.loadShops();
      },
      error: response => {
        this.toast.error(response.error?.message ?? "Impossible de suspendre la boutique");
      },
    });
  }
}
