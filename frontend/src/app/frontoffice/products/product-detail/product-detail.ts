import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { injectQuery } from "@tanstack/angular-query-experimental";
import { Carousel } from "primeng/carousel";
import { Button } from "primeng/button";
import { Tag } from "primeng/tag";
import { PublicService } from "@core/domains/public/public.service";
import { CartService } from "@core/domains/cart/cart.service";
import { FavoritesService } from "@core/domains/favorites/favorites.service";
import { Toast } from "@core/utils/toast";
import { Loader } from "@shared/components/loader";
import { AriaryPipe } from "@shared/pipes/ariary";

@Component({
  selector: "app-product-detail",
  templateUrl: "./product-detail.html",
  imports: [RouterLink, Carousel, Button, Tag, Loader, AriaryPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly publicService = inject(PublicService);
  private readonly cartService = inject(CartService);
  private readonly favoritesService = inject(FavoritesService);
  private readonly toast = inject(Toast);
  private readonly productId = this.route.snapshot.params["id"];

  private readonly query = injectQuery(() =>
    this.publicService.getProductQueryOptions(this.productId),
  );

  protected readonly product = computed(() => this.query.data()?.data);
  protected readonly loading = computed(() => this.query.isPending());
  protected readonly isFavorite = computed(() => {
    const p = this.product();
    return p ? this.favoritesService.isFavorite(p.id) : false;
  });

  protected addToCart(): void {
    const p = this.product();
    if (!p) return;
    this.cartService.add(p);
    this.toast.success(`${p.name} ajouté au panier`);
  }

  protected toggleFavorite(): void {
    const p = this.product();
    if (!p) return;
    const added = this.favoritesService.toggle(p);
    this.toast.success(added ? `${p.name} ajouté aux favoris` : `${p.name} retiré des favoris`);
  }
}
