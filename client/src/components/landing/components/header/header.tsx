"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useScroll } from "./hooks/use-scroll";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import Link from "next/link";

export const navLinks = [
  {
    label: "Solution",
    href: "#solution",
  },
  {
    label: "Case Studies",
    href: "#case-studies",
  },
];

export function Header() {
  const scrolled = useScroll(50);

  return (
    <header className="sticky top-4 z-50 mx-auto w-full px-4 transition-all duration-300 ease-out md:top-6 md:px-6">
      <nav
        className={cn(
          "mx-auto flex h-16 w-full max-w-7xl items-center justify-between rounded-lg border border-gray-400/20 bg-black/50 px-6 backdrop-blur-md transition-all duration-300 ease-out md:px-8",
          {
            "h-14": scrolled,
          },
        )}
      >
        <Link className="flex items-center" href="/">
          <Logo />
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link, i) => (
            <Link
              className="text-sm font-normal text-gray-300 transition-colors hover:text-white"
              href={link.href}
              key={i}
            >
              {link.label}
            </Link>
          ))}
          <Link
            className="rounded-md bg-white px-6 py-2 text-sm font-semibold text-black transition-all duration-200 ease-in-out hover:bg-gray-100 hover:shadow-lg active:scale-95"
            href="/sign-in"
          >
            Get Started
          </Link>
        </div>
        <MobileNav />
      </nav>
    </header>
  );
}
