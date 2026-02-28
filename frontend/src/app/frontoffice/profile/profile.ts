import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from "@angular/core";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { lastValueFrom } from "rxjs";
import { injectMutation } from "@tanstack/angular-query-experimental";
import { Avatar } from "primeng/avatar";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "primeng/tabs";
import { InputText } from "primeng/inputtext";
import { Password } from "primeng/password";
import { Button } from "primeng/button";
import { Fluid } from "primeng/fluid";
import { Dialog } from "primeng/dialog";
import { ImageCropperComponent, ImageCroppedEvent } from "ngx-image-cropper";
import { extractErrorMessage } from "@core/utils/error";
import { AuthService } from "@auth/auth.service";
import { AccountService } from "@core/domains/account/account.service";
import { Toast } from "@core/utils/toast";
import { FormField } from "@shared/components/form-field";

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
    Dialog,
    ImageCropperComponent,
    FormField,
  ],
  templateUrl: "./profile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Profile implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly accountService = inject(AccountService);
  private readonly toast = inject(Toast);
  private croppedBlob: Blob | null = null;

  protected readonly authService = inject(AuthService);
  protected readonly avatarPreview = signal<string | null>(null);
  protected readonly cropperVisible = signal(false);
  protected readonly cropperFile = signal<File | null>(null);

  protected readonly profileForm = this.fb.nonNullable.group({
    firstName: ["", Validators.required],
    lastName: ["", Validators.required],
  });

  protected readonly passwordForm = this.fb.nonNullable.group({
    currentPassword: ["", Validators.required],
    newPassword: ["", [Validators.required, Validators.minLength(8)]],
  });

  protected readonly profileMutation = injectMutation(() => ({
    mutationFn: (data: object) => lastValueFrom(this.accountService.updateProfile(data)),
    onSuccess: () => {
      this.toast.success("Profil mis à jour");
      this.profileForm.markAsPristine();
      lastValueFrom(this.authService.checkAuthState());
    },
    onError: error => {
      this.toast.error(extractErrorMessage(error));
    },
  }));

  protected readonly avatarMutation = injectMutation(() => ({
    mutationFn: (file: Blob) => lastValueFrom(this.accountService.updateAvatar(file)),
    onSuccess: () => {
      this.toast.success("Photo de profil mise à jour");
      this.avatarPreview.set(null);
      lastValueFrom(this.authService.checkAuthState());
    },
    onError: error => {
      this.avatarPreview.set(null);
      this.toast.error(extractErrorMessage(error));
    },
  }));

  protected readonly passwordMutation = injectMutation(() => ({
    mutationFn: (data: object) => lastValueFrom(this.accountService.changePassword(data)),
    onSuccess: () => {
      this.toast.success("Mot de passe modifié");
      this.passwordForm.reset();
    },
    onError: error => {
      this.toast.error(extractErrorMessage(error));
    },
  }));

  ngOnInit(): void {
    const user = this.authService.user();
    if (user) {
      this.profileForm.patchValue({ firstName: user.firstName, lastName: user.lastName });
    }
  }

  protected onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.cropperFile.set(file);
    this.cropperVisible.set(true);
    input.value = "";
  }

  protected onImageCropped(event: ImageCroppedEvent): void {
    this.croppedBlob = event.blob ?? null;
  }

  protected confirmCrop(): void {
    if (!this.croppedBlob) return;

    this.avatarPreview.set(URL.createObjectURL(this.croppedBlob));
    this.avatarMutation.mutate(this.croppedBlob);

    this.cropperVisible.set(false);
    this.cropperFile.set(null);
    this.croppedBlob = null;
  }

  protected cancelCrop(): void {
    this.cropperVisible.set(false);
    this.cropperFile.set(null);
    this.croppedBlob = null;
  }

  protected onProfileSubmit(): void {
    if (this.profileForm.invalid) return;
    this.profileMutation.mutate(this.profileForm.getRawValue());
  }

  protected onPasswordSubmit(): void {
    if (this.passwordForm.invalid) return;
    this.passwordMutation.mutate(this.passwordForm.getRawValue());
  }
}
