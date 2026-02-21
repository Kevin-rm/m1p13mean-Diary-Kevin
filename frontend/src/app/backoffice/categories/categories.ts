import { Component, inject, signal, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { finalize } from "rxjs";
import { TableModule, TableLazyLoadEvent } from "primeng/table";
import { Drawer } from "primeng/drawer";
import { InputText } from "primeng/inputtext";
import { Textarea } from "primeng/textarea";
import { Button } from "primeng/button";
import { Tag } from "primeng/tag";
import { Fluid } from "primeng/fluid";
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { Tooltip } from "primeng/tooltip";
import { Toast } from "../../core/utils/toast";
import { CategoryService } from "./category.service";
import { Category } from "./category.model";
import { FormField } from "../../shared/form-field";

@Component({
  selector: "app-admin-categories",
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    Drawer,
    InputText,
    Textarea,
    Button,
    Tag,
    Fluid,
    IconField,
    InputIcon,
    Tooltip,
    FormField,
  ],
  templateUrl: "./categories.html",
})
export class AdminCategories implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly toast = inject(Toast);
  private readonly fb = inject(FormBuilder);
  private editingId: string | null = null;
  private currentPage = 1;
  private currentLimit = 10;

  protected readonly categories = signal<Category[]>([]);
  protected readonly totalRecords = signal(0);
  protected readonly loading = signal(false);
  protected readonly dialogVisible = signal(false);
  protected readonly saving = signal(false);
  protected readonly editing = signal(false);
  protected searchValue = "";

  protected readonly form = this.fb.nonNullable.group({
    name: ["", Validators.required],
    description: [""],
  });

  ngOnInit(): void {
    this.loadCategories();
  }

  protected loadCategories(event?: TableLazyLoadEvent): void {
    if (event) {
      this.currentPage = Math.floor((event.first ?? 0) / (event.rows ?? 10)) + 1;
      this.currentLimit = event.rows ?? 10;
    }

    this.loading.set(true);
    this.categoryService
      .list({
        search: this.searchValue || undefined,
        page: this.currentPage,
        limit: this.currentLimit,
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: response => {
          this.categories.set(response.data ?? []);
          this.totalRecords.set((response.meta?.["total"] as number) ?? 0);
        },
        error: () => {
          this.toast.error("Impossible de charger les catégories");
        },
      });
  }

  protected onSearch(): void {
    this.currentPage = 1;
    this.loadCategories();
  }

  protected openCreateDialog(): void {
    this.editing.set(false);
    this.editingId = null;
    this.form.reset();
    this.dialogVisible.set(true);
  }

  protected openEditDialog(category: Category): void {
    this.editing.set(true);
    this.editingId = category.id;
    this.form.patchValue({
      name: category.name,
      description: category.description ?? "",
    });
    this.dialogVisible.set(true);
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
        this.dialogVisible.set(false);
        this.loadCategories();
      },
      error: response => {
        this.toast.error(response.error?.message ?? "Une erreur est survenue");
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
