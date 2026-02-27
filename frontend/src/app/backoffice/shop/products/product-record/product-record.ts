import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
  ViewChild,
  OnInit,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ActivatedRoute, Router } from "@angular/router";
import { ReactiveFormsModule, FormBuilder } from "@angular/forms";
import { finalize } from "rxjs";
import { Button } from "primeng/button";
import { ConfirmDialog } from "primeng/confirmdialog";
import { ConfirmationService } from "primeng/api";
import { Image } from "primeng/image";
import { ImageUpload } from "@shared/components/image-upload";
import { extractErrorMessage } from "@core/utils/error";
import { Toast } from "@core/utils/toast";
import { BreadcrumbService } from "@backoffice/layout/breadcrumb.service";
import { RecordPage, RecordPageTab } from "@backoffice/layout/record-page";
import { ProductFormFields } from "../product-form-fields/product-form-fields";
import { ProductService } from "../product.service";
import { Product } from "../product.model";

@Component({
  selector: "app-shop-product-record",
  imports: [
    ReactiveFormsModule,
    Button,
    ConfirmDialog,
    Image,
    ImageUpload,
    RecordPage,
    RecordPageTab,
    ProductFormFields,
  ],
  providers: [ConfirmationService],
  templateUrl: "./product-record.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopProductRecord implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly breadcrumb = inject(BreadcrumbService);
  private readonly toast = inject(Toast);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild("imageUpload") private imageUpload!: ImageUpload;

  protected readonly product = signal<Product | null>(null);
  protected readonly loading = signal(true);
  protected readonly editing = signal(false);
  protected readonly saving = signal(false);
  protected readonly uploading = signal(false);
  protected readonly form = ProductFormFields.createForm(this.fb);

  private get productId(): string {
    return this.route.snapshot.params["id"];
  }

  ngOnInit(): void {
    this.breadcrumb.set([
      { label: "Produits", routerLink: "/backoffice/shop/products" },
      { label: "Détail" },
    ]);
    this.loadProduct();
  }

  protected startEditing(): void {
    this.editing.set(true);
  }

  protected cancelEditing(): void {
    this.patchForm();
    this.editing.set(false);
  }

  protected saveProduct(): void {
    if (this.form.invalid) return;

    this.saving.set(true);
    const data = this.form.getRawValue();

    this.productService
      .update(this.productId, data)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.saving.set(false)),
      )
      .subscribe({
        next: response => {
          this.toast.success(response.message);
          this.product.set(response.data ?? null);
          this.patchForm();
          this.editing.set(false);
        },
        error: error => {
          this.toast.error(extractErrorMessage(error));
        },
      });
  }

  protected toggleActive(): void {
    this.productService
      .toggleActive(this.productId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => {
          this.toast.success(response.message);
          this.product.set(response.data ?? null);
        },
        error: error => {
          this.toast.error(extractErrorMessage(error, "Impossible de modifier le statut"));
        },
      });
  }

  protected uploadImages(files: File[]): void {
    this.uploading.set(true);
    this.productService
      .addImages(this.productId, files)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.uploading.set(false)),
      )
      .subscribe({
        next: response => {
          this.toast.success(response.message);
          this.product.set(response.data ?? null);
          this.imageUpload.clear();
        },
        error: error => {
          this.toast.error(extractErrorMessage(error, "Impossible d'ajouter les images"));
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

  private patchForm(): void {
    const p = this.product();
    if (!p) return;

    this.form.patchValue({
      name: p.name,
      description: p.description ?? "",
      price: p.price,
      stock: p.stock,
      category: p.category?.id ?? "",
    });
  }

  private removeImage(imageUrl: string): void {
    this.productService
      .removeImage(this.productId, imageUrl)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
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
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: response => {
          this.product.set(response.data ?? null);
          this.patchForm();
        },
        error: () => {
          this.toast.error("Produit introuvable");
          this.router.navigate(["/backoffice/shop/products"]);
        },
      });
  }
}
