import { Leaf, Menu } from 'lucide-react'

export function Navbar({ onScienceClick, onMenuClick }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4 sm:px-6 bg-black/50 backdrop-blur-xl border-b border-white/10">
      <div className="flex items-center gap-2">
        <Leaf className="w-7 h-7 text-white" />
        <span className="font-semibold text-lg text-white text-glow">MindSeeds</span>
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
          className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-sm uppercase tracking-wider transition-colors duration-300 touch-manipulation"
          aria-label="Science"
        >
          Science
        </button>
      </div>
    </nav>
  )
}
