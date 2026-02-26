import { Component, inject, OnInit } from "@angular/core";
import { BreadcrumbService } from "@backoffice/layout/breadcrumb.service";
import { PageHeader } from "@backoffice/layout/page-header";

@Component({
  selector: "app-shop-dashboard",
  imports: [PageHeader],
  template: `
    <app-page-header title="Tableau de bord" />
    <p class="text-muted-color">Bientôt disponible</p>
  `,
})
export class ShopDashboard implements OnInit {
  private readonly breadcrumb = inject(BreadcrumbService);

  ngOnInit(): void {
    this.breadcrumb.set([{ label: "Tableau de bord" }]);
  }
}
