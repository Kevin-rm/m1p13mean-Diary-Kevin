import { Component, inject, input } from "@angular/core";
import { Toast } from "@core/utils/toast";
import { InputText } from "primeng/inputtext";
import { Textarea } from "primeng/textarea";
import { InputGroup } from "primeng/inputgroup";
import { InputGroupAddon } from "primeng/inputgroupaddon";
import { FloatLabel } from "primeng/floatlabel";
import { Button } from "primeng/button";
import { NO_VALUE } from "@shared/pipes/no-value";

@Component({
  selector: "app-readonly-field",
  imports: [InputText, Textarea, InputGroup, InputGroupAddon, FloatLabel, Button],
  template: `
    @if (multiline()) {
      <p-floatlabel variant="on">
        <textarea
          pTextarea
          [id]="inputId()"
          [value]="displayValue"
          readonly
          variant="filled"
          rows="3"
          [fluid]="true"
        ></textarea>
        <label [for]="inputId()">{{ label() }}</label>
      </p-floatlabel>
    } @else {
      <p-inputgroup>
        <p-floatlabel variant="on">
          <input pInputText [id]="inputId()" [value]="displayValue" readonly variant="filled" />
          <label [for]="inputId()">{{ label() }}</label>
        </p-floatlabel>
        @if (copyable() && value()) {
          <p-inputgroup-addon>
            <p-button icon="pi pi-copy" [text]="true" severity="secondary" (click)="copy()" />
          </p-inputgroup-addon>
        }
      </p-inputgroup>
    }
  `,
})
export class ReadonlyField {
  private readonly toast = inject(Toast);

  inputId = input.required<string>();
  label = input.required<string>();
  value = input<string | number | null>();
  copyable = input(false);
  multiline = input(false);

  protected get displayValue(): string {
    const val = this.value();
    return val != null && val !== "" ? String(val) : NO_VALUE;
  }

  protected copy(): void {
    const val = this.value();
    if (val != null) {
      navigator.clipboard.writeText(String(val)).then(() => this.toast.info("Copié"));
    }
  }
}
