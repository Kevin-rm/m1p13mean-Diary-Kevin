import { Component, inject, signal, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { finalize } from "rxjs";
import { TableModule, TableLazyLoadEvent } from "primeng/table";
import { DataTable } from "@shared/components/data-table/data-table";
import { Drawer } from "primeng/drawer";
import { InputText } from "primeng/inputtext";
import { Textarea } from "primeng/textarea";
import { Button } from "primeng/button";
import { ActiveTag } from "@shared/components/active-tag";
import { Fluid } from "primeng/fluid";
import { Tooltip } from "primeng/tooltip";
import { BreadcrumbService } from "@backoffice/layout/breadcrumb.service";
import { PageHeader } from "@backoffice/layout/page-header";
import { extractErrorMessage } from "@core/utils/error";
import { TableState } from "@core/utils/table-state";
import { Toast } from "@core/utils/toast";
import { CategoryService } from "./category.service";
import { Category } from "./category.model";
import { FormField } from "@shared/components/form-field";
import { NoValuePipe } from "@shared/pipes/no-value";

@Component({
  selector: "app-admin-categories",
  imports: [
    ReactiveFormsModule,
    TableModule,
    DataTable,
    Drawer,
    InputText,
    Textarea,
    Button,
    ActiveTag,
    Fluid,
    Tooltip,
    PageHeader,
    FormField,
    NoValuePipe,
  ],
  templateUrl: "./categories.html",
})
export class AdminCategories implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly breadcrumb = inject(BreadcrumbService);
  private readonly toast = inject(Toast);
  private readonly fb = inject(FormBuilder);
  private editingId: string | null = null;

  protected readonly table = new TableState<Category>(inject(ActivatedRoute), inject(Router));
  protected readonly drawerVisible = signal(false);
  protected readonly saving = signal(false);
  protected readonly editing = signal(false);
  protected readonly form = this.fb.nonNullable.group({
    name: ["", Validators.required],
    description: [""],
  });

  ngOnInit(): void {
    this.breadcrumb.set([{ label: "Catégories" }]);
    this.loadCategories();
  }

  protected loadCategories(event?: TableLazyLoadEvent): void {
    const filters = { search: this.table.search() || undefined };
    this.table.load(
      this.categoryService.list({ ...filters, page: this.table.page, limit: this.table.limit }),
      {
        event,
        queryParams: filters,
        onError: () => this.toast.error("Impossible de charger les catégories"),
      },
    );
  }

  protected openCreateDrawer(): void {
    this.editing.set(false);
    this.editingId = null;
    this.form.reset();
    this.drawerVisible.set(true);
  }

  protected openEditDrawer(category: Category): void {
    this.editing.set(true);
    this.editingId = category.id;
    this.form.patchValue({
      name: category.name,
      description: category.description ?? "",
    });
    this.drawerVisible.set(true);
  }

  protected saveCategory(): void {
    if (this.form.invalid) return;

    this.saving.set(true);
    const data = this.form.getRawValue();

    const request$ = this.editing()
      ? this.categoryService.update(this.editingId!, data)
      : this.categoryService.create(data);

    request$.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: response => {
        this.toast.success(response.message);
        this.drawerVisible.set(false);
        this.loadCategories();
      },
      error: error => {
        this.toast.error(extractErrorMessage(error));
      },
    });
  }

  protected toggleActive(category: Category): void {
    this.categoryService.toggleActive(category.id).subscribe({
      next: response => {
        this.toast.success(response.message);
        this.loadCategories();
      },
      error: () => {
        this.toast.error("Impossible de modifier le statut");
      },
    });
  }
}
