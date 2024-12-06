import { SidebarNavItem, SiteConfig } from "types";
import { env } from "@/env.mjs";

const site_url = env.NEXT_PUBLIC_APP_URL;

export const siteConfig: SiteConfig = {
  name: "Sotacib",
  description: "Créez rapidement des factures et devis professionnels.",
  url: site_url,
  ogImage: `${site_url}/_static/og.jpg`,
  links: {
    twitter: "https://twitter.com/Sotacib",
    github: "https://github.com/Sotacib",
  },
  mailSupport: "info@Sotacib.com",
};

export const footerLinks: SidebarNavItem[] = [
  {
    title: "Company",
    items: [
      { title: "About", href: "#" },
      { title: "Terms", href: "/terms" },
      { title: "Privacy", href: "/privacy" },
    ],
  },
  {
    title: "Product",
    items: [
      { title: "Security", href: "#" },
      { title: "Customization", href: "#" },
      { title: "Customers", href: "#" },
    ],
  },
  {
    title: "Comment?",
    items: [
      { title: "Comment creer une facture?", href: "#" },
      { title: "Comment creer un devis?", href: "#" },
      { title: "Comment envoyer une facture?", href: "#" },
      { title: "Comment ajouter un client?", href: "#" },
    ],
  },
];
