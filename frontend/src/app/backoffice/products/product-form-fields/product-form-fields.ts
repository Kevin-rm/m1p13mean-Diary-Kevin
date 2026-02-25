import { Component, input } from "@angular/core";
import { ReactiveFormsModule, FormGroup } from "@angular/forms";
import { InputText } from "primeng/inputtext";
import { Textarea } from "primeng/textarea";
import { InputNumber } from "primeng/inputnumber";
import { Select } from "primeng/select";
import { FormField } from "@shared/form-field";
import { Category } from "@backoffice/categories/category.model";

@Component({
  selector: "app-product-form-fields",
  imports: [ReactiveFormsModule, InputText, Textarea, InputNumber, Select, FormField],
  templateUrl: "./product-form-fields.html",
})
export class ProductFormFields {
  form = input.required<FormGroup>();
  categories = input.required<Category[]>();
  idPrefix = input("product");
}
