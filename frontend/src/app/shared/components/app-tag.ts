import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";
import { Tag } from "primeng/tag";

export interface TagConfig {
  label: string;
  severity: "success" | "info" | "warn" | "danger" | "secondary" | "contrast";
}

@Component({
  selector: "app-tag",
  imports: [Tag],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p-tag [value]="label()" [severity]="severity()" />`,
})
export class AppTag {
  protected readonly label = computed(() => this.config()[this.value()]?.label ?? this.value());
  protected readonly severity = computed(() => this.config()[this.value()]?.severity ?? "info");

  readonly value = input.required<string>();
  readonly config = input.required<Record<string, TagConfig>>();
}
