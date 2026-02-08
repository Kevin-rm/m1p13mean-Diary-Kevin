import { Component, inject, signal } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatRadioModule } from "@angular/material/radio";
import { Navbar } from "../../shared/components/navbar/navbar";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-register",
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    Navbar,
  ],
  templateUrl: "./register.html",
})
export class Register {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly errorMessage = signal("");
  protected readonly loading = signal(false);
  protected readonly accountType = signal<"buyer" | "shop">("buyer");

  protected readonly form = this.fb.nonNullable.group({
    firstName: ["", Validators.required],
    lastName: ["", Validators.required],
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(8)]],
    shopName: [""],
    shopDescription: [""],
  });

  protected onTypeChange(type: "buyer" | "shop"): void {
    this.accountType.set(type);

    if (type === "shop") {
      this.form.controls.shopName.setValidators(Validators.required);
      this.form.controls.shopDescription.setValidators(Validators.required);
    } else {
      this.form.controls.shopName.clearValidators();
      this.form.controls.shopDescription.clearValidators();
    }

    this.form.controls.shopName.updateValueAndValidity();
    this.form.controls.shopDescription.updateValueAndValidity();
  }

  protected onSubmit(): void {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.errorMessage.set("");

    const values = this.form.getRawValue();

    const request$ =
      this.accountType() === "buyer"
        ? this.authService.registerBuyer(values)
        : this.authService.registerShop(values);

    request$.subscribe({
      next: () => this.router.navigate(["/"]),
      error: err => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message || "An error occurred");
      },
    });
  }
}
