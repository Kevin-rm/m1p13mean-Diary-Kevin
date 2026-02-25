import { Component, computed, input } from "@angular/core";

@Component({
  selector: "app-contact-link",
  template: `
    @if (value()) {
      <a [href]="href()" class="text-primary hover:underline">
        {{ value() }}
      </a>
    } @else {
      <span class="text-muted-color">—</span>
    }
  `,
})
export class ContactLink {
  protected readonly href = computed(() => {
    const prefix = this.type() === "email" ? "mailto" : "tel";
    return `${prefix}:${this.value()}`;
  });

  type = input.required<"email" | "phone">();
  value = input<string>();
}
