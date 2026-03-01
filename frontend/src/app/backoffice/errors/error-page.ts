import { ChangeDetectionStrategy, Component, inject, input, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Button } from "primeng/button";
import { BreadcrumbService } from "@backoffice/layout/breadcrumb.service";

@Component({
  selector: "app-error-page",
  host: { class: "block h-full" },
  imports: [RouterLink, Button],
  template: `
    <div class="flex flex-col items-center justify-center gap-4 h-full">
      <i [class]="icon() + ' !text-5xl text-surface-400'"></i>
      <h1 class="text-2xl font-semibold m-0">{{ title() }}</h1>
      <p class="text-surface-500 m-0">{{ message() }}</p>
      <p-button label="Retour à l'accueil" icon="pi pi-arrow-left" routerLink="/backoffice" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorPage implements OnInit {
  private readonly breadcrumb = inject(BreadcrumbService);

  icon = input("pi pi-exclamation-triangle");
  title = input("Erreur");
  message = input("Une erreur est survenue.");

  ngOnInit(): void {
    this.breadcrumb.set([{ label: this.title() }]);
  }
}
