import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  ViewChild,
} from "@angular/core";
import { lastValueFrom } from "rxjs";
import { injectMutation, injectQuery, QueryClient } from "@tanstack/angular-query-experimental";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "primeng/tabs";
import { Button } from "primeng/button";
import { Tooltip } from "primeng/tooltip";
import { ConfirmationService } from "primeng/api";
import { ConfirmDialog } from "primeng/confirmdialog";
import { BreadcrumbService } from "@backoffice/layout/breadcrumb.service";
import { PageHeader } from "@backoffice/components/page-header";
import { ActiveTag } from "@shared/components/active-tag";
import { FullNamePipe } from "@shared/pipes/full-name";
import { extractErrorMessage } from "@core/utils/error";
import { Toast } from "@core/utils/toast";
import { MemberService } from "@core/domains/member/member.service";
import { InvitationService } from "@core/domains/member/invitation/invitation.service";
import { RoleService } from "@core/domains/role/role.service";
import { Member } from "@core/domains/member/member.model";
import { InviteDialog } from "./invite-dialog";
import { EditMemberDialog } from "./edit-member-dialog";

@Component({
  selector: "app-shop-members",
  imports: [
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Button,
    Tooltip,
    ConfirmDialog,
    PageHeader,
    ActiveTag,
    FullNamePipe,
    InviteDialog,
    EditMemberDialog,
  ],
  providers: [ConfirmationService],
  templateUrl: "./members.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopMembers implements OnInit {
  @ViewChild(EditMemberDialog) private editDialog!: EditMemberDialog;

  private readonly breadcrumb = inject(BreadcrumbService);
  private readonly memberService = inject(MemberService);
  private readonly invitationService = inject(InvitationService);
  private readonly roleService = inject(RoleService);
  private readonly toast = inject(Toast);
  private readonly queryClient = inject(QueryClient);
  private readonly confirmationService = inject(ConfirmationService);

  protected readonly membersQuery = injectQuery(() => this.memberService.listQueryOptions());
  protected readonly invitationsQuery = injectQuery(() =>
    this.invitationService.listByShopQueryOptions(),
  );
  protected readonly rolesQuery = injectQuery(() => this.roleService.selectQueryOptions());

  protected readonly inviteVisible = signal(false);

  protected readonly inviteMutation = injectMutation(() => ({
    mutationFn: (data: { email: string; roleId: string }) =>
      lastValueFrom(this.invitationService.invite(data)),
    onSuccess: () => {
      this.toast.success("Invitation envoyée");
      this.inviteVisible.set(false);
      this.queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
    onError: (error: unknown) => {
      this.toast.error(extractErrorMessage(error));
    },
  }));

  protected readonly updateMutation = injectMutation(() => ({
    mutationFn: (data: { memberId: string; roleId: string }) =>
      lastValueFrom(this.memberService.update(data.memberId, { roleId: data.roleId })),
    onSuccess: () => {
      this.toast.success("Rôle modifié");
      this.queryClient.invalidateQueries({ queryKey: ["members"] });
    },
    onError: (error: unknown) => {
      this.toast.error(extractErrorMessage(error));
    },
  }));

  protected readonly toggleActiveMutation = injectMutation(() => ({
    mutationFn: (id: string) => lastValueFrom(this.memberService.toggleActive(id)),
    onSuccess: (response: { message?: string }) => {
      this.toast.success(response.message ?? "Statut modifié");
      this.queryClient.invalidateQueries({ queryKey: ["members"] });
    },
    onError: (error: unknown) => {
      this.toast.error(extractErrorMessage(error));
    },
  }));

  protected readonly removeMutation = injectMutation(() => ({
    mutationFn: (id: string) => lastValueFrom(this.memberService.remove(id)),
    onSuccess: () => {
      this.toast.success("Membre retiré");
      this.queryClient.invalidateQueries({ queryKey: ["members"] });
    },
    onError: (error: unknown) => {
      this.toast.error(extractErrorMessage(error));
    },
  }));

  protected readonly cancelInvitationMutation = injectMutation(() => ({
    mutationFn: (id: string) => lastValueFrom(this.invitationService.cancel(id)),
    onSuccess: () => {
      this.toast.success("Invitation annulée");
      this.queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
    onError: (error: unknown) => {
      this.toast.error(extractErrorMessage(error));
    },
  }));

  ngOnInit(): void {
    this.breadcrumb.set([{ label: "Membres" }]);
  }

  protected readonly members = () => this.membersQuery.data()?.data ?? [];
  protected readonly invitations = () => this.invitationsQuery.data()?.data ?? [];
  protected readonly roles = () => this.rolesQuery.data()?.data ?? [];

  protected openEdit(member: Member): void {
    this.editDialog.open(member);
  }

  protected confirmRemove(member: Member): void {
    this.confirmationService.confirm({
      message: `Retirer ce membre de la boutique ?`,
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Retirer",
      rejectLabel: "Annuler",
      acceptButtonStyleClass: "p-button-danger",
      accept: () => this.removeMutation.mutate(member.id),
    });
  }

  protected isOwner(member: Member): boolean {
    return member.role?.code === "owner";
  }
}
