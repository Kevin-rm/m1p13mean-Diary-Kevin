import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ErrorPage } from "./error-page";

@Component({
  selector: "app-forbidden",
  imports: [ErrorPage],
  template: `
    <app-error-page
      icon="pi pi-lock"
      title="Accès refusé"
      message="Vous n'avez pas les permissions nécessaires pour accéder à cette page."
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Forbidden {}
