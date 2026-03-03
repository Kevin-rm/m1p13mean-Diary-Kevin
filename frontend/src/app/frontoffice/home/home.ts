import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { injectQuery } from "@tanstack/angular-query-experimental";
import { Skeleton } from "primeng/skeleton";
import { AuthService } from "@auth/auth.service";
import { CartService } from "@core/domains/cart/cart.service";
import { FavoritesService } from "@core/domains/favorites/favorites.service";
import { OrderService } from "@core/domains/order/order.service";
import { ORDER_STATUS_CONFIG } from "@core/domains/order/order.model";
import { PublicService } from "@core/domains/public/public.service";
import { ProductCard } from "@frontoffice/components/product-card/product-card";
import { AppTag } from "@shared/components/app-tag";
import { AriaryPipe } from "@shared/pipes/ariary";

@Component({
  selector: "app-home",
  imports: [RouterLink, Skeleton, ProductCard, AppTag, AriaryPipe],
  templateUrl: "./home.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  protected readonly authService = inject(AuthService);
  protected readonly cartService = inject(CartService);
  protected readonly favoritesService = inject(FavoritesService);
  private readonly orderService = inject(OrderService);
  private readonly publicService = inject(PublicService);

  protected readonly orderStatusConfig = ORDER_STATUS_CONFIG;

  private readonly ordersQuery = injectQuery(() =>
    this.orderService.listMyOrdersQueryOptions({ limit: 5 }),
  );

  private readonly featuredQuery = injectQuery(() =>
    this.publicService.listProductsQueryOptions({ limit: 4, sort: "newest" }),
  );

  protected readonly myOrders = computed(() => this.ordersQuery.data()?.data ?? []);
  protected readonly featuredProducts = computed(() => this.featuredQuery.data()?.data ?? []);
  protected readonly featuredLoading = computed(() => this.featuredQuery.isPending());
}
