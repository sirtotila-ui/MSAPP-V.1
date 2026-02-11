import { Leaf } from 'lucide-react'

export function Navbar({ onSettingsClick }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4 sm:px-6 bg-black/50 backdrop-blur-xl border-b border-white/10">
      <div className="flex items-center gap-2">
        <span className="text-2xl" role="img" aria-label="Brain">🧠</span>
        <span className="font-semibold text-lg text-white text-glow">MindSeeds</span>
      </div>
      <button
        type="button"
        onClick={onSettingsClick}
        className="p-2 rounded-full hover:bg-white/10 transition-colors duration-300 touch-manipulation"
        aria-label="Menu pacchetti"
      >
        <Leaf className="w-5 h-5 text-white" />
      </button>
    </nav>
  )
}
