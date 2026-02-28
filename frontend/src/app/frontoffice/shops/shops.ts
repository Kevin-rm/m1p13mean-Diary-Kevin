import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { lastValueFrom } from "rxjs";
import { injectQuery } from "@tanstack/angular-query-experimental";
import { ShopService } from "@core/domains/shop/shop.service";

@Component({
  selector: "app-shops",
  templateUrl: "./shops.html",
  styleUrls: ["./shop.css"],
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Shops {
  private readonly shopService = inject(ShopService);

  private readonly shopsQuery = injectQuery(() => ({
    queryKey: ["shops", "active"],
    queryFn: () => lastValueFrom(this.shopService.list({ status: "active", page: 1, limit: 20 })),
  }));

  protected readonly shops = computed(() => this.shopsQuery.data()?.data ?? []);
  protected readonly loading = computed(() => this.shopsQuery.isPending());

  readonly defaultImage = "https://placehold.co/600x400/EEE/31343C?text=No+Image";
}
