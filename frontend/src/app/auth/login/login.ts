import { Component, inject, signal } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { Navbar } from "../../shared/components/navbar/navbar";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-login",
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    Navbar,
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
      error: err => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message || "An error occurred");
      },
    });
  }
}
