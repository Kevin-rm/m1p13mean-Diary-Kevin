import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from "@angular/core";
import { TableModule } from "primeng/table";
import { Skeleton } from "primeng/skeleton";
import { Tag } from "primeng/tag";
import { injectQuery } from "@tanstack/angular-query-experimental";
import { BreadcrumbService } from "@backoffice/layout/breadcrumb.service";
import { PageHeader } from "@backoffice/components/page-header";
import { OrderService } from "@core/domains/order/order.service";
import { ProductService } from "@core/domains/catalog/product/product.service";
import { ORDER_STATUS_CONFIG } from "@core/domains/order/order.model";
import { AppTag } from "@shared/components/app-tag";
import { AriaryPipe } from "@shared/pipes/ariary";
import { FullNamePipe } from "@shared/pipes/full-name";

@Component({
  selector: "app-shop-dashboard",
  imports: [TableModule, Skeleton, Tag, PageHeader, AppTag, AriaryPipe, FullNamePipe],
  templateUrl: "./dashboard.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopDashboard implements OnInit {
  private readonly breadcrumb = inject(BreadcrumbService);
  private readonly orderService = inject(OrderService);
  private readonly productService = inject(ProductService);

  protected readonly orderStatusConfig = ORDER_STATUS_CONFIG;

  protected readonly orderStats = injectQuery(() => this.orderService.statsQueryOptions());
  protected readonly productStats = injectQuery(() => this.productService.statsQueryOptions());

  protected readonly orders = computed(
    () => this.orderStats.data()?.data ?? { total: 0, byStatus: {}, revenue: 0, recentOrders: [] },
  );
  protected readonly products = computed(
    () => this.productStats.data()?.data ?? { total: 0, active: 0, lowStock: [] },
  );

  ngOnInit(): void {
    this.breadcrumb.set([{ label: "Tableau de bord" }]);
  }
}
