import { Injectable } from "@angular/core";
import { Creatable, Gettable, Listable, ResourceService } from "@core/common/resource.service";
import { StockMovement } from "./stock-movement.model";

const _Base = Creatable<StockMovement>()(
  Gettable<StockMovement>()(Listable<StockMovement>()(ResourceService)),
);

@Injectable({ providedIn: "root" })
export class StockMovementService extends _Base {
  readonly resourcePath = "stock-movements";
}
