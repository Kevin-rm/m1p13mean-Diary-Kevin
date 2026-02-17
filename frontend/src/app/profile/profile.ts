import { Component, computed, inject, signal, OnInit } from "@angular/core";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { Avatar } from "primeng/avatar";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "primeng/tabs";
import { FloatLabel } from "primeng/floatlabel";
import { InputText } from "primeng/inputtext";
import { Password } from "primeng/password";
import { Button } from "primeng/button";
import { Fluid } from "primeng/fluid";
import { Message } from "primeng/message";
import { environment } from "../../environments/environment";
import { ApiResponse } from "../core/models/api-response.model";
import { AuthService } from "../auth/auth.service";
import { User } from "../auth/auth.models";

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
    FloatLabel,
    InputText,
    Password,
    Button,
    Fluid,
    Message,
  ],
  templateUrl: "./profile.html",
})
export class Profile implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  protected readonly authService = inject(AuthService);
  private readonly authUrl = `${environment.apiUrl}/auth`;

  protected readonly avatarLabel = computed(() => {
    const user = this.authService.user();
    if (!user) return "";
    return (user.firstName[0] + user.lastName[0]).toUpperCase();
  });

  protected readonly fullName = computed(() => {
    const user = this.authService.user();
    if (!user) return "";
    return `${user.firstName} ${user.lastName}`;
  });

  protected readonly profileLabel = computed(() => {
    const context = this.authService.context();
    if (!context) return "";
    return context.profile.label;
  });

  protected readonly profileLoading = signal(false);
  protected readonly profileMessage = signal("");
  protected readonly profileSuccess = signal(false);

  protected readonly passwordLoading = signal(false);
  protected readonly passwordMessage = signal("");
  protected readonly passwordSuccess = signal(false);

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
    this.profileMessage.set("");

    this.http
      .patch<ApiResponse<{ user: User }>>(`${this.authUrl}/profile`, this.profileForm.getRawValue())
      .subscribe({
        next: () => {
          this.profileLoading.set(false);
          this.profileSuccess.set(true);
          this.profileMessage.set("Profil mis à jour");
          this.profileForm.markAsPristine();
          this.authService.checkAuthState().subscribe();
        },
        error: err => {
          this.profileLoading.set(false);
          this.profileSuccess.set(false);
          this.profileMessage.set(err.error?.message || "Une erreur est survenue");
        },
      });
  }

  protected onPasswordSubmit(): void {
    if (this.passwordForm.invalid) return;

    this.passwordLoading.set(true);
    this.passwordMessage.set("");

    this.http
      .patch<ApiResponse<void>>(`${this.authUrl}/password`, this.passwordForm.getRawValue())
      .subscribe({
        next: () => {
          this.passwordLoading.set(false);
          this.passwordSuccess.set(true);
          this.passwordMessage.set("Mot de passe modifié");
          this.passwordForm.reset();
        },
        error: err => {
          this.passwordLoading.set(false);
          this.passwordSuccess.set(false);
          this.passwordMessage.set(err.error?.message || "Une erreur est survenue");
        },
      });
  }
}
