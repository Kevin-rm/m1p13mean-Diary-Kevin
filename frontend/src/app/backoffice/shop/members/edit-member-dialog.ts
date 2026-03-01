import { ChangeDetectionStrategy, Component, inject, input, model, output } from "@angular/core";
import { ReactiveFormsModule, FormBuilder, FormControl, Validators } from "@angular/forms";
import { Dialog } from "primeng/dialog";
import { Select } from "primeng/select";
import { Button } from "primeng/button";
import { Fluid } from "primeng/fluid";
import { FormField } from "@shared/components/form-field";
import { SelectOption } from "@core/common/resource.service";
import { Member } from "@core/domains/member/member.model";

@Component({
  selector: "app-edit-member-dialog",
  imports: [ReactiveFormsModule, Dialog, Select, Button, Fluid, FormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-dialog
      header="Modifier le rôle"
      [(visible)]="visible"
      [modal]="true"
      [style]="{ width: '30rem' }"
      (onHide)="onHide()"
    >
      <p-fluid>
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-4 pt-2">
          <app-form-field
            inputId="editRole"
            label="Rôle"
            [control]="form.controls.roleId"
            [errors]="{ required: 'Rôle requis' }"
            [floatLabel]="false"
          >
            <p-select
              inputId="editRole"
              formControlName="roleId"
              [options]="roles()"
              optionLabel="name"
              optionValue="id"
              placeholder="Sélectionner un rôle"
              [showClear]="true"
              appendTo="body"
              [invalid]="form.controls.roleId.touched && form.controls.roleId.invalid"
            />
          </app-form-field>
        </form>
      </p-fluid>
      <ng-template #footer>
        <p-button label="Annuler" severity="secondary" (onClick)="visible.set(false)" />
        <p-button
          label="Enregistrer"
          [disabled]="form.invalid || form.pristine"
          [loading]="loading()"
          (onClick)="onSubmit()"
        />
      </ng-template>
    </p-dialog>
  `,
})
export class EditMemberDialog {
  private readonly fb = inject(FormBuilder);
  private memberId = "";

  protected readonly form = this.fb.nonNullable.group({
    roleId: new FormControl<string | null>(null, Validators.required),
  });

  readonly roles = input.required<SelectOption[]>();
  readonly visible = model(false);
  readonly loading = model(false);
  readonly submit = output<{ memberId: string; roleId: string }>();

  open(member: Member): void {
    this.memberId = member.id;
    this.form.patchValue({ roleId: member.role.id });
    this.form.markAsPristine();
    this.visible.set(true);
  }

  protected onSubmit(): void {
    if (this.form.invalid) return;
    this.submit.emit({ memberId: this.memberId, roleId: this.form.getRawValue().roleId! });
  }

  protected onHide(): void {
    this.form.reset();
  }
}
