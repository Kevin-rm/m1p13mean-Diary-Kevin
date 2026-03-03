import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Button } from "primeng/button";
import { Tooltip } from "primeng/tooltip";
import { CartService } from "@core/domains/cart/cart.service";
import { FavoritesService, FavoriteItem } from "@core/domains/favorites/favorites.service";
import { Empty } from "@frontoffice/components/empty";
import { Toast } from "@core/utils/toast";
import { AriaryPipe } from "@shared/pipes/ariary";

@Component({
  selector: "app-favorites",
  imports: [RouterLink, Button, Tooltip, Empty, AriaryPipe],
  templateUrl: "./favorites.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Favorites {
  protected readonly favoritesService = inject(FavoritesService);
  private readonly cartService = inject(CartService);
  private readonly toast = inject(Toast);

  protected addToCart(item: FavoriteItem): void {
    this.cartService.add({
      id: item.productId,
      name: item.name,
      price: item.price,
      images: item.image ? [item.image] : [],
    });
    this.toast.success(`${item.name} ajouté au panier`);
  }

  protected remove(productId: string): void {
    this.favoritesService.remove(productId);
    this.toast.success("Retiré des favoris");
  }
}
