import {
  Component,
  Directive,
  TemplateRef,
  contentChildren,
  inject,
  input,
  signal,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgTemplateOutlet } from "@angular/common";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "primeng/tabs";
import { PageHeader } from "./page-header";

@Directive({
  selector: "ng-template[recordTab]",
})
export class RecordPageTab {
  label = input.required<string>({ alias: "recordTab" });
  templateRef = inject(TemplateRef);
}

@Component({
  selector: "app-record-page",
  imports: [NgTemplateOutlet, Tabs, TabList, Tab, TabPanels, TabPanel, PageHeader],
  template: `
    <app-page-header [title]="title()" [back]="true">
      <ng-content select="[actions]" />
    </app-page-header>

    @if (loading()) {
      <div class="flex justify-center items-center flex-1" style="min-height: calc(100vh - 12rem)">
        <i class="pi pi-spin pi-spinner text-muted-color" style="font-size: 2rem"></i>
      </div>
    } @else {
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
