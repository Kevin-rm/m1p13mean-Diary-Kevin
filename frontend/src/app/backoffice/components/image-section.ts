import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  ViewChild,
} from "@angular/core";
import { ConfirmationService } from "primeng/api";
import { ConfirmDialog } from "primeng/confirmdialog";
import { Image } from "primeng/image";
import { Button } from "primeng/button";
import { ImageUpload } from "@shared/components/image-upload";

@Component({
  selector: "app-image-section",
  imports: [ConfirmDialog, Image, Button, ImageUpload],
  providers: [ConfirmationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-confirmDialog />

    @if (images().length) {
      <div class="flex flex-wrap gap-4">
        @for (image of images(); track image) {
          <div class="relative group">
            <p-image
              [src]="image"
              [alt]="alt()"
              width="128"
              [preview]="true"
              imageClass="rounded-lg object-cover border border-surface-200"
              [imageStyle]="{ width: '128px', height: '128px' }"
            />
            @if (removable()) {
              <p-button
                icon="pi pi-trash"
                [rounded]="true"
                severity="danger"
                size="small"
                (click)="confirmRemove(image)"
                class="!absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                styleClass="!w-7 !h-7"
              />
            }
          </div>
        }
      </div>
    } @else {
      <p class="text-muted-color">Aucune image</p>
    }

    <div class="mt-6">
      <app-image-upload
        #imageUpload
        [multiple]="multiple()"
        [showUploadButton]="true"
        (upload)="upload.emit($event)"
      />
    </div>
  `,
})
export class ImageSection {
  private readonly confirmationService = inject(ConfirmationService);

  @ViewChild("imageUpload") readonly imageUpload!: ImageUpload;

  images = input.required<string[]>();
  alt = input("");
  removable = input(false);
  multiple = input(true);

  upload = output<File[]>();
  remove = output<string>();

  protected confirmRemove(image: string): void {
    this.confirmationService.confirm({
      message: "Voulez-vous vraiment supprimer cette image ?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Supprimer",
      rejectLabel: "Annuler",
      acceptButtonStyleClass: "p-button-danger",
      accept: () => this.remove.emit(image),
    });
  }
}
