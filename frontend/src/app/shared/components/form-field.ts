import { ChangeDetectionStrategy, Component, input, TemplateRef, viewChild } from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import { AbstractControl } from "@angular/forms";
import { FloatLabel } from "primeng/floatlabel";
import { InputGroup } from "primeng/inputgroup";
import { InputGroupAddon } from "primeng/inputgroupaddon";
import { ReadonlyField } from "./readonly-field";

@Component({
  selector: "app-form-field",
  imports: [NgTemplateOutlet, FloatLabel, InputGroup, InputGroupAddon, ReadonlyField],
  template: `
    <ng-template #inputTpl><ng-content /></ng-template>

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
        <p-inputgroup>
          @if (floatLabel()) {
            <p-floatlabel variant="on">
              <ng-container [ngTemplateOutlet]="inputRef()" />
              <label [for]="inputId()">{{ label() }}</label>
            </p-floatlabel>
          } @else {
            <ng-container [ngTemplateOutlet]="inputRef()" />
          }
          @if (addon()) {
            <p-inputgroup-addon>{{ addon() }}</p-inputgroup-addon>
          }
        </p-inputgroup>
        @for (error of visibleErrors; track error.key) {
          <small class="text-red-500">{{ error.message }}</small>
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormField {
  protected readonly inputRef = viewChild.required<TemplateRef<unknown>>("inputTpl");

  inputId = input.required<string>();
  label = input.required<string>();
  control = input.required<AbstractControl>();
  errors = input<Record<string, string>>({});
  readonly = input(false);
  displayValue = input<string | number | null>();
  copyable = input(false);
  multiline = input(false);
  addon = input<string>();
  floatLabel = input(true);

  protected get visibleErrors() {
    const ctrl = this.control();
    if (!ctrl.touched || !ctrl.errors) return [];
    return Object.entries(this.errors())
      .filter(([key]) => ctrl.hasError(key))
      .map(([key, message]) => ({ key, message }))
      .slice(0, 1);
  }
}
