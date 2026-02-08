import { Routes } from "@angular/router";
import { guestGuard } from "./auth/guest.guard";
import { Landing } from "./landing/landing";

export const routes: Routes = [
  { path: "", component: Landing },
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
];
