import { Injectable, signal, computed } from "@angular/core";

export interface FavoriteItem {
  productId: string;
  name: string;
  price: number;
  image?: string;
}

const STORAGE_KEY = "mallhub_favorites";

@Injectable({ providedIn: "root" })
export class FavoritesService {
  private readonly items = signal<FavoriteItem[]>(this.load());

  readonly favoriteItems = this.items.asReadonly();
  readonly count = computed(() => this.items().length);

  isFavorite(productId: string): boolean {
    return this.items().some(i => i.productId === productId);
  }

  toggle(product: { id: string; name: string; price: number; images: string[] }): boolean {
    if (this.isFavorite(product.id)) {
      this.items.update(items => items.filter(i => i.productId !== product.id));
      this.save();
      return false;
    }
    this.items.update(items => [
      ...items,
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
      },
    ]);
    this.save();
    return true;
  }

  remove(productId: string): void {
    this.items.update(items => items.filter(i => i.productId !== productId));
    this.save();
  }

  clear(): void {
    this.items.set([]);
    this.save();
  }

  private save(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items()));
  }

  private load(): FavoriteItem[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }
}
