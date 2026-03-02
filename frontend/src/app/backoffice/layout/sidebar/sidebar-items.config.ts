export interface SidebarItem {
  label: string;
  icon: string;
  routerLink?: string;
  permission?: string;
  children?: SidebarItem[];
}

export interface SidebarSection {
  title?: string;
  items: SidebarItem[];
}

export const canAccessItem =
  (checkPermission: (p: string) => boolean) =>
  (item: SidebarItem): boolean =>
    !item.permission || checkPermission(item.permission);

export const SIDEBAR_ITEMS: Record<string, SidebarSection[]> = {
  admin: [
    {
      items: [
        { label: "Boutiques", icon: "pi pi-shop", routerLink: "/backoffice/admin/shops" },
        { label: "Catégories", icon: "pi pi-tags", routerLink: "/backoffice/admin/categories" },
      ],
    },
  ],
  shop: [
    {
      title: "Général",
      items: [
        {
          label: "Tableau de bord",
          icon: "pi pi-chart-bar",
          routerLink: "/backoffice/shop/dashboard",
          permission: "shops:manage",
        },
        {
          label: "Ma boutique",
          icon: "pi pi-shop",
          routerLink: "/backoffice/shop/my-shop",
          permission: "shops:manage",
        },
        {
          label: "Membres",
          icon: "pi pi-users",
          routerLink: "/backoffice/shop/members",
          permission: "members:read",
        },
      ],
    },
    {
      title: "Gestion",
      items: [
        {
          label: "Produits",
          icon: "pi pi-box",
          children: [
            { label: "Liste", icon: "pi pi-list", routerLink: "/backoffice/shop/products" },
            {
              label: "Nouveau",
              icon: "pi pi-plus",
              routerLink: "/backoffice/shop/products/new",
              permission: "products:write",
            },
          ],
        },
        {
          label: "Stock",
          icon: "pi pi-arrow-right-arrow-left",
          children: [
            {
              label: "Liste",
              icon: "pi pi-list",
              routerLink: "/backoffice/shop/stock-movements",
            },
            {
              label: "Nouveau",
              icon: "pi pi-plus",
              routerLink: "/backoffice/shop/stock-movements/new",
              permission: "products:write",
            },
          ],
        },
      ],
    },
    {
      title: "Ventes",
      items: [
        {
          label: "Commandes",
          icon: "pi pi-shopping-cart",
          children: [
            { label: "Liste", icon: "pi pi-list", routerLink: "/backoffice/shop/orders" },
            {
              label: "Nouvelle",
              icon: "pi pi-plus",
              routerLink: "/backoffice/shop/orders/new",
              permission: "orders:manage",
            },
          ],
        },
      ],
    },
  ],
};
