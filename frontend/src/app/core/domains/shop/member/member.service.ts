import { Injectable } from "@angular/core";
import { Editable, Listable, ResourceService } from "@core/common/resource.service";
import { Member } from "./member.model";

const _Base = Editable<Member>()(Listable<Member>()(ResourceService));

@Injectable({ providedIn: "root" })
export class MemberService extends _Base {
  readonly resourcePath = "shops/me/members";
}
