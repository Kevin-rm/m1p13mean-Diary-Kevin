import { Pipe, PipeTransform } from "@angular/core";

export function initials(
  value: { firstName?: string; lastName?: string } | null | undefined,
): string {
  if (!value?.firstName || !value?.lastName) return "";
  return (value.firstName[0] + value.lastName[0]).toUpperCase();
}

@Pipe({ name: "initials" })
export class InitialsPipe implements PipeTransform {
  transform = initials;
}
