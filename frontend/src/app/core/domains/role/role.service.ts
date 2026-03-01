import { Injectable } from "@angular/core";
import { ResourceService, SelectOption } from "@core/common/resource.service";

@Injectable({ providedIn: "root" })
export class RoleService extends ResourceService<SelectOption> {
  readonly resourcePath = "roles";
}
