import { ChangeDetectionStrategy, Component, inject, OnInit } from "@angular/core";
import { BreadcrumbService } from "@backoffice/layout/breadcrumb.service";
import { PageHeader } from "@backoffice/components/page-header";

@Component({
  selector: "app-shop-orders",
  imports: [PageHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-header title="Commandes" />
    <p class="text-muted-color">Bientôt disponible</p>
  `,
})
export class ShopOrders implements OnInit {
  private readonly breadcrumb = inject(BreadcrumbService);

  ngOnInit(): void {
    this.breadcrumb.set([{ label: "Commandes" }]);
  }
}
