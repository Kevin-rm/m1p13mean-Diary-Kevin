import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  TemplateRef,
  contentChildren,
  inject,
  input,
  output,
  signal,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgTemplateOutlet } from "@angular/common";
import { Image } from "primeng/image";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "primeng/tabs";
import { PageHeader } from "./page-header";
import { Loader } from "@shared/components/loader";

@Directive({
  selector: "ng-template[recordTab]",
})
export class RecordPageTab {
  label = input.required<string>({ alias: "recordTab" });
  templateRef = inject(TemplateRef);
}

@Component({
  selector: "app-record-page",
  imports: [NgTemplateOutlet, Image, Tabs, TabList, Tab, TabPanels, TabPanel, PageHeader, Loader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-header [title]="title()" [back]="true">
      <ng-content select="[actions]" />
    </app-page-header>

    @if (loading()) {
      <div class="flex justify-center items-center flex-1" style="min-height: calc(100vh - 12rem)">
        <app-loader />
      </div>
    } @else {
      @if (showImage()) {
        <div class="flex items-center gap-5 mb-6">
          <div class="relative group inline-block shrink-0">
            @if (image()) {
              <p-image
                [src]="image()"
                [alt]="title()"
                [preview]="true"
                imageClass="size-28 rounded-2xl object-cover border border-surface shadow-sm"
              />
            } @else {
              <div
                class="size-28 rounded-2xl bg-surface-100 flex items-center justify-center border border-surface"
              >
                <i class="pi pi-image text-4xl text-muted-color"></i>
              </div>
            }
            <button
              type="button"
              class="absolute bottom-0 right-0 flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-contrast border-2 border-surface cursor-pointer"
              (click)="imageClick.emit()"
            >
              <i class="pi pi-camera text-xs"></i>
            </button>
          </div>
          <div>
            <h2 class="text-xl font-semibold m-0">{{ heading() }}</h2>
            @if (subheading()) {
              <p class="text-muted-color mt-1 mb-0">{{ subheading() }}</p>
            }
          </div>
        </div>
      }
      <p-tabs [value]="activeTab()">
        <p-tablist>
          <p-tab [value]="defaultTabLabel()" (click)="onTabClick(defaultTabLabel())">{{
            defaultTabLabel()
          }}</p-tab>
          @for (tab of extraTabs(); track tab.label()) {
            <p-tab [value]="tab.label()" (click)="onTabClick(tab.label())">{{ tab.label() }}</p-tab>
          }
        </p-tablist>
        <p-tabpanels>
          <p-tabpanel [value]="defaultTabLabel()">
            <ng-content />
          </p-tabpanel>
          @for (tab of extraTabs(); track tab.label()) {
            <p-tabpanel [value]="tab.label()">
              <ng-container [ngTemplateOutlet]="tab.templateRef" />
            </p-tabpanel>
          }
        </p-tabpanels>
      </p-tabs>
    }
  `,
})
export class RecordPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly extraTabs = contentChildren(RecordPageTab);
  protected readonly activeTab = signal<string | number>(
    this.route.snapshot.queryParams["tab"] || "Informations",
  );

  title = input.required<string>();
  loading = input(false);
  defaultTabLabel = input("Informations");
  heading = input("");
  subheading = input("");
  showImage = input(false);
  image = input("");
  imageClick = output();

  protected onTabClick(label: string): void {
    this.activeTab.set(label);
    const isDefault = label === this.defaultTabLabel();
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: isDefault ? undefined : label },
      queryParamsHandling: "merge",
      replaceUrl: true,
    });
  }
}
