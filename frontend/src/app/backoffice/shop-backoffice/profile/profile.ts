import { Component, effect, inject, signal } from "@angular/core";
import { ShopService } from "@backoffice/shops/shop.service";
import { CommonModule } from "@angular/common";
import { Shop } from "@backoffice/shops/shop.model";
import { AuthService } from "@auth/auth.service";

@Component({
  selector: "app-profile",
  standalone: true,
  templateUrl: "./profile.html",
  styleUrls: ["./profile.css"],
  imports: [CommonModule],
})
export class ShopProfile {
  private readonly shopService = inject(ShopService);
  protected readonly authService = inject(AuthService);

  shop = signal<Shop | undefined>(undefined);
  isLoading = signal(true);
  error = signal<string | null>(null);

  constructor() {
    effect(() => {
      this.loadShopProfile();
    });
  }

  private loadShopProfile(): void {
    const email = this.authService.user()?.email;

    this.isLoading.set(true);
    this.shopService.getByOwnerEmail(email).subscribe({
      next: response => {
        this.shop.set(response.data);
        this.isLoading.set(false);
        this.error.set(null);
      },
      error: err => {
        this.error.set("Erreur lors du chargement du profil boutique");
        this.isLoading.set(false);
        console.error("Error loading shop:", err);
      },
    });
  }
}
