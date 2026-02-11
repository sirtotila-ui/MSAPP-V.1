/**
 * Icona metronomo - forma classica con corpo triangolare e braccio oscillante
 */
export function MetronomeIcon({ className, size = 24 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Corpo triangolare */}
      <path d="M12 2l8 18H4L12 2z" />
      {/* Braccio/pendolo centrale */}
      <path d="M12 6v4" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  )
}
