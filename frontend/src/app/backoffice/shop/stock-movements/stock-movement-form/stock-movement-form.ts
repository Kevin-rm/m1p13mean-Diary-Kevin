import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { NgTemplateOutlet } from "@angular/common";
import {
  ReactiveFormsModule,
  FormBuilder,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { lastValueFrom } from "rxjs";
import { injectMutation, injectQuery } from "@tanstack/angular-query-experimental";
import { InputText } from "primeng/inputtext";
import { InputNumber } from "primeng/inputnumber";
import { Select } from "primeng/select";
import { DatePicker } from "primeng/datepicker";
import { Button } from "primeng/button";
import { Card } from "primeng/card";
import { Fieldset } from "primeng/fieldset";
import { Fluid } from "primeng/fluid";
import { FormField } from "@shared/components/form-field";
import { FormRepeater } from "@backoffice/components/form-repeater";
import { BreadcrumbService } from "@backoffice/layout/breadcrumb.service";
import { PageHeader } from "@backoffice/components/page-header";
import { extractErrorMessage } from "@core/utils/error";
import { Toast } from "@core/utils/toast";
import { SelectOption } from "@core/common/resource.service";
import { ProductService } from "@core/domains/catalog/product/product.service";
import { StockMovementService } from "@core/domains/catalog/stock-movement/stock-movement.service";
import { MOVEMENT_TYPE_OPTIONS } from "@core/domains/catalog/stock-movement/stock-movement.model";

interface LineForm {
  productId: FormControl<string | null>;
  quantity: FormControl<number | null>;
}

@Component({
  selector: "app-stock-movement-form",
  imports: [
    ReactiveFormsModule,
    NgTemplateOutlet,
    InputText,
    InputNumber,
    Select,
    DatePicker,
    Button,
    Card,
    Fieldset,
    Fluid,
    FormField,
    FormRepeater,
    PageHeader,
  ],
  templateUrl: "./stock-movement-form.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StockMovementForm implements OnInit {
  private readonly stockMovementService = inject(StockMovementService);
  private readonly productService = inject(ProductService);
  private readonly breadcrumb = inject(BreadcrumbService);
  private readonly toast = inject(Toast);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly productsQuery = injectQuery(() => ({
    ...this.productService.selectQueryOptions({ search: this.productSearch() }),
    enabled: this.productSearch().length > 0,
  }));

  protected readonly productSearch = signal("");

  protected readonly form = this.fb.nonNullable.group({
    date: [new Date(), Validators.required],
    type: new FormControl<string | null>(null, Validators.required),
    note: [""],
    lines: this.fb.array<FormGroup<LineForm>>([]),
  });

  protected readonly typeOptions = MOVEMENT_TYPE_OPTIONS.filter(o => o.value !== "");

  protected readonly products = computed<SelectOption[]>(
    () => this.productsQuery.data()?.data ?? [],
  );

  protected readonly createMutation = injectMutation(() => ({
    mutationFn: (data: object) => lastValueFrom(this.stockMovementService.create(data)),
    onSuccess: (response: { message: string }) => {
      this.toast.success(response.message);
      this.router.navigate(["/backoffice/shop/stock-movements"]);
    },
    onError: (error: unknown) => {
      this.toast.error(extractErrorMessage(error, "Impossible de créer le mouvement"));
    },
  }));

  protected get lines(): FormArray<FormGroup<LineForm>> {
    return this.form.controls.lines;
  }

  ngOnInit(): void {
    this.breadcrumb.set([
      { label: "Mouvements de stock", routerLink: "/backoffice/shop/stock-movements" },
      { label: "Nouveau" },
    ]);
    this.addLine();
  }

  protected addLine(): void {
    this.lines.push(
      this.fb.group<LineForm>({
        productId: new FormControl(null, Validators.required),
        quantity: new FormControl(null, [Validators.required, Validators.min(1)]),
      }),
    );
  }

  protected removeLine(index: number): void {
    this.lines.removeAt(index);
  }

  protected resetForm(): void {
    this.form.reset({ date: new Date(), type: null, note: "" });
    this.lines.clear();
    this.addLine();
  }

  protected submit(): void {
    if (this.form.invalid || this.lines.length === 0) return;
    const raw = this.form.getRawValue();
    this.createMutation.mutate({
      date: raw.date.toISOString(),
      type: raw.type,
      note: raw.note || undefined,
      lines: raw.lines.map(l => ({ productId: l.productId, quantity: l.quantity })),
    });
  }
}
