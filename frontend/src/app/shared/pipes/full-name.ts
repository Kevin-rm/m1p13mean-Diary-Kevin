import { Pipe, PipeTransform } from "@angular/core";
import { NO_VALUE } from "./no-value";

@Pipe({ name: "fullName" })
export class FullNamePipe implements PipeTransform {
  transform(value: { firstName?: string; lastName?: string } | null | undefined): string {
    if (!value) return NO_VALUE;
    return `${value.firstName} ${value.lastName}`.trim() || NO_VALUE;
  }
}
