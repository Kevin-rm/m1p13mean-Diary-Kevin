import { Routes } from "@angular/router";
import { permissionGuard } from "@auth/guards/permission.guard";

export const adminRoutes: Routes = [
  {
    path: "",
    redirectTo: "shops",
    pathMatch: "full",
  },
  {
    path: "shops",
    canActivate: [permissionGuard("shops:validate")],
    loadComponent: () => import("@backoffice/admin/shops/shops").then(m => m.AdminShops),
  },
  {
    path: "categories",
    canActivate: [permissionGuard("categories:write")],
    loadComponent: () =>
      import("@backoffice/admin/categories/categories").then(m => m.AdminCategories),
  },
];
