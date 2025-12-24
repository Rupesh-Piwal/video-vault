import type React from "react";

/* ---------------------------------------------------------
   Logo Icon — Minimal, Modern, Scales Perfectly
---------------------------------------------------------- */
export const LogoIcon = (props: React.ComponentProps<"svg">) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    {/* Video container */}
    <rect x="3" y="5" width="18" height="14" rx="4" />

    {/* Play symbol */}
    <path d="M11 9.5L15 12L11 14.5Z" fill="currentColor" stroke="none" />
  </svg>
);

/* ---------------------------------------------------------
   Full Logo — Icon + Wordmark (VidVault)
---------------------------------------------------------- */
export const Logo = (props: React.ComponentProps<"svg">) => (
  <svg
    viewBox="0 0 160 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    {...props}
  >
    {/* Icon */}
    <g>
      <rect
        x="1.5"
        y="5"
        width="18"
        height="14"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M9.8 9.5L13.8 12L9.8 14.5Z" fill="currentColor" />
    </g>

    {/* Wordmark */}
    <text
      x="28"
      y="17"
      fill="currentColor"
      fontSize="18"
      fontWeight="500"
      fontFamily="Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
      letterSpacing="-0.015em"
    >
      VidVault
    </text>
  </svg>
);
