import { Settings } from 'lucide-react'

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4 sm:px-6 bg-white/80 backdrop-blur-xl border-b border-black/5">
      <div className="flex items-center gap-2">
        <span className="text-2xl" role="img" aria-label="Brain">🧠</span>
        <span className="font-semibold text-lg text-black text-glow">MindSeeds</span>
      </div>
      <button
        type="button"
        className="p-2 rounded-full hover:bg-black/5 transition-colors duration-300 touch-manipulation"
        aria-label="Impostazioni"
      >
        <Settings className="w-5 h-5 text-black" />
      </button>
    </nav>
  )
}
