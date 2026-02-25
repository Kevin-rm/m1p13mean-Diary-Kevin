export interface SidebarItem {
  label: string;
  icon: string;
  routerLink?: string;
  children?: SidebarItem[];
}

export const SIDEBAR_ITEMS: Record<string, SidebarItem[]> = {
  admin: [
    { label: "Boutiques", icon: "pi pi-shop", routerLink: "/backoffice/admin/shops" },
    { label: "Catégories", icon: "pi pi-tags", routerLink: "/backoffice/admin/categories" },
  ],
  shop: [
    { label: "Tableau de Bord", icon: "pi pi-chart-bar", routerLink: "/backoffice/shop/" },
    { label: "Profile", icon: "pi pi-user", routerLink: "/backoffice/shop/profile" },
    {
      label: "Produits",
      icon: "pi pi-box",
      children: [
        { label: "Liste", icon: "pi pi-list", routerLink: "/backoffice/shop/products" },
        { label: "Nouveau", icon: "pi pi-plus", routerLink: "/backoffice/shop/products/new" },
      ],
    },
  ],
};
