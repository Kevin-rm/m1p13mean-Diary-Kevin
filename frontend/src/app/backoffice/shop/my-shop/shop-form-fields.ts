import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { ReactiveFormsModule, FormBuilder, FormGroup } from "@angular/forms";
import { InputText } from "primeng/inputtext";
import { Textarea } from "primeng/textarea";
import { Fluid } from "primeng/fluid";
import { FormField } from "@shared/components/form-field";

@Component({
  selector: "app-shop-form-fields",
  imports: [ReactiveFormsModule, InputText, Textarea, Fluid, FormField],
  templateUrl: "./shop-form-fields.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopFormFields {
  form = input.required<FormGroup>();
  idPrefix = input("shop");
  readonly = input(false);

  static createForm(fb: FormBuilder) {
    return fb.nonNullable.group({
      description: [""],
      contactEmail: [""],
      contactPhone: [""],
    });
  }
}
