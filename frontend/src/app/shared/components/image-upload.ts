import { Component, input, output, ViewChild } from "@angular/core";
import { FileUpload } from "primeng/fileupload";

@Component({
  selector: "app-image-upload",
  imports: [FileUpload],
  template: `
    <p-fileupload
      #fileUpload
      [mode]="mode()"
      [customUpload]="customUpload()"
      [multiple]="multiple()"
      [accept]="accept()"
      [maxFileSize]="maxFileSize()"
      [fileLimit]="fileLimit()"
      [previewWidth]="previewWidth()"
      [showUploadButton]="showUploadButton()"
      [showCancelButton]="showCancelButton()"
      [chooseLabel]="chooseLabel()"
      [chooseIcon]="chooseIcon()"
      uploadLabel="Envoyer"
      cancelLabel="Annuler"
      (uploadHandler)="onUpload()"
    >
      <ng-template #empty>
        <p class="text-muted-color m-0">{{ emptyMessage() }}</p>
      </ng-template>
    </p-fileupload>
  `,
})
export class ImageUpload {
  @ViewChild("fileUpload") private fileUpload!: FileUpload;

  mode = input<"advanced" | "basic">("advanced");
  customUpload = input(true);
  multiple = input(true);
  accept = input("image/jpeg,image/png,image/webp");
  maxFileSize = input(5_000_000);
  fileLimit = input(5);
  previewWidth = input(80);
  showUploadButton = input(false);
  showCancelButton = input(true);
  chooseLabel = input("Sélectionner des images");
  chooseIcon = input("none");
  emptyMessage = input("Glissez-déposez des images ici ou cliquez pour sélectionner");

  upload = output<File[]>();

  get files(): File[] {
    return this.fileUpload?.files ?? [];
  }

  clear(): void {
    this.fileUpload?.clear();
  }

  protected onUpload(): void {
    if (this.files.length) {
      this.upload.emit(this.files);
    }
  }
}
