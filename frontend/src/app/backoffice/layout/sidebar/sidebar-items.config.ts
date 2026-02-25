export interface SidebarItem {
  label: string;
  icon: string;
  routerLink: string;
}

export const BACKOFFICE_SIDEBAR_ITEMS: Record<string, SidebarItem[]> = {
  admin: [
    { label: "Boutiques", icon: "pi pi-shop", routerLink: "/backoffice/admin/shops" },
    { label: "Catégories", icon: "pi pi-tags", routerLink: "/backoffice/admin/categories" },
  ],
  shop: [{ label: "Produits", icon: "pi pi-box", routerLink: "/backoffice/shop/products" }],
};
