import { Routes } from "@angular/router";
import { permissionGuard } from "@auth/guards/permission.guard";
import { shopRedirectGuard } from "./shop-redirect.guard";

const FORBIDDEN = "/backoffice/shop/forbidden";

export const shopRoutes: Routes = [
  { path: "", canActivate: [shopRedirectGuard], children: [] },
  {
    path: "forbidden",
    loadComponent: () => import("@backoffice/errors/forbidden").then(m => m.Forbidden),
  },
  {
    path: "dashboard",
    canActivate: [permissionGuard("shops:manage", FORBIDDEN)],
    loadComponent: () => import("@backoffice/shop/dashboard/dashboard").then(m => m.ShopDashboard),
  },
  {
    path: "my-shop",
    canActivate: [permissionGuard("shops:manage", FORBIDDEN)],
    loadComponent: () => import("@backoffice/shop/my-shop/my-shop").then(m => m.MyShop),
  },
  {
    path: "members",
    canActivate: [permissionGuard("members:read", FORBIDDEN)],
    loadComponent: () => import("@backoffice/shop/members/members").then(m => m.ShopMembers),
  },
  {
    path: "products",
    canActivate: [permissionGuard("products:read", FORBIDDEN)],
    loadComponent: () =>
      import("@backoffice/shop/products/product-list/product-list").then(m => m.ShopProductList),
  },
  {
    path: "products/new",
    canActivate: [permissionGuard("products:write", FORBIDDEN)],
    loadComponent: () =>
      import("@backoffice/shop/products/product-form/product-form").then(m => m.ShopProductForm),
  },
  {
    path: "products/:id",
    canActivate: [permissionGuard("products:read", FORBIDDEN)],
    loadComponent: () =>
      import("@backoffice/shop/products/product-record/product-record").then(
        m => m.ShopProductRecord,
      ),
  },
  {
    path: "inventory",
    loadComponent: () => import("@backoffice/shop/inventory/inventory").then(m => m.ShopInventory),
  },
  {
    path: "orders",
    loadComponent: () => import("@backoffice/shop/orders/orders").then(m => m.ShopOrders),
  },
  {
    path: "orders/new",
    loadComponent: () => import("@backoffice/shop/orders/order-form").then(m => m.ShopOrderForm),
  },
];
