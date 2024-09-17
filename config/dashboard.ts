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
      { href: "/dashboard", icon: "dashboard", title: "Dashboard" },
      {
        href: "/dashboard/scope-of-work",
        icon: "handshake",
        title: "Scope of Work",
      },
      { href: "/dashboard/documents", icon: "page", title: "Documents" },
      {
        href: "/dashboard/clients",
        icon: "smilePlus",
        title: "Clients",
      },
      {
        href: "/dashboard/billing",
        icon: "billing",
        title: "Billing",
        authorizeOnly: UserRole.USER,
      },
      // { href: "/dashboard/charts", icon: "lineChart", title: "Charts" },
      // {
      //   href: "/admin/orders",
      //   icon: "package",
      //   title: "Orders",
      //   badge: 2,
      //   authorizeOnly: UserRole.ADMIN,
      // },
      {
        href: "#/dashboard/posts",
        icon: "post",
        title: "User Posts",
        authorizeOnly: UserRole.USER,
        disabled: true,
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
