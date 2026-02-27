import { ChangeDetectionStrategy, Component, input, output, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DatePicker } from "primeng/datepicker";
import { Select } from "primeng/select";
import { Button } from "primeng/button";
import { ScheduleSlot } from "@core/domains/shop/shop.model";

const DAYS = [
  { value: "monday", label: "Lundi" },
  { value: "tuesday", label: "Mardi" },
  { value: "wednesday", label: "Mercredi" },
  { value: "thursday", label: "Jeudi" },
  { value: "friday", label: "Vendredi" },
  { value: "saturday", label: "Samedi" },
  { value: "sunday", label: "Dimanche" },
];

const MAX_SLOTS = DAYS.length;
const DEFAULT_OPEN = "08:00";
const DEFAULT_CLOSE = "18:00";

interface ScheduleRow {
  day: string;
  openTime: Date | null;
  closeTime: Date | null;
}

function timeToDate(time: string): Date {
  const [h, m] = time.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

function dateToTime(date: Date | null): string {
  if (!date) return "";
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

@Component({
  selector: "app-schedule-editor",
  imports: [FormsModule, DatePicker, Select, Button],
  template: `
    <div class="flex flex-col gap-4">
      @for (row of rows(); track $index) {
        <div class="flex items-center gap-3 flex-wrap">
          <p-select
            [options]="availableDays(row.day)"
            [(ngModel)]="row.day"
            optionLabel="label"
            optionValue="value"
            placeholder="Jour"
            class="w-40"
          />
          <p-datepicker
            [(ngModel)]="row.openTime"
            [timeOnly]="true"
            placeholder="Ouverture"
            class="w-32"
          />
          <span class="text-muted-color">—</span>
          <p-datepicker
            [(ngModel)]="row.closeTime"
            [timeOnly]="true"
            placeholder="Fermeture"
            class="w-32"
          />
          <p-button
            icon="pi pi-trash"
            severity="danger"
            [text]="true"
            [rounded]="true"
            (click)="removeRow($index)"
          />
        </div>
      }

      <div class="flex gap-2">
        @if (rows().length < maxSlots) {
          <p-button
            label="Ajouter un créneau"
            icon="pi pi-plus"
            severity="secondary"
            [outlined]="true"
            (click)="addRow()"
          />
        }
        <p-button label="Enregistrer" icon="pi pi-check" (click)="onSave()" />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleEditor {
  protected readonly days = DAYS;
  protected readonly maxSlots = MAX_SLOTS;
  protected readonly rows = signal<ScheduleRow[]>([]);

  schedule = input<ScheduleSlot[]>([]);
  save = output<ScheduleSlot[]>();

  ngOnChanges(): void {
    this.rows.set(
      this.schedule().map(s => ({
        day: s.day,
        openTime: timeToDate(s.openTime),
        closeTime: timeToDate(s.closeTime),
      })),
    );
  }

  protected availableDays(currentDay: string) {
    const usedDays = new Set(this.rows().map(r => r.day));
    return DAYS.filter(d => d.value === currentDay || !usedDays.has(d.value));
  }

  private get nextAvailableDay(): string {
    const usedDays = new Set(this.rows().map(r => r.day));
    return DAYS.find(d => !usedDays.has(d.value))?.value ?? "monday";
  }

  protected addRow(): void {
    if (this.rows().length >= MAX_SLOTS) return;
    this.rows.update(r => [
      ...r,
      {
        day: this.nextAvailableDay,
        openTime: timeToDate(DEFAULT_OPEN),
        closeTime: timeToDate(DEFAULT_CLOSE),
      },
    ]);
  }

  protected removeRow(index: number): void {
    this.rows.update(r => r.filter((_, i) => i !== index));
  }

  protected onSave(): void {
    const slots: ScheduleSlot[] = this.rows()
      .filter(r => r.day && r.openTime && r.closeTime)
      .map(r => ({
        day: r.day,
        openTime: dateToTime(r.openTime),
        closeTime: dateToTime(r.closeTime),
      }));
    this.save.emit(slots);
  }
}
