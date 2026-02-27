import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";
import { Tag } from "primeng/tag";

export interface StatusConfig {
  label: string;
  severity: "success" | "info" | "warn" | "danger" | "secondary" | "contrast";
}

@Component({
  selector: "app-status-tag",
  imports: [Tag],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p-tag [value]="label()" [severity]="severity()" />`,
})
export class StatusTag {
  readonly status = input.required<string>();
  readonly config = input.required<Record<string, StatusConfig>>();

  protected readonly label = computed(() => this.config()[this.status()]?.label ?? this.status());
  protected readonly severity = computed(() => this.config()[this.status()]?.severity ?? "info");
}
