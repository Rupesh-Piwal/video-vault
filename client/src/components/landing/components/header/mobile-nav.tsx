import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, MenuIcon, XIcon } from "lucide-react";
import React from "react";
import { createPortal } from "react-dom";
import { useMediaQuery } from "./hooks/use-media-query";
import { navLinks } from "./header";
import Link from "next/link";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const { isMobile } = useMediaQuery();

  // 🚫 Disable body scroll when open
  React.useEffect(() => {
    if (open && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    // Cleanup on unmount too
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, isMobile]);

  return (
    <>
      <Button
        aria-controls="mobile-menu"
        aria-expanded={open}
        aria-label="Toggle menu"
        className="md:hidden"
        onClick={() => setOpen(!open)}
        size="icon"
        variant="outline"
      >
        {open ? (
          <XIcon className="size-4.5" />
        ) : (
          <MenuIcon className="size-4.5" />
        )}
      </Button>
      {open &&
        createPortal(
          <div
            className={cn(
              "bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50",
              "fixed top-14 right-0 bottom-0 left-0 z-40 flex flex-col overflow-hidden border-t md:hidden"
            )}
            id="mobile-menu"
          >
            <div
              className={cn(
                "data-[slot=open]:zoom-in-97 ease-out data-[slot=open]:animate-in",
                "size-full p-4"
              )}
              data-slot={open ? "open" : "closed"}
            >
              <div className="grid gap-y-2">
                {navLinks.map((link) => (
                  <Link
                    className={buttonVariants({
                      variant: "ghost",
                      className: "justify-start",
                    })}
                    href={link.href}
                    key={link.label}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="mt-12 flex flex-col gap-2">
                <Link
                  className="bg-white text-black font-semibold text-sm px-4 py-2.5 rounded-md text-center flex flex-row gap-2 justify-center items-center"
                  href="/sign-in"
                >
                  Get Started
                  <span>
                    <ArrowRight size={16} />
                  </span>
                </Link>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
