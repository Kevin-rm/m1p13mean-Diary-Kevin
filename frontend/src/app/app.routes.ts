import { Routes } from "@angular/router";
import { guestGuard } from "@auth/guards/guest.guard";
import { authGuard } from "@auth/guards/auth.guard";
import { backofficeRedirectGuard } from "@auth/guards/backoffice-redirect.guard";
import { profileGuard } from "@auth/guards/profile.guard";
import { permissionGuard } from "@auth/guards/permission.guard";
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
        path: "shops",
        loadComponent: () => import("@frontoffice/shops/shops").then(m => m.Shops),
      },
      {
        path: "products",
        loadComponent: () => import("@frontoffice/products/products").then(m => m.Products),
      },
      {
        path: "categories",
        loadComponent: () => import("@frontoffice/categories/categories").then(m => m.Categories),
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
        canActivate: [backofficeRedirectGuard],
        children: [],
      },
      {
        path: "admin",
        canActivate: [profileGuard("admin")],
        children: [
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
        ],
      },
      {
        path: "shop",
        canActivate: [profileGuard("shop")],
        children: [
          { path: "", redirectTo: "dashboard", pathMatch: "full" },
          {
            path: "dashboard",
            canActivate: [permissionGuard("shop:settings")],
            loadComponent: () =>
              import("@backoffice/shop/dashboard/dashboard").then(m => m.ShopDashboard),
          },
          {
            path: "my-shop",
            canActivate: [permissionGuard("shop:settings")],
            loadComponent: () => import("@backoffice/shop/my-shop/my-shop").then(m => m.MyShop),
          },
          {
            path: "members",
            loadComponent: () =>
              import("@backoffice/shop/members/members").then(m => m.ShopMembers),
          },
          {
            path: "products",
            canActivate: [permissionGuard("products:read")],
            loadComponent: () =>
              import("@backoffice/shop/products/product-list/product-list").then(
                m => m.ShopProductList,
              ),
          },
          {
            path: "products/new",
            canActivate: [permissionGuard("products:write")],
            loadComponent: () =>
              import("@backoffice/shop/products/product-form/product-form").then(
                m => m.ShopProductForm,
              ),
          },
          {
            path: "products/:id",
            canActivate: [permissionGuard("products:read")],
            loadComponent: () =>
              import("@backoffice/shop/products/product-record/product-record").then(
                m => m.ShopProductRecord,
              ),
          },
          {
            path: "inventory",
            loadComponent: () =>
              import("@backoffice/shop/inventory/inventory").then(m => m.ShopInventory),
          },
          {
            path: "orders",
            loadComponent: () => import("@backoffice/shop/orders/orders").then(m => m.ShopOrders),
          },
          {
            path: "orders/new",
            loadComponent: () =>
              import("@backoffice/shop/orders/order-form").then(m => m.ShopOrderForm),
          },
        ],
      },
    ],
  },
];
