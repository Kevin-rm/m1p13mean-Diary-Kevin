import { Injectable, signal, computed } from "@angular/core";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

const STORAGE_KEY = "mallhub_cart";

@Injectable({ providedIn: "root" })
export class CartService {
  private readonly items = signal<CartItem[]>(this.load());

  readonly cartItems = this.items.asReadonly();
  readonly count = computed(() => this.items().reduce((sum, i) => sum + i.quantity, 0));
  readonly total = computed(() => this.items().reduce((sum, i) => sum + i.price * i.quantity, 0));

  add(product: { id: string; name: string; price: number; images: string[] }): void {
    this.items.update(items => {
      const existing = items.find(i => i.productId === product.id);
      if (existing) {
        return items.map(i =>
          i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [
        ...items,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0],
          quantity: 1,
        },
      ];
    });
    this.save();
  }

  remove(productId: string): void {
    this.items.update(items => items.filter(i => i.productId !== productId));
    this.save();
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) return this.remove(productId);
    this.items.update(items =>
      items.map(i => (i.productId === productId ? { ...i, quantity } : i)),
    );
    this.save();
  }

  clear(): void {
    this.items.set([]);
    this.save();
  }

  private save(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items()));
  }

  private load(): CartItem[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }
}
