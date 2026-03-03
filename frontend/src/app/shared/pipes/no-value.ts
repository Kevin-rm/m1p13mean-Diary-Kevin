import { Pipe, PipeTransform } from "@angular/core";

export const NO_VALUE = "—";

@Pipe({ name: "noValue" })
export class NoValuePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    return value || NO_VALUE;
  }
}
