import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { injectQuery } from "@tanstack/angular-query-experimental";
import { TableModule } from "primeng/table";
import { Select } from "primeng/select";
import { Button } from "primeng/button";
import { InputNumber } from "primeng/inputnumber";
import { Textarea } from "primeng/textarea";
import { BreadcrumbService } from "@backoffice/layout/breadcrumb.service";
import { PageHeader } from "@backoffice/components/page-header";
import { ProductService } from "@core/domains/catalog/product/product.service";
import { OrderService } from "@core/domains/order/order.service";
import { Product } from "@core/domains/catalog/product/product.model";
import { extractErrorMessage } from "@core/utils/error";
import { Toast } from "@core/utils/toast";
import { AriaryPipe } from "@shared/pipes/ariary";

interface OrderLineItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

@Component({
  selector: "app-shop-order-form",
  imports: [
    FormsModule,
    TableModule,
    Select,
    Button,
    InputNumber,
    Textarea,
    PageHeader,
    AriaryPipe,
  ],
  templateUrl: "./order-form.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopOrderForm implements OnInit {
  private readonly router = inject(Router);
  private readonly breadcrumb = inject(BreadcrumbService);
  private readonly productService = inject(ProductService);
  private readonly orderService = inject(OrderService);
  private readonly toast = inject(Toast);

  private readonly productsQuery = injectQuery(() =>
    this.productService.listQueryOptions({ limit: 100, isActive: true }),
  );

  protected readonly availableProducts = computed(() => this.productsQuery.data()?.data ?? []);
  protected readonly selectedProduct = signal<Product | null>(null);
  protected readonly items = signal<OrderLineItem[]>([]);
  protected readonly note = signal("");
  protected readonly saving = signal(false);

  protected readonly totalItems = computed(() => this.items().reduce((s, i) => s + i.quantity, 0));
  protected readonly totalAmount = computed(() =>
    this.items().reduce((s, i) => s + i.price * i.quantity, 0),
  );

  ngOnInit(): void {
    this.breadcrumb.set([
      { label: "Commandes", routerLink: "/backoffice/shop/orders" },
      { label: "Nouvelle" },
    ]);
  }

  protected addItem(): void {
    const product = this.selectedProduct();
    if (!product) return;

    this.items.update(items => {
      const existing = items.find(i => i.productId === product.id);
      if (existing) {
        return items.map(i =>
          i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [
        ...items,
        { productId: product.id, name: product.name, price: product.price, quantity: 1 },
      ];
    });
    this.selectedProduct.set(null);
  }

  protected updateItemQty(index: number, quantity: number): void {
    if (quantity < 1) return;
    this.items.update(items =>
      items.map((item, i) => (i === index ? { ...item, quantity } : item)),
    );
  }

  protected removeItem(index: number): void {
    this.items.update(items => items.filter((_, i) => i !== index));
  }

  protected createOrder(): void {
    const orderItems = this.items().map(i => ({ product: i.productId, quantity: i.quantity }));
    const note = this.note() || undefined;

    this.saving.set(true);
    this.orderService.checkout(orderItems, note).subscribe({
      next: () => {
        this.toast.success("Commande créée");
        this.router.navigate(["/backoffice/shop/orders"]);
      },
      error: err => {
        this.toast.error(extractErrorMessage(err));
        this.saving.set(false);
      },
    });
  }
}
