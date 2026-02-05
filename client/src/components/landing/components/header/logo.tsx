import type React from "react";
import { Aperture, Atom } from "lucide-react";

/* ---------------------------------------------------------
   Logo Icon — Atom/Physics Icon
---------------------------------------------------------- */
export const LogoIcon = (props: React.ComponentProps<typeof Atom>) => (
  <Atom {...props} />
);

/* ---------------------------------------------------------
   Full Logo — Icon + Wordmark (inviscid ai)
---------------------------------------------------------- */
export const Logo = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div className={`flex items-center gap-2 ${className || ""}`} {...props}>
    <Aperture className="h-6 w-6 text-slate-500" strokeWidth={1.5} />
    <span className="text-lg font-medium tracking-tight text-white">
      VidVault
    </span>
  </div>
);
