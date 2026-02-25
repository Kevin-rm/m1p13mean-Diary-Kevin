import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "ariary" })
export class AriaryPipe implements PipeTransform {
  transform(value: number | string | null | undefined): string | null {
    if (value == null) return null;
    return `${Number(value).toLocaleString("fr-FR", { maximumFractionDigits: 0 })} Ar`;
  }
}
