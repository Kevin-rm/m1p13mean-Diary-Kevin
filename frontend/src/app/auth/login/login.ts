import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { lastValueFrom } from "rxjs";
import { injectMutation } from "@tanstack/angular-query-experimental";
import { Card } from "primeng/card";
import { InputText } from "primeng/inputtext";
import { Password } from "primeng/password";
import { Button } from "primeng/button";
import { Fluid } from "primeng/fluid";
import { Message } from "primeng/message";
import { AuthService } from "../auth.service";
import { extractErrorMessage } from "@core/utils/error";
import { FormField } from "@shared/components/form-field";

@Component({
  selector: "app-login",
  imports: [
    RouterLink,
    ReactiveFormsModule,
    Card,
    InputText,
    Password,
    Button,
    Fluid,
    Message,
    FormField,
  ],
  templateUrl: "./login.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly errorMessage = signal("");

  protected readonly form = this.fb.nonNullable.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", Validators.required],
  });

  protected readonly loginMutation = injectMutation(() => ({
    mutationFn: (credentials: { email: string; password: string }) =>
      lastValueFrom(this.authService.login(credentials)),
    onSuccess: () => {
      this.router.navigate(["/backoffice"]);
    },
    onError: error => {
      this.errorMessage.set(extractErrorMessage(error));
    },
  }));

  protected onSubmit(): void {
    if (this.form.invalid) return;
    this.errorMessage.set("");
    this.loginMutation.mutate(this.form.getRawValue());
  }
}
