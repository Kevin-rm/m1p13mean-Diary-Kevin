import { Routes } from "@angular/router";
import { guestGuard } from "./auth/guest.guard";
import { authGuard } from "./auth/auth.guard";
import { profileGuard } from "./auth/profile.guard";
import { permissionGuard } from "./auth/permission.guard";
import { FrontOffice } from "./layouts/front-office/front-office";

export const routes: Routes = [
  {
    path: "",
    component: FrontOffice,
    children: [
      {
        path: "",
        loadComponent: () => import("./landing/landing").then(m => m.Landing),
      },
      {
        path: "login",
        canActivate: [guestGuard],
        loadComponent: () => import("./auth/login/login").then(m => m.Login),
      },
      {
        path: "register",
        canActivate: [guestGuard],
        loadComponent: () => import("./auth/register/register").then(m => m.Register),
      },
      {
        path: "shops",
        loadComponent: () => import("./shops/shops").then(m => m.Shops),
      },
      {
        path: "products",
        loadComponent: () => import("./products/products").then(m => m.Products),
      },
      {
        path: "categories",
        loadComponent: () => import("./categories/categories").then(m => m.Categories),
      },
      {
        path: "profile",
        canActivate: [authGuard],
        loadComponent: () => import("./profile/profile").then(m => m.Profile),
      },
    ],
  },
  {
    path: "admin",
    canActivate: [authGuard, profileGuard("admin")],
    loadComponent: () => import("./layouts/back-office/back-office").then(m => m.BackOffice),
    children: [
      {
        path: "",
        redirectTo: "categories",
        pathMatch: "full",
      },
      {
        path: "categories",
        canActivate: [permissionGuard("categories:write")],
        loadComponent: () =>
          import("./backoffice/categories/categories").then(m => m.AdminCategories),
      },
    ],
  },
];
