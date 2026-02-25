import { Component, effect, inject, signal, ElementRef, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ShopService } from "@backoffice/admin/shops/shop.service";
import { AuthService } from "@auth/auth.service";
import { Shop } from "@backoffice/admin/shops/shop.model";

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

  @ViewChild("slider") sliderRef!: ElementRef<HTMLDivElement>;

  readonly defaultImage = "https://placehold.co/600x400/EEE/31343C?text=No+Image";

  shop = signal<Shop | undefined>(undefined);
  isLoading = signal(true);
  error = signal<string | null>(null);
  currentIndex = signal(0);

  constructor() {
    effect(() => {
      this.loadShopProfile();
    });
  }

  private loadShopProfile(): void {
    const email = this.authService.user()?.email;
    if (!email) return;

    this.isLoading.set(true);

    this.shopService.getByOwnerEmail(email).subscribe({
      next: response => {
        this.shop.set(response.data);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set("Erreur lors du chargement du profil boutique");
        this.isLoading.set(false);
      },
    });
  }

  onScroll() {
    if (!this.sliderRef) return;

    const element = this.sliderRef.nativeElement;
    const index = Math.round(element.scrollLeft / element.offsetWidth);

    this.currentIndex.set(index);
  }

  protected scrollTo(index: number) {
    if (!this.sliderRef) return;

    const element = this.sliderRef.nativeElement;
    element.scrollTo({
      left: index * element.offsetWidth,
      behavior: "smooth",
    });

    this.currentIndex.set(index);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const shopId = this.shop()?.id;

    if (!shopId) return;

    this.shopService.uploadShopImage(shopId, file).subscribe({
      next: response => {
        console.log("Image uploaded successfully");

        if (!response.data?.shop) return;
        this.shop.set(response.data.shop);

        const length = response.data.shop.images?.length ?? 0;
        if (length > 0) {
          this.currentIndex.set(length - 1);
        }
      },
      error: err => {
        console.error(err);
        this.error.set("Erreur upload image");
      },
    });
  }
}
