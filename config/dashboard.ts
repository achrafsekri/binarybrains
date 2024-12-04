import { UserRole } from "@prisma/client";

import { SidebarNavItem } from "types";

export const sidebarLinks: SidebarNavItem[] = [
  {
    title: "MENU",
    items: [
      {
        href: "/admin",
        icon: "laptop",
        title: "Admin Panel",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/dashboard",
        icon: "dashboard",
        title: "Tableau de bord",
        authorizeOnly: UserRole.USER,
      },
      {
        href: "/dashboard/points-de-vente",
        icon: "mapPin",
        title: "Points de vente",
      },

      {
        href: "/dashboard/visites",
        icon: "calendar",
        title: "Mes visites",
        authorizeOnly: UserRole.USER,
      },
      {
        href: "/admin/commerciaux",
        icon: "users",
        title: "Commerciaux",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/dashboard/stats",
        icon: "lineChart",
        title: "Statistiques",
      },
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
