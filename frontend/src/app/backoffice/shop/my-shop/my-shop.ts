import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
  ViewChild,
  OnInit,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ReactiveFormsModule, FormBuilder } from "@angular/forms";
import { finalize } from "rxjs";
import { Button } from "primeng/button";
import { ConfirmDialog } from "primeng/confirmdialog";
import { ConfirmationService } from "primeng/api";
import { Image } from "primeng/image";
import { ImageUpload } from "@shared/components/image-upload";
import { extractErrorMessage } from "@core/utils/error";
import { Toast } from "@core/utils/toast";
import { BreadcrumbService } from "@backoffice/layout/breadcrumb.service";
import { RecordPage, RecordPageTab } from "@backoffice/layout/record-page";
import { Shop, ScheduleSlot } from "@core/domains/shop/shop.model";
import { ShopFormFields } from "./shop-form-fields";
import { ScheduleEditor } from "./schedule-editor";
import { MyShopService } from "./my-shop.service";

@Component({
  selector: "app-my-shop",
  imports: [
    ReactiveFormsModule,
    Button,
    ConfirmDialog,
    Image,
    ImageUpload,
    RecordPage,
    RecordPageTab,
    ShopFormFields,
    ScheduleEditor,
  ],
  providers: [ConfirmationService],
  templateUrl: "./my-shop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyShop implements OnInit {
  private readonly myShopService = inject(MyShopService);
  private readonly breadcrumb = inject(BreadcrumbService);
  private readonly toast = inject(Toast);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild("imageUpload") private imageUpload!: ImageUpload;

  protected readonly shop = signal<Shop | null>(null);
  protected readonly loading = signal(true);
  protected readonly editing = signal(false);
  protected readonly saving = signal(false);
  protected readonly form = ShopFormFields.createForm(this.fb);

  ngOnInit(): void {
    this.breadcrumb.set([{ label: "Ma boutique" }]);
    this.loadShop();
  }

  protected startEditing(): void {
    this.editing.set(true);
  }

  protected cancelEditing(): void {
    this.patchForm();
    this.editing.set(false);
  }

  protected saveShop(): void {
    this.saving.set(true);
    this.myShopService
      .update(this.form.getRawValue())
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.saving.set(false)),
      )
      .subscribe({
        next: response => {
          this.toast.success(response.message);
          this.shop.set(response.data ?? null);
          this.patchForm();
          this.editing.set(false);
        },
        error: error => {
          this.toast.error(extractErrorMessage(error));
        },
      });
  }

  protected saveSchedule(schedule: ScheduleSlot[]): void {
    this.saving.set(true);
    this.myShopService
      .update({ schedule })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.saving.set(false)),
      )
      .subscribe({
        next: response => {
          this.toast.success(response.message);
          this.shop.set(response.data ?? null);
        },
        error: error => {
          this.toast.error(extractErrorMessage(error));
        },
      });
  }

  protected uploadLogo(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.myShopService
      .uploadLogo(file)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => {
          this.shop.set(response.data ?? null);
          this.toast.success("Logo mis à jour");
        },
        error: error => {
          this.toast.error(extractErrorMessage(error, "Impossible de mettre à jour le logo"));
        },
      });
  }

  protected uploadImages(files: File[]): void {
    this.myShopService
      .uploadImage(files[0])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => {
          if (!response.data?.shop) return;
          this.shop.set(response.data.shop);
          this.imageUpload.clear();
          this.toast.success("Image ajoutée");
        },
        error: error => {
          this.toast.error(extractErrorMessage(error, "Impossible d'ajouter l'image"));
        },
      });
  }

  private patchForm(): void {
    const s = this.shop();
    if (!s) return;
    this.form.patchValue({
      description: s.description ?? "",
      contactEmail: s.contactEmail ?? "",
      contactPhone: s.contactPhone ?? "",
    });
  }

  private loadShop(): void {
    this.myShopService
      .get()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: response => {
          this.shop.set(response.data ?? null);
          this.patchForm();
        },
        error: error => {
          this.toast.error(extractErrorMessage(error, "Impossible de charger la boutique"));
        },
      });
  }
}
