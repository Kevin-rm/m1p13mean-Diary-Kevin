import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";
import { Avatar } from "primeng/avatar";
import { initials } from "@shared/pipes/initials";

@Component({
  selector: "app-user-avatar",
  imports: [Avatar],
  template: `
    @if (user().avatarUrl) {
      <p-avatar [image]="user().avatarUrl!" [size]="size()" shape="circle" />
    } @else {
      <p-avatar [label]="label()" [size]="size()" shape="circle" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAvatar {
  protected readonly label = computed(() => initials(this.user()));

  user = input.required<{ firstName?: string; lastName?: string; avatarUrl?: string }>();
  size = input<Avatar["size"]>("normal");
}
