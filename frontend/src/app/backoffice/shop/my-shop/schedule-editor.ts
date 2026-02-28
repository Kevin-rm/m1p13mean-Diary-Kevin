import { ChangeDetectionStrategy, Component, computed, input, signal } from "@angular/core";
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

const DAY_INDEX = new Map(DAYS.map((d, i) => [d.value, i]));
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

function toRow(slot: ScheduleSlot): ScheduleRow {
  return {
    day: slot.day,
    openTime: timeToDate(slot.openTime),
    closeTime: timeToDate(slot.closeTime),
  };
}

function toSlot(row: ScheduleRow): ScheduleSlot {
  return { day: row.day, openTime: dateToTime(row.openTime), closeTime: dateToTime(row.closeTime) };
}

function dayLabel(value: string): string {
  return DAYS[DAY_INDEX.get(value) ?? 0]?.label ?? value;
}

function buildScheduleSummary(slots: ScheduleSlot[]): { label: string; time: string }[] {
  if (slots.length === 0) return [];

  const groups = new Map<string, string[]>();
  for (const slot of slots) {
    const key = `${slot.openTime}|${slot.closeTime}`;
    const days = groups.get(key);
    if (days) {
      days.push(slot.day);
    } else {
      groups.set(key, [slot.day]);
    }
  }

  return Array.from(groups.entries()).map(([key, days]) => {
    const [openTime, closeTime] = key.split("|");
    days.sort((a, b) => (DAY_INDEX.get(a) ?? 0) - (DAY_INDEX.get(b) ?? 0));
    return { label: formatDayRange(days), time: `${openTime} — ${closeTime}` };
  });
}

function formatDayRange(days: string[]): string {
  if (days.length === DAYS.length) return "Tous les jours";

  const ranges = findConsecutiveRanges(days);
  return ranges
    .map(range => {
      if (range.length <= 2) return range.map(dayLabel).join(", ");
      return `Du ${dayLabel(range[0])} au ${dayLabel(range[range.length - 1])}`;
    })
    .join(", ");
}

function findConsecutiveRanges(days: string[]): string[][] {
  const ranges: string[][] = [];
  let current: string[] = [days[0]];

  for (let i = 1; i < days.length; i++) {
    if ((DAY_INDEX.get(days[i]) ?? 0) === (DAY_INDEX.get(days[i - 1]) ?? 0) + 1) {
      current.push(days[i]);
    } else {
      ranges.push(current);
      current = [days[i]];
    }
  }
  ranges.push(current);
  return ranges;
}

@Component({
  selector: "app-schedule-editor",
  imports: [FormsModule, DatePicker, Select, Button],
  template: `
    <div class="flex flex-col gap-4">
      @if (readonly()) {
        @if (scheduleSummary().length === 0) {
          <p class="text-muted-color m-0">Aucun horaire défini</p>
        } @else {
          @for (line of scheduleSummary(); track $index) {
            <div class="flex items-center gap-2">
              <span class="font-medium">{{ line.label }}</span>
              <span class="text-muted-color">{{ line.time }}</span>
            </div>
          }
        }
      } @else {
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

        @if (rows().length < maxSlots) {
          <p-button
            label="Ajouter un créneau"
            icon="pi pi-plus"
            severity="secondary"
            [outlined]="true"
            (click)="addRow()"
          />
        }
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleEditor {
  protected readonly maxSlots = MAX_SLOTS;
  protected readonly rows = signal<ScheduleRow[]>([]);
  protected readonly scheduleSummary = computed(() => buildScheduleSummary(this.schedule()));

  schedule = input<ScheduleSlot[]>([]);
  readonly = input(false);

  ngOnChanges(): void {
    this.rows.set(this.schedule().map(toRow));
  }

  getSchedule(): ScheduleSlot[] {
    return this.rows()
      .filter(r => r.day && r.openTime && r.closeTime)
      .map(toSlot);
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
}
