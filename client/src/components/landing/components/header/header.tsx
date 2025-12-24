"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useScroll } from "./hooks/use-scroll";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import Link from "next/link";


export const navLinks = [
  {
    label: "Videos",
    href: "/dashboard",
  },
];

export function Header() {
  const scrolled = useScroll(10);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 mx-auto w-full max-w-4xl border-transparent border-b md:rounded-md md:border md:transition-all md:ease-out",
        {
          "border-border bg-background/95 backdrop-blur-lg supports-backdrop-filter:bg-background/50 md:top-2 md:max-w-3xl md:shadow":
            scrolled,
        }
      )}
    >
      <nav
        className={cn(
          "flex h-14 w-full items-center justify-between px-4 md:h-12 md:transition-all md:ease-out",
          {
            "md:px-2": scrolled,
          }
        )}
      >
        <Link className="rounded-md p-2" href="/">
          <Logo className="h-4.5" />
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link, i) => (
            <Link
              className={buttonVariants({ variant: "ghost" })}
              href={link.href}
              key={i}
            >
              {link.label}
            </Link>
          ))}
          <Link
            className="bg-white text-black font-semibold text-[14px] px-2.5 py-1 rounded
             transition-all duration-300 ease-in-out
             hover:bg-gray-300 hover:scale-105 hover:shadow-md
             active:scale-95"
            href="/sign-in"
          >
            Sign In
          </Link>
        </div>
        <MobileNav />
      </nav>
    </header>
  );
}
