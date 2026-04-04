import { Play, Square } from 'lucide-react'
import { motion } from 'framer-motion'

export function PlayerControls({ isPlaying, onTogglePlay, color }) {
  return (
    <motion.button
      type="button"
      onClick={onTogglePlay}
      className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center touch-manipulation min-w-[56px] min-h-[56px]"
      style={{
        backgroundColor: color,
        boxShadow: `0 0 24px ${color}60`,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isPlaying ? 'Stop' : 'Play'}
    >
      {isPlaying ? (
        <Square className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="white" />
      ) : (
        <Play className="w-7 h-7 sm:w-8 sm:h-8 text-white ml-0.5" fill="white" />
      )}
    </motion.button>
  )
}
