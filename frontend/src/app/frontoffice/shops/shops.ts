import { Component, effect, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FontAwesomeModule, FaIconLibrary } from "@fortawesome/angular-fontawesome";
import { faShop } from "@fortawesome/free-solid-svg-icons";
import { ShopService } from "./shop.service";
import { Shop } from "./shop.model";

@Component({
  selector: "app-shops",
  standalone: true,
  templateUrl: "./shops.html",
  imports: [CommonModule, FontAwesomeModule],
})
export class Shops {
  private shopService = inject(ShopService);

  shops = signal<Shop[]>([]);
  loading = signal(true);

  readonly defaultImage = "https://placehold.co/600x400/EEE/31343C?text=No+Image";

  private library = inject(FaIconLibrary);

  constructor() {
    this.library.addIcons(faShop);
    effect(() => {
      this.loadShops();
    });
  }

  loadShops() {
    this.shopService.list({ status: "active", page: 1, limit: 20 }).subscribe({
      next: res => {
        this.shops.set(res.data ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
