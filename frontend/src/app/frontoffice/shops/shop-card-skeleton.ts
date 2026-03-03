import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Skeleton } from "primeng/skeleton";

@Component({
  selector: "app-shop-card-skeleton",
  imports: [Skeleton],
  template: `
    <div class="bg-surface-0 rounded-2xl overflow-hidden shadow-sm">
      <p-skeleton width="100%" height="11rem" borderRadius="0" />
      <div class="p-4">
        <p-skeleton width="60%" height="1.25rem" />
        <div class="flex flex-col gap-1.5 mt-3">
          <p-skeleton width="100%" height="0.875rem" />
          <p-skeleton width="90%" height="0.875rem" />
          <p-skeleton width="40%" height="0.875rem" />
        </div>
        <div class="flex gap-2 mt-3">
          <p-skeleton width="6rem" height="1.5rem" borderRadius="9999px" />
          <p-skeleton width="5rem" height="1.5rem" borderRadius="9999px" />
        </div>
        <div class="flex items-center justify-between mt-3 pt-3 border-t border-surface">
          <p-skeleton width="8rem" height="1rem" />
          <p-skeleton width="4rem" height="1rem" />
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopCardSkeleton {}
