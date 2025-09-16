export const SVGLogo = () => (
  <svg
    className="w-8 h-8"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Background circle with subtle gradient */}
    <circle
      cx="50"
      cy="50"
      r="40"
      fill="url(#logoGradient)"
      stroke="url(#borderGradient)"
      strokeWidth="2"
    />

    {/* Play icon */}
    <path d="M42 35L62 50L42 65Z" fill="url(#iconGradient)" />

    {/* Gradient definitions */}
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2B2C2D" />
        <stop offset="100%" stopColor="#383838" />
      </linearGradient>

      <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8C8C8C" />
        <stop offset="100%" stopColor="#606060" />
      </linearGradient>

      <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#606060" />
        <stop offset="100%" stopColor="#8C8C8C" />
      </linearGradient>
    </defs>
  </svg>
);

export default SVGLogo;
