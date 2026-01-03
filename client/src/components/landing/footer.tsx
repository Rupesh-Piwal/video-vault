import { GitHubLogoIcon } from "@radix-ui/react-icons";

export function Footer() {
  return (
    <footer className="relative border-t border-glass-border bg-bg-dark-base py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Links */}
          <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm">
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
          <div className="text-sm text-text-gray-muted">
            Built by{" "}
            <a
              href="https://rpiwal.vercel.app//github.com/rupeshpiwal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-slate-300 transition-colors font-medium text-underline"
            >
              Rupesh Piwal
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
