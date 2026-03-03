import { Routes } from "@angular/router";
import { guestGuard } from "@auth/guards/guest.guard";
import { authGuard } from "@auth/guards/auth.guard";
import { backofficeDispatchGuard } from "@backoffice/backoffice-dispatch.guard";
import { profileGuard } from "@auth/guards/profile.guard";
import { FrontOffice } from "@frontoffice/layout/front-office";

export const routes: Routes = [
  {
    path: "",
    component: FrontOffice,
    children: [
      {
        path: "",
        loadComponent: () => import("@frontoffice/landing/landing").then(m => m.Landing),
      },
      {
        path: "login",
        canActivate: [guestGuard],
        loadComponent: () => import("@auth/login/login").then(m => m.Login),
      },
      {
        path: "register",
        canActivate: [guestGuard],
        loadComponent: () => import("@auth/register/register").then(m => m.Register),
      },
      {
        path: "home",
        canActivate: [authGuard],
        loadComponent: () => import("@frontoffice/home/home").then(m => m.Home),
      },
      {
        path: "shops",
        loadComponent: () => import("@frontoffice/shops/shops").then(m => m.Shops),
      },
      {
        path: "shops/:id",
        loadComponent: () =>
          import("@frontoffice/shops/shop-detail/shop-detail").then(m => m.ShopDetail),
      },
      {
        path: "products",
        loadComponent: () => import("@frontoffice/products/products").then(m => m.Products),
      },
      {
        path: "products/:id",
        loadComponent: () =>
          import("@frontoffice/products/product-detail/product-detail").then(m => m.ProductDetail),
      },
      {
        path: "favorites",
        loadComponent: () => import("@frontoffice/favorites/favorites").then(m => m.Favorites),
      },
      {
        path: "cart",
        loadComponent: () => import("@frontoffice/cart/cart").then(m => m.Cart),
      },
      {
        path: "orders",
        canActivate: [authGuard],
        loadComponent: () => import("@frontoffice/orders/orders").then(m => m.MyOrders),
      },
      {
        path: "profile",
        canActivate: [authGuard],
        loadComponent: () => import("@frontoffice/profile/profile").then(m => m.Profile),
      },
    ],
  },
  {
    path: "backoffice",
    canActivate: [authGuard],
    loadComponent: () => import("@backoffice/layout/back-office").then(m => m.BackOffice),
    children: [
      {
        path: "",
        pathMatch: "full",
        canActivate: [backofficeDispatchGuard],
        children: [],
      },
      {
        path: "admin",
        canActivate: [profileGuard("admin")],
        loadChildren: () => import("@backoffice/admin/admin.routes").then(m => m.adminRoutes),
      },
      {
        path: "shop",
        canActivate: [profileGuard("shop")],
        loadChildren: () => import("@backoffice/shop/shop.routes").then(m => m.shopRoutes),
      },
    ],
  },
];
