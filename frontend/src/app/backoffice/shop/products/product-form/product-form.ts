import { Component, inject, signal, OnInit } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { finalize } from "rxjs";
import { Button } from "primeng/button";
import { Fluid } from "primeng/fluid";
import { extractErrorMessage } from "@core/utils/error";
import { Toast } from "@core/utils/toast";
import { CategoryService } from "@backoffice/admin/categories/category.service";
import { Category } from "@backoffice/admin/categories/category.model";
import { ProductFormFields } from "../product-form-fields/product-form-fields";
import { ProductService } from "../product.service";

@Component({
  selector: "app-shop-product-form",
  imports: [ReactiveFormsModule, RouterLink, Button, Fluid, ProductFormFields],
  templateUrl: "./product-form.html",
})
export class ShopProductForm implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly toast = inject(Toast);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  protected readonly saving = signal(false);
  protected categories: Category[] = [];
  protected selectedFiles: File[] = [];
  protected previews: string[] = [];

  protected readonly form = this.fb.nonNullable.group({
    name: ["", Validators.required],
    description: [""],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, Validators.min(0)],
    category: ["", Validators.required],
  });

  ngOnInit(): void {
    this.categoryService.list({ isActive: true, limit: 100 }).subscribe({
      next: response => {
        this.categories = response.data ?? [];
      },
    });
  }

  protected onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const newFiles = Array.from(input.files);
    const totalFiles = this.selectedFiles.length + newFiles.length;

    if (totalFiles > 5) {
      this.toast.error("Maximum 5 images autorisées");
      return;
    }

    this.selectedFiles.push(...newFiles);
    for (const file of newFiles) {
      const reader = new FileReader();
      reader.onload = () => this.previews.push(reader.result as string);
      reader.readAsDataURL(file);
    }

    input.value = "";
  }

  protected removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.previews.splice(index, 1);
  }

  protected submit(): void {
    if (this.form.invalid) return;

    this.saving.set(true);
    const values = this.form.getRawValue();

    const formData = new FormData();
    formData.append("name", values.name);
    if (values.description) formData.append("description", values.description);
    formData.append("price", String(values.price));
    formData.append("stock", String(values.stock));
    formData.append("category", values.category);

    for (const file of this.selectedFiles) {
      formData.append("images", file);
    }

    this.productService
      .create(formData)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: response => {
          this.toast.success(response.message);
          this.router.navigate(["/backoffice/shop/products"]);
        },
        error: error => {
          this.toast.error(extractErrorMessage(error));
        },
      });
  }
}
