import { Routes } from "@angular/router";
import { guestGuard } from "./auth/guest.guard";
import { PublicLayout } from "./layouts/public-layout/public-layout";

export const routes: Routes = [
  {
    path: "",
    component: PublicLayout,
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
    ],
  },
];
