import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { Button } from "primeng/button";
import { CartService } from "@core/domains/cart/cart.service";
import { OrderService } from "@core/domains/order/order.service";
import { AuthService } from "@auth/auth.service";
import { Empty } from "@frontoffice/components/empty";
import { Toast } from "@core/utils/toast";
import { extractErrorMessage } from "@core/utils/error";
import { AriaryPipe } from "@shared/pipes/ariary";

@Component({
  selector: "app-cart",
  imports: [RouterLink, Button, Empty, AriaryPipe],
  templateUrl: "./cart.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cart {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly orderService = inject(OrderService);
  private readonly toast = inject(Toast);

  protected readonly cartService = inject(CartService);
  protected readonly checkoutLoading = signal(false);

  protected updateQty(productId: string, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  protected remove(productId: string): void {
    this.cartService.remove(productId);
  }

  protected checkout(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(["/login"]);
      return;
    }

    const items = this.cartService.cartItems().map(i => ({
      product: i.productId,
      quantity: i.quantity,
    }));

    this.checkoutLoading.set(true);
    this.orderService.checkout(items).subscribe({
      next: () => {
        this.cartService.clear();
        this.toast.success("Commande(s) créée(s) avec succès");
        this.router.navigate(["/orders"]);
      },
      error: err => {
        this.toast.error(extractErrorMessage(err));
        this.checkoutLoading.set(false);
      },
    });
  }
}
