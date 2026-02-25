import { Component, inject, signal, OnInit } from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { ReactiveFormsModule, FormsModule, FormBuilder, Validators } from "@angular/forms";
import { Card } from "primeng/card";
import { InputText } from "primeng/inputtext";
import { Password } from "primeng/password";
import { Button } from "primeng/button";
import { Fluid } from "primeng/fluid";
import { Message } from "primeng/message";
import { RadioButton } from "primeng/radiobutton";
import { Textarea } from "primeng/textarea";
import { Fieldset } from "primeng/fieldset";
import { Divider } from "primeng/divider";
import { AuthService } from "../auth.service";
import { extractErrorMessage } from "@core/utils/error";
import { FormField } from "@shared/components/form-field";

@Component({
  selector: "app-register",
  imports: [
    NgTemplateOutlet,
    RouterLink,
    ReactiveFormsModule,
    FormsModule,
    Card,
    InputText,
    Password,
    Button,
    Fluid,
    Message,
    RadioButton,
    Textarea,
    Fieldset,
    Divider,
    FormField,
  ],
  templateUrl: "./register.html",
})
export class Register implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly errorMessage = signal("");
  protected readonly loading = signal(false);
  protected readonly accountType = signal<"customer" | "shop">("customer");
  protected readonly form = this.fb.nonNullable.group({
    firstName: ["", Validators.required],
    lastName: ["", Validators.required],
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(8)]],
    shopName: [""],
    shopDescription: [""],
    contactEmail: ["", Validators.email],
    contactPhone: [""],
  });

  ngOnInit(): void {
    const type = this.route.snapshot.queryParamMap.get("type");
    if (type === "customer" || type === "shop") {
      this.onTypeChange(type);
    }
  }

  protected onTypeChange(type: "customer" | "shop"): void {
    this.accountType.set(type);
    this.router.navigate([], {
      queryParams: { type },
      queryParamsHandling: "merge",
    });

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
      this.accountType() === "customer"
        ? this.authService.registerCustomer(values)
        : this.authService.registerShop(values);

    request$.subscribe({
      next: () => this.router.navigate(["/"]),
      error: error => {
        this.loading.set(false);
        this.errorMessage.set(extractErrorMessage(error));
      },
    });
  }
}
