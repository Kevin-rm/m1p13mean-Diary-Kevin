import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  untracked,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { injectQuery } from "@tanstack/angular-query-experimental";
import { TableModule } from "primeng/table";
import { AppTag } from "@shared/components/app-tag";
import { FullNamePipe } from "@shared/pipes/full-name";
import { NoValuePipe } from "@shared/pipes/no-value";
import { BreadcrumbService } from "@backoffice/layout/breadcrumb.service";
import { RecordPage } from "@backoffice/components/record-page";
import { Toast } from "@core/utils/toast";
import { StockMovementService } from "@core/domains/catalog/stock-movement/stock-movement.service";
import { MOVEMENT_TYPE_TAG } from "@core/domains/catalog/stock-movement/stock-movement.model";

@Component({
  selector: "app-stock-movement-record",
  imports: [DatePipe, TableModule, AppTag, FullNamePipe, NoValuePipe, RecordPage],
  templateUrl: "./stock-movement-record.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StockMovementRecord implements OnInit {
  private readonly stockMovementService = inject(StockMovementService);
  private readonly breadcrumb = inject(BreadcrumbService);
  private readonly toast = inject(Toast);
  private readonly router = inject(Router);
  private readonly movementId = inject(ActivatedRoute).snapshot.params["id"];

  private readonly movementQuery = injectQuery(() =>
    this.stockMovementService.getByIdQueryOptions(this.movementId),
  );

  protected readonly movement = computed(() => this.movementQuery.data()?.data ?? null);
  protected readonly loading = computed(() => this.movementQuery.isPending());
  protected readonly movementTypeTag = MOVEMENT_TYPE_TAG;

  constructor() {
    effect(() => {
      if (this.movementQuery.isError()) {
        untracked(() => {
          this.toast.error("Mouvement introuvable");
          this.router.navigate(["/backoffice/shop/stock-movements"]);
        });
      }
    });
  }

  ngOnInit(): void {
    this.breadcrumb.set([
      { label: "Mouvements de stock", routerLink: "/backoffice/shop/stock-movements" },
      { label: "Détail" },
    ]);
  }
}
