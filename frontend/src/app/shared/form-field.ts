import { Component, input } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { FloatLabel } from "primeng/floatlabel";

@Component({
  selector: "app-form-field",
  imports: [FloatLabel],
  template: `
    <div>
      <p-floatlabel variant="on">
        <ng-content />
        <label [for]="inputId()">{{ label() }}</label>
      </p-floatlabel>
      @for (error of visibleErrors; track error.key) {
        <small class="text-red-500">{{ error.message }}</small>
      }
    </div>
  `,
})
export class FormField {
  inputId = input.required<string>();
  label = input.required<string>();
  control = input.required<AbstractControl>();
  errors = input<Record<string, string>>({});

  protected get visibleErrors() {
    const ctrl = this.control();
    if (!ctrl.touched || !ctrl.errors) return [];
    return Object.entries(this.errors())
      .filter(([key]) => ctrl.hasError(key))
      .map(([key, message]) => ({ key, message }))
      .slice(0, 1);
  }
}
