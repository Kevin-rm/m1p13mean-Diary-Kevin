import { ChangeDetectionStrategy, Component, inject, OnInit } from "@angular/core";
import { BreadcrumbService } from "@backoffice/layout/breadcrumb.service";
import { PageHeader } from "@backoffice/layout/page-header";

@Component({
  selector: "app-shop-members",
  imports: [PageHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-header title="Membres" />
    <p class="text-muted-color">Bientôt disponible</p>
  `,
})
export class ShopMembers implements OnInit {
  private readonly breadcrumb = inject(BreadcrumbService);

  ngOnInit(): void {
    this.breadcrumb.set([{ label: "Membres" }]);
  }
}
