import { ChangeDetectionStrategy, Component, input, output, ViewChild } from "@angular/core";
import { FileUpload } from "primeng/fileupload";

@Component({
  selector: "app-image-upload",
  imports: [FileUpload],
  template: `
    <p-fileupload
      #fileUpload
      mode="advanced"
      [customUpload]="true"
      [multiple]="multiple()"
      accept="image/jpeg,image/png,image/webp"
      [maxFileSize]="maxFileSize()"
      [fileLimit]="fileLimit()"
      [previewWidth]="80"
      [showUploadButton]="showUploadButton()"
      [showCancelButton]="true"
      chooseLabel="Sélectionner des images"
      chooseIcon="none"
      uploadLabel="Importer"
      cancelLabel="Annuler"
      (uploadHandler)="onUpload()"
    >
      <ng-template #empty>
        <p class="text-muted-color m-0">Glissez-déposez des images ici</p>
      </ng-template>
    </p-fileupload>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageUpload {
  @ViewChild("fileUpload") private fileUpload!: FileUpload;

  multiple = input(true);
  maxFileSize = input(5_000_000);
  fileLimit = input(5);
  showUploadButton = input(false);

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
