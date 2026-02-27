export interface SidebarItem {
  label: string;
  icon: string;
  routerLink?: string;
  children?: SidebarItem[];
}

export interface SidebarSection {
  title?: string;
  items: SidebarItem[];
}

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
        },
        { label: "Ma boutique", icon: "pi pi-shop", routerLink: "/backoffice/shop/my-shop" },
        { label: "Membres", icon: "pi pi-users", routerLink: "/backoffice/shop/members" },
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
            { label: "Nouveau", icon: "pi pi-plus", routerLink: "/backoffice/shop/products/new" },
          ],
        },
        { label: "Inventaire", icon: "pi pi-warehouse", routerLink: "/backoffice/shop/inventory" },
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
            { label: "Nouvelle", icon: "pi pi-plus", routerLink: "/backoffice/shop/orders/new" },
          ],
        },
      ],
    },
  ],
};
