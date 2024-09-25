import * as React from "react";
import Link from "next/link";
import { FaCcMastercard, FaCcPaypal, FaCcVisa } from "react-icons/fa";
import { FaCcApplePay } from "react-icons/fa6";
import { LiaCcAmex } from "react-icons/lia";
import { MdOutlineSecurity } from "react-icons/md";
import { footerLinks } from "@/config/site";
import { cn } from "@/lib/utils";
import { NewsletterForm } from "../forms/newsletter-form";

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn("border-t", className)}>
      <div className="container grid max-w-6xl grid-cols-2 gap-6 py-14 md:grid-cols-5">
        {footerLinks.map((section) => (
          <div key={section.title}>
            <span className="text-sm font-medium text-foreground">
              {section.title}
            </span>
            <ul className="mt-4 list-inside space-y-3">
              {section.items?.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="col-span-full flex flex-col items-end sm:col-span-1 md:col-span-2">
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t py-4">
        <div className="container flex max-w-6xl items-center justify-between">
          {/* <span className="text-muted-foreground text-sm">
            Copyright &copy; 2024. All rights reserved.
          </span> */}
          <p className="text-left text-sm text-muted-foreground">
            Tous droits réservés &copy; {new Date().getFullYear()}.
          </p>

          <div className="flex items-center gap-3">
            <MdOutlineSecurity className="size-6 text-muted-foreground hover:text-indigo-700" />
            <FaCcVisa
              className="size-6 text-muted-foreground hover:text-indigo-700"
              title="Visa"
            />
            <FaCcMastercard
              className="size-6 text-muted-foreground hover:text-indigo-700"
              title="Mastercard"
            />
            <LiaCcAmex
              className="size-6 text-muted-foreground hover:text-indigo-700"
              title="American Express"
            />
            <FaCcPaypal
              className="size-6 text-muted-foreground hover:text-indigo-700"
              title="Paypal"
            />
            <FaCcApplePay
              className="size-6 text-muted-foreground hover:text-indigo-700"
              title="Apple Pay"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
