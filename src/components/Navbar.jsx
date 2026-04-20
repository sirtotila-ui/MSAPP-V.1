import { Menu } from 'lucide-react'

export function Navbar({ onScienceClick, onMenuClick }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 sm:h-16 flex items-center justify-between px-3 sm:px-6 bg-black/45 backdrop-blur-2xl border-b border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-base sm:text-lg text-white text-glow tracking-[0.08em]">MindSeeds</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-full hover:bg-white/10 transition-colors touch-manipulation"
          aria-label="Menu"
        >
          <Menu className="w-5 h-5 text-white" />
        </button>
        <button
          type="button"
          onClick={onScienceClick}
          className="px-3 sm:px-4 py-2 rounded-full border border-white/15 bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm uppercase tracking-[0.18em] sm:tracking-wider transition-colors duration-300 touch-manipulation"
          aria-label="Science"
        >
          Science
        </button>
      </div>
    </nav>
  )
}
