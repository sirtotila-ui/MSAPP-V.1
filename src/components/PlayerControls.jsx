import { Pause, Play, Square } from 'lucide-react'
import { motion } from 'framer-motion'

export function PlayerControls({ sessionState, onPlayPause, onStop, color }) {
  const isActive = sessionState !== 'idle'
  const isPlaying = sessionState === 'playing'

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-3 w-full sm:w-auto pt-1 sm:pt-0">
      <motion.button
        type="button"
        onClick={onPlayPause}
        className="relative w-16 h-16 sm:w-16 sm:h-16 rounded-full flex items-center justify-center touch-manipulation min-w-[64px] min-h-[64px] sm:min-w-[56px] sm:min-h-[56px]"
        style={{
          backgroundColor: color,
          boxShadow: `0 0 24px ${color}60`,
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <Pause className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="white" />
        ) : (
          <Play className="w-7 h-7 sm:w-8 sm:h-8 text-white ml-0.5" fill="white" />
        )}
      </motion.button>
      {isActive && (
        <motion.button
          type="button"
          onClick={onStop}
          className="w-12 h-12 sm:w-11 sm:h-11 rounded-2xl border border-white/10 bg-white/6 text-white/80 flex items-center justify-center"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          aria-label="Stop"
        >
          <Square className="w-4 h-4 text-white" fill="white" />
        </motion.button>
      )}
    </div>
  )
}
