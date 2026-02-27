import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
  OnInit,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { finalize } from "rxjs";
import { Avatar } from "primeng/avatar";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "primeng/tabs";
import { InputText } from "primeng/inputtext";
import { Password } from "primeng/password";
import { Button } from "primeng/button";
import { Fluid } from "primeng/fluid";
import { Dialog } from "primeng/dialog";
import { ImageCropperComponent, ImageCroppedEvent } from "ngx-image-cropper";
import { environment } from "@env/environment";
import { ApiResponse } from "@core/common/models/api-response";
import { extractErrorMessage } from "@core/utils/error";
import { AuthService } from "@auth/auth.service";
import { User } from "@auth/auth.models";
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
  private readonly http = inject(HttpClient);
  private readonly toast = inject(Toast);
  private readonly accountUrl = `${environment.apiUrl}/account`;
  private croppedBlob: Blob | null = null;

  private readonly destroyRef = inject(DestroyRef);

  protected readonly authService = inject(AuthService);
  protected readonly profileLoading = signal(false);
  protected readonly passwordLoading = signal(false);
  protected readonly avatarPreview = signal<string | null>(null);
  protected readonly avatarUploading = signal(false);
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

    const blob = this.croppedBlob;
    this.avatarPreview.set(URL.createObjectURL(blob));
    this.avatarUploading.set(true);

    const formData = new FormData();
    formData.append("avatar", blob, "avatar.png");

    this.http
      .patch<ApiResponse<{ user: User }>>(`${this.accountUrl}/avatar`, formData)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.avatarUploading.set(false)),
      )
      .subscribe({
        next: () => {
          this.toast.success("Photo de profil mise à jour");
          this.avatarPreview.set(null);
          this.authService.checkAuthState().subscribe();
        },
        error: error => {
          this.avatarPreview.set(null);
          this.toast.error(extractErrorMessage(error));
        },
      });

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

    this.profileLoading.set(true);

    this.http
      .patch<ApiResponse<{ user: User }>>(
        `${this.accountUrl}/profile`,
        this.profileForm.getRawValue(),
      )
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.profileLoading.set(false)),
      )
      .subscribe({
        next: () => {
          this.toast.success("Profil mis à jour");
          this.profileForm.markAsPristine();
          this.authService.checkAuthState().subscribe();
        },
        error: error => {
          this.toast.error(extractErrorMessage(error));
        },
      });
  }

  protected onPasswordSubmit(): void {
    if (this.passwordForm.invalid) return;

    this.passwordLoading.set(true);

    this.http
      .patch<ApiResponse<void>>(`${this.accountUrl}/password`, this.passwordForm.getRawValue())
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.passwordLoading.set(false)),
      )
      .subscribe({
        next: () => {
          this.toast.success("Mot de passe modifié");
          this.passwordForm.reset();
        },
        error: error => {
          this.toast.error(extractErrorMessage(error));
        },
      });
  }
}
