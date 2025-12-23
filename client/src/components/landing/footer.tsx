export function Footer() {
  return (
    <footer className="relative border-t border-glass-border bg-bg-dark-base py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Links */}
          <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm">
            <a
              href="https://github.com/rupeshpiwal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-gray-muted hover:text-neon-purple transition-colors"
            >
              GitHub
            </a>
            <a
              href="/dashboard"
              className="text-text-gray-muted hover:text-neon-purple transition-colors"
            >
              Live Demo
            </a>
            <a
              href="https://github.com/rupeshpiwal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-gray-muted hover:text-neon-purple transition-colors"
            >
              Portfolio
            </a>
          </div>

          {/* Credit */}
          <div className="text-sm text-text-gray-muted">
            Built by{" "}
            <a
              href="https://github.com/rupeshpiwal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-purple hover:text-electric-blue transition-colors font-medium"
            >
              Rupesh Piwal
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}