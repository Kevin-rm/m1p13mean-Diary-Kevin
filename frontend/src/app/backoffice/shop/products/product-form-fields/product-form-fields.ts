import { Component, inject, input, OnInit } from "@angular/core";
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { InputText } from "primeng/inputtext";
import { Textarea } from "primeng/textarea";
import { InputNumber } from "primeng/inputnumber";
import { Select } from "primeng/select";
import { Fluid } from "primeng/fluid";
import { FormField } from "@shared/components/form-field";
import { AriaryPipe } from "@shared/pipes/ariary";
import { SelectOption } from "@core/models/select-option";
import { CategoryService } from "@backoffice/admin/categories/category.service";

@Component({
  selector: "app-product-form-fields",
  imports: [
    ReactiveFormsModule,
    InputText,
    Textarea,
    InputNumber,
    Select,
    Fluid,
    FormField,
    AriaryPipe,
  ],
  templateUrl: "./product-form-fields.html",
})
export class ProductFormFields implements OnInit {
  private readonly categoryService = inject(CategoryService);

  form = input.required<FormGroup>();
  idPrefix = input("product");
  readonly = input(false);
  categoryNameHint = input("");

  protected categories: SelectOption[] = [];

  ngOnInit(): void {
    this.categoryService.listForSelect().subscribe({
      next: response => {
        this.categories = response.data ?? [];
      },
    });
  }

  protected get categoryName(): string {
    const id = this.form().controls["category"].value;
    return this.categories.find(c => c.id === id)?.name ?? this.categoryNameHint();
  }

  static createForm(fb: FormBuilder) {
    return fb.nonNullable.group({
      name: ["", Validators.required],
      description: [""],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, Validators.min(0)],
      category: ["", Validators.required],
    });
  }
}
