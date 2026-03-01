import { Injectable } from "@angular/core";
import { ResourceService } from "@core/common/resource.service";
import { Member } from "./member.model";

@Injectable({ providedIn: "root" })
export class MemberService extends ResourceService<Member> {
  readonly resourcePath = "shops/me/members";
}
