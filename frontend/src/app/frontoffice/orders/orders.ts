import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { DatePipe } from "@angular/common";
import { Paginator, PaginatorState } from "primeng/paginator";
import { Skeleton } from "primeng/skeleton";
import { injectQuery } from "@tanstack/angular-query-experimental";
import { OrderService } from "@core/domains/order/order.service";
import { Order, ORDER_STATUS_CONFIG } from "@core/domains/order/order.model";
import { Empty } from "@frontoffice/components/empty";
import { AppTag } from "@shared/components/app-tag";
import { AriaryPipe } from "@shared/pipes/ariary";

interface OrderGroup {
  checkoutRef: string;
  orders: Order[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

const STATUS_BORDER_CLASS: Record<string, string> = {
  pending: "border-l-amber-400",
  confirmed: "border-l-green-500",
  refused: "border-l-red-500",
  cancelled: "border-l-gray-400",
};

@Component({
  selector: "app-my-orders",
  imports: [DatePipe, Paginator, Skeleton, Empty, AppTag, AriaryPipe],
  templateUrl: "./orders.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyOrders {
  private readonly orderService = inject(OrderService);

  protected readonly orderStatusConfig = ORDER_STATUS_CONFIG;
  protected readonly page = signal(1);
  protected readonly limit = signal(20);

  private readonly query = injectQuery(() =>
    this.orderService.listMyOrdersQueryOptions({
      page: this.page(),
      limit: this.limit(),
    }),
  );

  protected readonly orders = computed(() => this.query.data()?.data ?? []);
  protected readonly totalRecords = computed(
    () => (this.query.data()?.meta?.["total"] as number) ?? 0,
  );
  protected readonly loading = computed(() => this.query.isPending());

  protected readonly groupedOrders = computed<OrderGroup[]>(() => {
    const orders = this.orders();
    const groups = new Map<string, Order[]>();

    for (const order of orders) {
      const key = order.checkoutRef ?? order.id;
      const group = groups.get(key);
      if (group) {
        group.push(order);
      } else {
        groups.set(key, [order]);
      }
    }

    return Array.from(groups.entries()).map(([ref, groupOrders]) => ({
      checkoutRef: ref,
      orders: groupOrders,
      totalAmount: groupOrders.reduce((sum, o) => sum + o.totalAmount, 0),
      status: groupOrders[0].status,
      createdAt: groupOrders[0].createdAt,
    }));
  });

  protected statusBorderClass(status: string): string {
    return STATUS_BORDER_CLASS[status] ?? "border-l-gray-300";
  }

  protected onPageChange(event: PaginatorState): void {
    this.page.set(Math.floor((event.first ?? 0) / (event.rows ?? this.limit())) + 1);
  }
}
