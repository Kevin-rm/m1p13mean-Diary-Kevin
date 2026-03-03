import { ScheduleSlot } from "./shop.model";

export const DAYS = [
  { value: "monday", label: "Lundi" },
  { value: "tuesday", label: "Mardi" },
  { value: "wednesday", label: "Mercredi" },
  { value: "thursday", label: "Jeudi" },
  { value: "friday", label: "Vendredi" },
  { value: "saturday", label: "Samedi" },
  { value: "sunday", label: "Dimanche" },
] as const;

export const DAY_INDEX = new Map<string, number>(DAYS.map((d, i) => [d.value, i]));

function dayLabel(value: string): string {
  return DAYS[DAY_INDEX.get(value) ?? 0]?.label ?? value;
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

export function buildScheduleSummary(slots: ScheduleSlot[]): { label: string; time: string }[] {
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
