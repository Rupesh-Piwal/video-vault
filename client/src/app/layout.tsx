import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const dynamic = "force-dynamic";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-space-grotesk",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "VidVault - Production-Ready Video Platform",
  description:
    "Upload. Process. Share. At Scale. A production-ready video platform with multipart uploads, background workers, and secure share links.",
  keywords: [
    "video platform",
    "video upload",
    "video processing",
    "video sharing",
    "multipart upload",
    "video infrastructure",
    "video workers",
    "secure share links",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#fff",
              color: "#374151",
              boxShadow:
                "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              borderRadius: "0.5rem",
              border: "1px solid #e5e7eb",
              padding: "0.75rem",
            },
            success: {
              duration: 4000,
              iconTheme: {
                primary: "#10b981",
                secondary: "#fff",
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
            loading: {
              duration: Infinity,
            },
          }}
        />
      </body>
    </html>
  );
}
