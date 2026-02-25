import { Component, inject, signal, OnInit } from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { CurrencyPipe, DatePipe } from "@angular/common";
import { finalize } from "rxjs";
import { Button } from "primeng/button";
import { ActiveTag } from "@shared/active-tag";
import { Fluid } from "primeng/fluid";
import { ConfirmDialog } from "primeng/confirmdialog";
import { ConfirmationService } from "primeng/api";
import { extractErrorMessage } from "@core/utils/error";
import { Toast } from "@core/utils/toast";
import { CategoryService } from "@backoffice/admin/categories/category.service";
import { Category } from "@backoffice/admin/categories/category.model";
import { ProductFormFields } from "../product-form-fields/product-form-fields";
import { ProductService } from "../product.service";
import { Product } from "../product.model";

@Component({
  selector: "app-shop-product-record",
  imports: [
    ReactiveFormsModule,
    RouterLink,
    CurrencyPipe,
    DatePipe,
    Button,
    ActiveTag,
    Fluid,
    ConfirmDialog,
    ProductFormFields,
  ],
  providers: [ConfirmationService],
  templateUrl: "./product-record.html",
})
export class ShopProductRecord implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly toast = inject(Toast);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly product = signal<Product | null>(null);
  protected readonly loading = signal(true);
  protected readonly editing = signal(false);
  protected readonly saving = signal(false);
  protected categories: Category[] = [];

  protected readonly form = this.fb.nonNullable.group({
    name: ["", Validators.required],
    description: [""],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, Validators.min(0)],
    category: ["", Validators.required],
  });

  private get productId(): string {
    return this.route.snapshot.params["id"];
  }

  ngOnInit(): void {
    this.loadProduct();
    this.categoryService.list({ isActive: true, limit: 100 }).subscribe({
      next: response => {
        this.categories = response.data ?? [];
      },
    });
  }

  protected startEditing(): void {
    const p = this.product();
    if (!p) return;

    this.form.patchValue({
      name: p.name,
      description: p.description ?? "",
      price: p.price,
      stock: p.stock,
      category: p.category?.id ?? "",
    });
    this.editing.set(true);
  }

  protected cancelEditing(): void {
    this.editing.set(false);
    this.form.reset();
  }

  protected saveProduct(): void {
    if (this.form.invalid) return;

    this.saving.set(true);
    const data = this.form.getRawValue();

    this.productService
      .update(this.productId, data)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: response => {
          this.toast.success(response.message);
          this.product.set(response.data ?? null);
          this.editing.set(false);
        },
        error: error => {
          this.toast.error(extractErrorMessage(error));
        },
      });
  }

  protected toggleActive(): void {
    this.productService.toggleActive(this.productId).subscribe({
      next: response => {
        this.toast.success(response.message);
        this.product.set(response.data ?? null);
      },
      error: error => {
        this.toast.error(extractErrorMessage(error, "Impossible de modifier le statut"));
      },
    });
  }

  protected confirmRemoveImage(imageUrl: string): void {
    this.confirmationService.confirm({
      message: "Voulez-vous vraiment supprimer cette image ?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Supprimer",
      rejectLabel: "Annuler",
      acceptButtonStyleClass: "p-button-danger",
      accept: () => this.removeImage(imageUrl),
    });
  }

  private removeImage(imageUrl: string): void {
    this.productService.removeImage(this.productId, imageUrl).subscribe({
      next: response => {
        this.toast.success(response.message);
        this.product.set(response.data ?? null);
      },
      error: error => {
        this.toast.error(extractErrorMessage(error, "Impossible de supprimer l'image"));
      },
    });
  }

  private loadProduct(): void {
    this.loading.set(true);
    this.productService
      .getById(this.productId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: response => {
          this.product.set(response.data ?? null);
        },
        error: () => {
          this.toast.error("Produit introuvable");
          this.router.navigate(["/backoffice/shop/products"]);
        },
      });
  }
}
