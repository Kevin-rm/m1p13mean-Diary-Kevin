import { ChangeDetectionStrategy, Component, inject, input, model, output } from "@angular/core";
import { ReactiveFormsModule, FormBuilder, FormControl, Validators } from "@angular/forms";
import { Dialog } from "primeng/dialog";
import { InputText } from "primeng/inputtext";
import { Select } from "primeng/select";
import { Button } from "primeng/button";
import { Fluid } from "primeng/fluid";
import { FormField } from "@shared/components/form-field";
import { SelectOption } from "@core/common/resource.service";

@Component({
  selector: "app-invite-dialog",
  imports: [ReactiveFormsModule, Dialog, InputText, Select, Button, Fluid, FormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-dialog
      header="Inviter un membre"
      [(visible)]="visible"
      [modal]="true"
      [style]="{ width: '30rem' }"
      (onHide)="onHide()"
    >
      <p-fluid>
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-4 pt-2">
          <app-form-field
            inputId="inviteEmail"
            label="Email"
            [control]="form.controls.email"
            [errors]="{ required: 'Email requis', email: 'Email invalide' }"
          >
            <input
              pInputText
              id="inviteEmail"
              formControlName="email"
              [invalid]="form.controls.email.touched && form.controls.email.invalid"
            />
          </app-form-field>

          <app-form-field
            inputId="inviteRole"
            label="Rôle"
            [control]="form.controls.roleId"
            [errors]="{ required: 'Rôle requis' }"
            [floatLabel]="false"
          >
            <p-select
              inputId="inviteRole"
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
          label="Inviter"
          [disabled]="form.invalid"
          [loading]="loading()"
          (onClick)="onSubmit()"
        />
      </ng-template>
    </p-dialog>
  `,
})
export class InviteDialog {
  private readonly fb = inject(FormBuilder);

  protected readonly form = this.fb.nonNullable.group({
    email: ["", [Validators.required, Validators.email]],
    roleId: new FormControl<string | null>(null, Validators.required),
  });

  readonly roles = input.required<SelectOption[]>();
  readonly visible = model(false);
  readonly loading = model(false);
  readonly submit = output<{ email: string; roleId: string }>();

  protected onSubmit(): void {
    if (this.form.invalid) return;
    const { email, roleId } = this.form.getRawValue();
    this.submit.emit({ email, roleId: roleId! });
  }

  protected onHide(): void {
    this.form.reset();
  }
}
