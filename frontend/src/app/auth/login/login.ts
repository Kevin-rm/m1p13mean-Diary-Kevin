import { Component, inject, signal } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { Card } from "primeng/card";
import { InputText } from "primeng/inputtext";
import { Password } from "primeng/password";
import { Button } from "primeng/button";
import { Fluid } from "primeng/fluid";
import { Message } from "primeng/message";
import { AuthService } from "../auth.service";
import { extractErrorMessage } from "@core/utils/error";
import { FormField } from "@shared/form-field";

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
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly errorMessage = signal("");
  protected readonly loading = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", Validators.required],
  });

  protected onSubmit(): void {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.errorMessage.set("");

    this.authService.login(this.form.getRawValue()).subscribe({
      next: () => this.router.navigate(["/"]),
      error: error => {
        this.loading.set(false);
        this.errorMessage.set(extractErrorMessage(error));
      },
    });
  }
}
