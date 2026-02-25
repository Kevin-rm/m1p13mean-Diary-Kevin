import { inject, Injectable } from "@angular/core";
import { MessageService } from "primeng/api";

@Injectable({ providedIn: "root" })
export class Toast {
  private readonly messageService = inject(MessageService);

  show(message: Parameters<MessageService["add"]>[0]): void {
    this.messageService.add(message);
  }

  success(detail: string): void {
    this.show({ severity: "success", summary: "Succès", detail });
  }

  info(detail: string): void {
    this.show({ severity: "info", summary: "Info", detail });
  }

  error(detail: string): void {
    this.show({ severity: "error", summary: "Erreur", detail });
  }
}
