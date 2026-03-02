import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  untracked,
  ViewChild,
  OnInit,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ReactiveFormsModule, FormBuilder } from "@angular/forms";
import { lastValueFrom } from "rxjs";
import { injectMutation, injectQuery, QueryClient } from "@tanstack/angular-query-experimental";
import { Button } from "primeng/button";
import { ImageSection } from "@backoffice/components/image-section";
import { extractErrorMessage } from "@core/utils/error";
import { Toast } from "@core/utils/toast";
import { BreadcrumbService } from "@backoffice/layout/breadcrumb.service";
import { RecordPage, RecordPageTab } from "@backoffice/components/record-page";
import { ProductFormFields } from "../product-form-fields/product-form-fields";
import { ProductService } from "@core/domains/catalog/product/product.service";
import { Product } from "@core/domains/catalog/product/product.model";
import { ApiResponse } from "@core/common/models/api-response";

@Component({
  selector: "app-shop-product-record",
  imports: [
    ReactiveFormsModule,
    Button,
    ImageSection,
    RecordPage,
    RecordPageTab,
    ProductFormFields,
  ],
  templateUrl: "./product-record.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopProductRecord implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly queryClient = inject(QueryClient);
  private readonly breadcrumb = inject(BreadcrumbService);
  private readonly toast = inject(Toast);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly productId = inject(ActivatedRoute).snapshot.params["id"];
  private readonly queryOpts = this.productService.getByIdQueryOptions(this.productId);

  @ViewChild("imageSection") private imageSection!: ImageSection;

  private readonly productQuery = injectQuery(() => this.queryOpts);

  protected readonly editing = signal(false);
  protected readonly form = ProductFormFields.createForm(this.fb);
  protected readonly product = computed(() => this.productQuery.data()?.data ?? null);
  protected readonly loading = computed(() => this.productQuery.isPending());

  protected readonly saveMutation = injectMutation(() => ({
    mutationFn: (data: object) => lastValueFrom(this.productService.update(this.productId, data)),
    onSuccess: (response: ApiResponse<Product>) => {
      this.toast.success(response.message);
      this.queryClient.setQueryData(this.queryOpts.queryKey, response);
      this.editing.set(false);
    },
    onError: error => {
      this.toast.error(extractErrorMessage(error));
    },
  }));

  protected readonly toggleActiveMutation = injectMutation(() => ({
    mutationFn: (id: string) => lastValueFrom(this.productService.toggleActive(id)),
    onSuccess: (response: ApiResponse<Product>) => {
      this.toast.success(response.message);
      this.queryClient.setQueryData(this.queryOpts.queryKey, response);
    },
    onError: error => {
      this.toast.error(extractErrorMessage(error, "Impossible de modifier le statut"));
    },
  }));

  protected readonly uploadImagesMutation = injectMutation(() => ({
    mutationFn: (files: File[]) =>
      lastValueFrom(this.productService.addImages(this.productId, files)),
    onSuccess: (response: ApiResponse<Product>) => {
      this.toast.success(response.message);
      this.queryClient.setQueryData(this.queryOpts.queryKey, response);
      this.imageSection.imageUpload.clear();
    },
    onError: error => {
      this.toast.error(extractErrorMessage(error, "Impossible d'ajouter les images"));
    },
  }));

  protected readonly removeImageMutation = injectMutation(() => ({
    mutationFn: (imageUrl: string) =>
      lastValueFrom(this.productService.removeImage(this.productId, imageUrl)),
    onSuccess: (response: ApiResponse<Product>) => {
      this.toast.success(response.message);
      this.queryClient.setQueryData(this.queryOpts.queryKey, response);
    },
    onError: error => {
      this.toast.error(extractErrorMessage(error, "Impossible de supprimer l'image"));
    },
  }));

  constructor() {
    effect(() => {
      const p = this.product();
      if (p && !this.editing()) {
        untracked(() => this.patchForm());
      }
    });

    effect(() => {
      if (this.productQuery.isError()) {
        untracked(() => {
          this.toast.error("Produit introuvable");
          this.router.navigate(["/backoffice/shop/products"]);
        });
      }
    });
  }

  ngOnInit(): void {
    this.breadcrumb.set([
      { label: "Produits", routerLink: "/backoffice/shop/products" },
      { label: "Détail" },
    ]);
  }

  protected startEditing(): void {
    this.editing.set(true);
  }

  protected cancelEditing(): void {
    this.editing.set(false);
  }

  protected saveProduct(): void {
    if (this.form.invalid) return;
    this.saveMutation.mutate(this.form.getRawValue());
  }

  protected toggleActive(): void {
    this.toggleActiveMutation.mutate(this.productId);
  }

  protected uploadImages(files: File[]): void {
    this.uploadImagesMutation.mutate(files);
  }

  protected removeImage(imageUrl: string): void {
    this.removeImageMutation.mutate(imageUrl);
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
}
