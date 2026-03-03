import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from "@angular/core";
import { Skeleton } from "primeng/skeleton";
import { injectQuery } from "@tanstack/angular-query-experimental";
import { BreadcrumbService } from "@backoffice/layout/breadcrumb.service";
import { PageHeader } from "@backoffice/components/page-header";
import { ShopService } from "@core/domains/shop/shop.service";
import { OrderService } from "@core/domains/order/order.service";
import { AriaryPipe } from "@shared/pipes/ariary";

@Component({
  selector: "app-admin-dashboard",
  imports: [Skeleton, PageHeader, AriaryPipe],
  templateUrl: "./dashboard.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboard implements OnInit {
  private readonly breadcrumb = inject(BreadcrumbService);
  private readonly shopService = inject(ShopService);
  private readonly orderService = inject(OrderService);

  protected readonly shopStats = injectQuery(() => this.shopService.statsQueryOptions());
  protected readonly orderStats = injectQuery(() => this.orderService.statsQueryOptions());

  protected readonly shops = computed(
    () => this.shopStats.data()?.data ?? { total: 0, byStatus: {} },
  );
  protected readonly orders = computed(
    () => this.orderStats.data()?.data ?? { total: 0, byStatus: {}, revenue: 0 },
  );

  ngOnInit(): void {
    this.breadcrumb.set([{ label: "Tableau de bord" }]);
  }
}
