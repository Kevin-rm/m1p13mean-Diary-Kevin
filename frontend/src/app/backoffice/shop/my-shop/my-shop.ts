import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  untracked,
  ViewChild,
  OnInit,
} from "@angular/core";
import { ReactiveFormsModule, FormBuilder } from "@angular/forms";
import { lastValueFrom } from "rxjs";
import { injectMutation, injectQuery, QueryClient } from "@tanstack/angular-query-experimental";
import { Button } from "primeng/button";
import { ImageSection } from "@backoffice/components/image-section";
import { extractErrorMessage } from "@core/utils/error";
import { Toast } from "@core/utils/toast";
import { BreadcrumbService } from "@backoffice/layout/breadcrumb.service";
import { RecordPage, RecordPageTab } from "@backoffice/components/record-page";
import { Shop } from "@core/domains/shop/shop.model";
import { ShopService } from "@core/domains/shop/shop.service";
import { ApiResponse } from "@core/common/models/api-response";
import { ShopFormFields } from "./shop-form-fields";
import { ScheduleEditor } from "./schedule-editor";

const QUERY_KEY = ["shops", "me"];

@Component({
  selector: "app-my-shop",
  imports: [
    ReactiveFormsModule,
    Button,
    ImageSection,
    RecordPage,
    RecordPageTab,
    ShopFormFields,
    ScheduleEditor,
  ],
  templateUrl: "./my-shop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyShop implements OnInit {
  private readonly shopService = inject(ShopService);
  private readonly queryClient = inject(QueryClient);
  private readonly breadcrumb = inject(BreadcrumbService);
  private readonly toast = inject(Toast);
  private readonly fb = inject(FormBuilder);

  @ViewChild(ScheduleEditor) private scheduleEditor?: ScheduleEditor;
  @ViewChild("imageSection") private imageSection!: ImageSection;

  private readonly shopQuery = injectQuery(() => ({
    queryKey: QUERY_KEY,
    queryFn: () => lastValueFrom(this.shopService.getMe()),
  }));

  protected readonly editing = signal(false);
  protected readonly form = ShopFormFields.createForm(this.fb);
  protected readonly shop = computed(() => this.shopQuery.data()?.data ?? null);
  protected readonly loading = computed(() => this.shopQuery.isPending());

  protected readonly saveMutation = injectMutation(() => ({
    mutationFn: (data: object) => lastValueFrom(this.shopService.updateMe(data)),
    onSuccess: (response: ApiResponse<Shop>) => {
      this.toast.success(response.message);
      this.queryClient.setQueryData(QUERY_KEY, response);
      this.editing.set(false);
    },
    onError: error => {
      this.toast.error(extractErrorMessage(error));
    },
  }));

  protected readonly uploadLogoMutation = injectMutation(() => ({
    mutationFn: (file: File) => lastValueFrom(this.shopService.uploadLogo(file)),
    onSuccess: (response: ApiResponse<Shop>) => {
      this.queryClient.setQueryData(QUERY_KEY, response);
      this.toast.success("Logo mis à jour");
    },
    onError: error => {
      this.toast.error(extractErrorMessage(error, "Impossible de mettre à jour le logo"));
    },
  }));

  protected readonly uploadImagesMutation = injectMutation(() => ({
    mutationFn: (files: File[]) => lastValueFrom(this.shopService.addImages(files)),
    onSuccess: (response: ApiResponse<Shop>) => {
      this.toast.success(response.message);
      this.queryClient.setQueryData(QUERY_KEY, response);
      this.imageSection.imageUpload.clear();
    },
    onError: error => {
      this.toast.error(extractErrorMessage(error, "Impossible d'ajouter les images"));
    },
  }));

  protected readonly removeImageMutation = injectMutation(() => ({
    mutationFn: (imageUrl: string) => lastValueFrom(this.shopService.removeImage(imageUrl)),
    onSuccess: (response: ApiResponse<Shop>) => {
      this.toast.success(response.message);
      this.queryClient.setQueryData(QUERY_KEY, response);
    },
    onError: error => {
      this.toast.error(extractErrorMessage(error, "Impossible de supprimer l'image"));
    },
  }));

  constructor() {
    effect(() => {
      const s = this.shop();
      if (s && !this.editing()) {
        untracked(() => this.patchForm());
      }
    });
  }

  ngOnInit(): void {
    this.breadcrumb.set([{ label: "Ma boutique" }]);
  }

  protected startEditing(): void {
    this.editing.set(true);
  }

  protected cancelEditing(): void {
    this.editing.set(false);
  }

  protected saveShop(): void {
    const data: Record<string, unknown> = { ...this.form.getRawValue() };
    if (this.scheduleEditor) {
      data["schedule"] = this.scheduleEditor.getSchedule();
    }
    this.saveMutation.mutate(data);
  }

  protected uploadLogo(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.uploadLogoMutation.mutate(file);
  }

  protected uploadImages(files: File[]): void {
    this.uploadImagesMutation.mutate(files);
  }

  protected removeImage(imageUrl: string): void {
    this.removeImageMutation.mutate(imageUrl);
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
}
