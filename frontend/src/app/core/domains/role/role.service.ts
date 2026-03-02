import { Injectable } from "@angular/core";
import { ResourceService, Selectable } from "@core/common/resource.service";

const _Base = Selectable()(ResourceService);

@Injectable({ providedIn: "root" })
export class RoleService extends _Base {
  readonly resourcePath = "roles";
}
