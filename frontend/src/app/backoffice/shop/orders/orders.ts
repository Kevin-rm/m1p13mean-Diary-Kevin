import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from "@angular/core";
import { DatePipe } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { lastValueFrom } from "rxjs";
import { injectMutation, QueryClient } from "@tanstack/angular-query-experimental";
import { Select } from "primeng/select";
import { Button } from "primeng/button";
import { Tooltip } from "primeng/tooltip";
import { BreadcrumbService } from "@backoffice/layout/breadcrumb.service";
import { PageHeader } from "@backoffice/components/page-header";
import { DataTable } from "@shared/components/data-table/data-table";
import { AppTag } from "@shared/components/app-tag";
import { FullNamePipe } from "@shared/pipes/full-name";
import { AriaryPipe } from "@shared/pipes/ariary";
import { extractErrorMessage } from "@core/utils/error";
import { TableState, injectTableQuery } from "@core/utils/table-state";
import { Toast } from "@core/utils/toast";
import { OrderService } from "@core/domains/order/order.service";
import { Order, ORDER_STATUS_CONFIG } from "@core/domains/order/order.model";

const STATUS_OPTIONS = [
  { label: "Tous", value: "" },
  { label: "En attente", value: "pending" },
  { label: "Confirmée", value: "confirmed" },
  { label: "Refusée", value: "refused" },
  { label: "Annulée", value: "cancelled" },
];

@Component({
  selector: "app-shop-orders",
  imports: [
    DatePipe,
    FormsModule,
    Select,
    Button,
    Tooltip,
    PageHeader,
    DataTable,
    AppTag,
    FullNamePipe,
    AriaryPipe,
  ],
  templateUrl: "./orders.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopOrders implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly breadcrumb = inject(BreadcrumbService);
  private readonly toast = inject(Toast);
  private readonly queryClient = inject(QueryClient);

  protected readonly table = new TableState<Order>(inject(ActivatedRoute), inject(Router));
  protected readonly statusFilter = signal(this.table.readFilterParam("status"));
  protected readonly statusOptions = STATUS_OPTIONS;
  protected readonly statusConfig = ORDER_STATUS_CONFIG;

  protected readonly query = injectTableQuery(
    this.table,
    params => this.orderService.listQueryOptions(params),
    { filters: () => ({ status: this.statusFilter() || undefined }) },
  );

  private readonly confirmMutation = injectMutation(() => ({
    mutationFn: (id: string) => lastValueFrom(this.orderService.confirm(id)),
    onSuccess: () => {
      this.toast.success("Commande confirmée");
      this.queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: unknown) => this.toast.error(extractErrorMessage(error)),
  }));

  private readonly refuseMutation = injectMutation(() => ({
    mutationFn: (id: string) => lastValueFrom(this.orderService.refuse(id)),
    onSuccess: () => {
      this.toast.success("Commande refusée");
      this.queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: unknown) => this.toast.error(extractErrorMessage(error)),
  }));

  private readonly cancelMutation = injectMutation(() => ({
    mutationFn: (id: string) => lastValueFrom(this.orderService.cancel(id)),
    onSuccess: () => {
      this.toast.success("Commande annulée");
      this.queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: unknown) => this.toast.error(extractErrorMessage(error)),
  }));

  ngOnInit(): void {
    this.breadcrumb.set([{ label: "Commandes" }]);
  }

  protected onStatusFilter(): void {
    this.table.resetPage();
  }

  protected confirmOrder(id: string): void {
    this.confirmMutation.mutate(id);
  }

  protected refuseOrder(id: string): void {
    this.refuseMutation.mutate(id);
  }

  protected cancelOrder(id: string): void {
    this.cancelMutation.mutate(id);
  }
}
