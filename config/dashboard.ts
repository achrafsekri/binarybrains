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
        href: "/dashboard/visits",
        icon: "calendar",
        title: "Mes visites",
        authorizeOnly: UserRole.USER,
      },
      {
        href: "/dashboard/planning",
        icon: "planning",
        title: "Planning",
      },
      {
        href: "/dashboard/stats",
        icon: "lineChart",
        title: "Statistiques",
      },
    ],
  },
  {
    title: "Administration",
    items: [
      {
        href: "/admin/commerciaux",
        icon: "users",
        title: "Commerciaux",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/admin/visits",
        icon: "calendar",
        title: "Visites",
        authorizeOnly: UserRole.ADMIN,
      },
    ],
  },
];
