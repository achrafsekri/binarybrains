import { UserRole } from "@prisma/client";

import { SidebarNavItem } from "types";

export const sidebarLinks: SidebarNavItem[] = [
  {
    title: "MENU",
    items: [
      // {
      //   href: "/admin",
      //   icon: "laptop",
      //   title: "Admin Panel",
      //   authorizeOnly: UserRole.ADMIN,
      // },
      { href: "/dashboard", icon: "dashboard", title: "Tableau de bord" },
      { href: "/dashboard/clients", icon: "users", title: "Clients" },
      {
        href: "/dashboard/invoices",
        icon: "handshake",
        title: "Facture",
      },
      { href: "/dashboard/quotes", icon: "page", title: "Devis" },
      {
        href: "/dashboard/billing",
        icon: "billing",
        title: "Billing",
        authorizeOnly: UserRole.USER,
      },

      // {
      //   href: "#/dashboard/posts",
      //   icon: "post",
      //   title: "User Posts",
      //   authorizeOnly: UserRole.USER,
      //   disabled: true,
      // },
    ],
  },
  {
    title: "Options",
    items: [
      {
        href: "/admin/team",
        icon: "users",
        title: "Team",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "#",
        icon: "messages",
        title: "Support",
        authorizeOnly: UserRole.USER,
        disabled: true,
      },
      {
        href: "/admin/billing",
        icon: "billing",
        title: "Billing",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/admin/settings",
        icon: "settings",
        title: "Settings",
        authorizeOnly: UserRole.ADMIN,
      },
    ],
  },
];
