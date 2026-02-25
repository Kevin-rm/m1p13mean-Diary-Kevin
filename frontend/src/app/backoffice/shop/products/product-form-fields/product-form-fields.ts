import { Component, input } from "@angular/core";
import { ReactiveFormsModule, FormGroup } from "@angular/forms";
import { InputText } from "primeng/inputtext";
import { Textarea } from "primeng/textarea";
import { InputNumber } from "primeng/inputnumber";
import { Select } from "primeng/select";
import { Fluid } from "primeng/fluid";
import { FormField } from "@shared/components/form-field";
import { AriaryPipe } from "@shared/pipes/ariary";
import { Category } from "@backoffice/admin/categories/category.model";

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
export class ProductFormFields {
  form = input.required<FormGroup>();
  categories = input.required<Category[]>();
  idPrefix = input("product");
  readonly = input(false);

  protected get categoryName(): string {
    const id = this.form().controls["category"].value;
    return this.categories().find(c => c.id === id)?.name ?? "";
  }
}
