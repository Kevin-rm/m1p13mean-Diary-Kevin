import { ChangeDetectionStrategy, Component, computed, inject, input } from "@angular/core";
import {
  ReactiveFormsModule,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { injectQuery } from "@tanstack/angular-query-experimental";
import { InputText } from "primeng/inputtext";
import { Textarea } from "primeng/textarea";
import { InputNumber } from "primeng/inputnumber";
import { Select } from "primeng/select";
import { Fluid } from "primeng/fluid";
import { FormField } from "@shared/components/form-field";
import { AriaryPipe } from "@shared/pipes/ariary";
import { SelectOption } from "@core/common/resource.service";
import { CategoryService } from "@core/domains/catalog/category/category.service";

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFormFields {
  private readonly categoryService = inject(CategoryService);

  private readonly categoriesQuery = injectQuery(() => this.categoryService.selectQueryOptions());

  protected readonly categories = computed<SelectOption[]>(
    () => this.categoriesQuery.data()?.data ?? [],
  );

  form = input.required<FormGroup>();
  idPrefix = input("product");
  readonly = input(false);
  categoryNameHint = input("");

  protected get categoryName(): string {
    const id = this.form().controls["category"].value;
    return this.categories().find(c => c.id === id)?.name ?? this.categoryNameHint();
  }

  static createForm(fb: FormBuilder) {
    return fb.nonNullable.group({
      name: ["", Validators.required],
      description: [""],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, Validators.min(0)],
      category: new FormControl<string | null>(null, Validators.required),
    });
  }
}
