import { ChangeDetectionStrategy, Component, inject, ViewChild, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ReactiveFormsModule, FormBuilder } from "@angular/forms";
import { NgTemplateOutlet } from "@angular/common";
import { lastValueFrom } from "rxjs";
import { injectMutation } from "@tanstack/angular-query-experimental";
import { Button } from "primeng/button";
import { Card } from "primeng/card";
import { ImageUpload } from "@shared/components/image-upload";
import { extractErrorMessage } from "@core/utils/error";
import { Toast } from "@core/utils/toast";
import { BreadcrumbService } from "@backoffice/layout/breadcrumb.service";
import { PageHeader } from "@backoffice/components/page-header";
import { ProductFormFields } from "../product-form-fields/product-form-fields";
import { ProductService } from "@core/domains/catalog/product/product.service";

@Component({
  selector: "app-shop-product-form",
  imports: [
    ReactiveFormsModule,
    NgTemplateOutlet,
    Button,
    Card,
    ImageUpload,
    PageHeader,
    ProductFormFields,
  ],
  templateUrl: "./product-form.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopProductForm implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly breadcrumb = inject(BreadcrumbService);
  private readonly toast = inject(Toast);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  @ViewChild("fileUpload") private fileUpload!: ImageUpload;

  protected readonly createMutation = injectMutation(() => ({
    mutationFn: (formData: FormData) => lastValueFrom(this.productService.create(formData)),
    onSuccess: (response: { message: string }) => {
      this.toast.success(response.message);
      this.router.navigate(["/backoffice/shop/products"]);
    },
    onError: error => {
      this.toast.error(extractErrorMessage(error));
    },
  }));

  protected readonly form = ProductFormFields.createForm(this.fb);

  ngOnInit(): void {
    this.breadcrumb.set([
      { label: "Produits", routerLink: "/backoffice/shop/products" },
      { label: "Nouveau" },
    ]);
  }

  protected resetForm(): void {
    this.form.reset();
    this.fileUpload?.clear();
  }

  protected submit(): void {
    if (this.form.invalid) return;

    const values = this.form.getRawValue();

    const formData = new FormData();
    formData.append("name", values.name);
    if (values.description) formData.append("description", values.description);
    formData.append("price", String(values.price));
    formData.append("stock", String(values.stock));
    formData.append("category", values.category!);

    for (const file of this.fileUpload?.files ?? []) {
      formData.append("images", file);
    }

    this.createMutation.mutate(formData);
  }
}
