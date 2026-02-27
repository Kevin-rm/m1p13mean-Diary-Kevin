import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
  OnInit,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { CommonModule } from "@angular/common";
import { ShopService } from "@core/domains/shop/shop.service";
import { Shop } from "@core/domains/shop/shop.model";

@Component({
  selector: "app-shops",
  templateUrl: "./shops.html",
  styleUrls: ["./shop.css"],
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Shops implements OnInit {
  private readonly shopService = inject(ShopService);
  private readonly destroyRef = inject(DestroyRef);

  shops = signal<Shop[]>([]);
  loading = signal(true);

  readonly defaultImage = "https://placehold.co/600x400/EEE/31343C?text=No+Image";

  ngOnInit(): void {
    this.loadShops();
  }

  loadShops() {
    this.shopService
      .list({ status: "active", page: 1, limit: 20 })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
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
