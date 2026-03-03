import { ChangeDetectionStrategy, Component, computed, inject, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Button } from "primeng/button";
import { Tag } from "primeng/tag";
import { CartService } from "@core/domains/cart/cart.service";
import { FavoritesService } from "@core/domains/favorites/favorites.service";
import { PublicProduct } from "@core/domains/public/public.models";
import { Toast } from "@core/utils/toast";
import { AriaryPipe } from "@shared/pipes/ariary";

@Component({
  selector: "app-product-card",
  templateUrl: "./product-card.html",
  imports: [RouterLink, Button, Tag, AriaryPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCard {
  private readonly cartService = inject(CartService);
  private readonly favoritesService = inject(FavoritesService);
  private readonly toast = inject(Toast);

  product = input.required<PublicProduct>();
  protected readonly isFavorite = computed(() =>
    this.favoritesService.isFavorite(this.product().id),
  );

  protected addToCart(): void {
    this.cartService.add(this.product());
    this.toast.success(`${this.product().name} ajouté au panier`);
  }

  protected toggleFavorite(): void {
    const added = this.favoritesService.toggle(this.product());
    this.toast.success(
      added
        ? `${this.product().name} ajouté aux favoris`
        : `${this.product().name} retiré des favoris`,
    );
  }
}
