import { Component, inject, OnInit } from "@angular/core";
import { BreadcrumbService } from "@backoffice/layout/breadcrumb.service";
import { PageHeader } from "@backoffice/layout/page-header";

@Component({
  selector: "app-shop-order-form",
  imports: [PageHeader],
  template: `
    <app-page-header title="Nouvelle commande" [back]="true" />
    <p class="text-muted-color">Bientôt disponible</p>
  `,
})
export class ShopOrderForm implements OnInit {
  private readonly breadcrumb = inject(BreadcrumbService);

  ngOnInit(): void {
    this.breadcrumb.set([
      { label: "Commandes", routerLink: "/backoffice/shop/orders" },
      { label: "Nouvelle" },
    ]);
  }
}
