import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-glass-border bg-bg-dark-base py-2 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-row justify-between items-center">
          {/* Links */}
          <div className="flex md:justify-center gap-6 text-sm">
            <a
              href="https://github.com/Rupesh-Piwal/video-vault/blob/main/README.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-gray-muted transition-colors"
            >
              <GitHubLogoIcon fontSize={36} />
            </a>
          </div>

          {/* Credit */}
          <div className="text-sm text-text-gray-muted border border-glass-border px-4 py-2 rounded-md bg-[#151414] flex flex-row items-center gap-1">
            Built by{" "}
            <a
              href="https://rpiwal.vercel.app//github.com/rupeshpiwal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-slate-300 transition-colors font-medium text-underline flex flex-row items-center gap-1 "
            >
              Rupesh Piwal <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
