import { Component, inject, signal, OnInit } from "@angular/core";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { Avatar } from "primeng/avatar";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "primeng/tabs";
import { InputText } from "primeng/inputtext";
import { Password } from "primeng/password";
import { Button } from "primeng/button";
import { Fluid } from "primeng/fluid";
import { Toast } from "primeng/toast";
import { environment } from "../../environments/environment";
import { ApiResponse } from "../core/models/api-response.model";
import { AuthService } from "../auth/auth.service";
import { User } from "../auth/auth.models";
import { FormField } from "../shared/form-field";

@Component({
  selector: "app-profile",
  imports: [
    ReactiveFormsModule,
    Avatar,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    InputText,
    Password,
    Button,
    Fluid,
    Toast,
    FormField,
  ],
  providers: [MessageService],
  templateUrl: "./profile.html",
})
export class Profile implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly messageService = inject(MessageService);
  private readonly accountUrl = `${environment.apiUrl}/account`;
  protected readonly authService = inject(AuthService);

  protected readonly profileLoading = signal(false);
  protected readonly passwordLoading = signal(false);

  protected readonly profileForm = this.fb.nonNullable.group({
    firstName: ["", Validators.required],
    lastName: ["", Validators.required],
  });

  protected readonly passwordForm = this.fb.nonNullable.group({
    currentPassword: ["", Validators.required],
    newPassword: ["", [Validators.required, Validators.minLength(8)]],
  });

  ngOnInit(): void {
    const user = this.authService.user();
    if (user) {
      this.profileForm.patchValue({ firstName: user.firstName, lastName: user.lastName });
    }
  }

  protected onProfileSubmit(): void {
    if (this.profileForm.invalid) return;

    this.profileLoading.set(true);

    this.http
      .patch<
        ApiResponse<{ user: User }>
      >(`${this.accountUrl}/profile`, this.profileForm.getRawValue())
      .subscribe({
        next: () => {
          this.profileLoading.set(false);
          this.messageService.add({
            severity: "success",
            summary: "Succès",
            detail: "Profil mis à jour",
          });
          this.profileForm.markAsPristine();
          this.authService.checkAuthState().subscribe();
        },
        error: err => {
          this.profileLoading.set(false);
          this.messageService.add({
            severity: "error",
            summary: "Erreur",
            detail: err.error?.message || "Une erreur est survenue",
          });
        },
      });
  }

  protected onPasswordSubmit(): void {
    if (this.passwordForm.invalid) return;

    this.passwordLoading.set(true);

    this.http
      .patch<ApiResponse<void>>(`${this.accountUrl}/password`, this.passwordForm.getRawValue())
      .subscribe({
        next: () => {
          this.passwordLoading.set(false);
          this.messageService.add({
            severity: "success",
            summary: "Succès",
            detail: "Mot de passe modifié",
          });
          this.passwordForm.reset();
        },
        error: err => {
          this.passwordLoading.set(false);
          this.messageService.add({
            severity: "error",
            summary: "Erreur",
            detail: err.error?.message || "Une erreur est survenue",
          });
        },
      });
  }
}
