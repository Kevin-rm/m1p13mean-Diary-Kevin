import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { FloatLabel } from "primeng/floatlabel";
import { ReadonlyField } from "./readonly-field";

@Component({
  selector: "app-form-field",
  imports: [FloatLabel, ReadonlyField],
  template: `
    @if (readonly()) {
      <app-readonly-field
        [inputId]="inputId()"
        [label]="label()"
        [value]="displayValue() ?? control().value"
        [copyable]="copyable()"
        [multiline]="multiline()"
      />
    } @else {
      <div>
        <p-floatlabel variant="on">
          <ng-content />
          <label [for]="inputId()">{{ label() }}</label>
        </p-floatlabel>
        @for (error of visibleErrors; track error.key) {
          <small class="text-red-500">{{ error.message }}</small>
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormField {
  inputId = input.required<string>();
  label = input.required<string>();
  control = input.required<AbstractControl>();
  errors = input<Record<string, string>>({});
  readonly = input(false);
  displayValue = input<string | number | null>();
  copyable = input(false);
  multiline = input(false);

  protected get visibleErrors() {
    const ctrl = this.control();
    if (!ctrl.touched || !ctrl.errors) return [];
    return Object.entries(this.errors())
      .filter(([key]) => ctrl.hasError(key))
      .map(([key, message]) => ({ key, message }))
      .slice(0, 1);
  }
}
