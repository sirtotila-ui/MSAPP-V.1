import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

function getPhaseAndScale(breathing, elapsed) {
  const { inhale, hold = 0, exhale, hold2 = 0 } = breathing
  const total = inhale + hold + exhale + hold2
  const t = elapsed % total

  let phase = 'OUT'
  let scale = 0.6

  if (t < inhale) {
    phase = 'IN'
    scale = 0.6 + (0.4 * t) / inhale
  } else if (t < inhale + hold) {
    phase = 'HOLD'
    scale = 1
  } else if (t < inhale + hold + exhale) {
    phase = 'OUT'
    const exhaleElapsed = t - inhale - hold
    scale = 1 - (0.4 * exhaleElapsed) / exhale
  } else {
    phase = 'HOLD'
    scale = 0.6
  }

  return { phase, scale }
}

export function BreathingCircle({ breathing, isPlaying, color, size = 'small' }) {
  const [elapsed, setElapsed] = useState(0)
  const isLarge = size === 'large'

  useEffect(() => {
    if (!isPlaying || !breathing) return

    const interval = setInterval(() => {
      setElapsed((prev) => prev + 0.05)
    }, 50)
    return () => clearInterval(interval)
  }, [isPlaying, breathing])

  const { phase, scale } = breathing
    ? getPhaseAndScale(breathing, elapsed)
    : { phase: 'OUT', scale: 0.6 }

  return (
    <div className="flex items-center justify-center flex-shrink-0">
      <motion.div
        className={`rounded-full border-4 flex items-center justify-center ${isLarge ? 'w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72' : 'w-16 h-16 sm:w-20 sm:h-20'}`}
        style={{
          borderColor: color,
          boxShadow: `0 0 16px ${color}40`,
        }}
        animate={{
          scale: isPlaying ? scale : 0.6,
        }}
        transition={{
          duration: 0.15,
          ease: 'easeInOut',
        }}
      >
        <span className={`font-semibold text-white uppercase tracking-wider ${isLarge ? 'text-xl sm:text-2xl' : 'text-xs sm:text-sm'}`}>
          {phase}
        </span>
      </motion.div>
    </div>
  )
}
