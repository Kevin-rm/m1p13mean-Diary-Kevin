import { Component, inject, signal, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ShopService } from "./shop.service";
import { Shop } from "./shop.model";

@Component({
  selector: "app-shops",
  templateUrl: "./shops.html",
  styleUrls: ["./shop.css"],
  imports: [CommonModule],
})
export class Shops implements OnInit {
  private readonly shopService = inject(ShopService);

  shops = signal<Shop[]>([]);
  loading = signal(true);

  readonly defaultImage = "https://placehold.co/600x400/EEE/31343C?text=No+Image";

  ngOnInit(): void {
    this.loadShops();
  }

  loadShops() {
    this.shopService.list({ status: "active", page: 1, limit: 20 }).subscribe({
      next: res => {
        console.log(res.data);
        this.shops.set(res.data ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
