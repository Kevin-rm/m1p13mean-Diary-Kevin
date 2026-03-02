import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  input,
  output,
  TemplateRef,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import { Button } from "primeng/button";
import { Fieldset } from "primeng/fieldset";

@Component({
  selector: "app-form-repeater",
  imports: [NgTemplateOutlet, Button, Fieldset],
  template: `
    <p-fieldset>
      <ng-template #header>
        <div class="flex items-center gap-2">
          <span class="font-bold">{{ legend() }}</span>
          <p-button
            [label]="addLabel()"
            icon="pi pi-plus"
            [text]="true"
            size="small"
            (onClick)="add.emit()"
          />
        </div>
      </ng-template>

      <div class="flex flex-col gap-4">
        @for (i of indices(); track i) {
          <div class="grid grid-cols-[1fr_auto] items-start gap-3">
            <ng-container *ngTemplateOutlet="lineTemplate(); context: { $implicit: i }" />
            <p-button
              icon="pi pi-trash"
              [text]="true"
              [rounded]="true"
              severity="danger"
              (onClick)="remove.emit(i)"
              class="self-center"
            />
          </div>
        }

        @if (count() === 0) {
          <p class="text-muted-color text-center py-6 m-0">{{ emptyMessage() }}</p>
        }
      </div>
    </p-fieldset>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormRepeater {
  protected readonly indices = computed(() => Array.from({ length: this.count() }, (_, i) => i));

  readonly legend = input.required<string>();
  readonly count = input.required<number>();
  readonly addLabel = input("Ajouter");
  readonly emptyMessage = input("Ajoutez au moins une ligne");

  readonly add = output<void>();
  readonly remove = output<number>();

  readonly lineTemplate = contentChild.required(TemplateRef);
}
