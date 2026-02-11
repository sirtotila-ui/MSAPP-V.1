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

export function BreathingCircle({ breathing, isPlaying, color }) {
  const [elapsed, setElapsed] = useState(0)

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
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 flex items-center justify-center"
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
        <span className="text-xs sm:text-sm font-semibold text-black uppercase tracking-wider">
          {phase}
        </span>
      </motion.div>
    </div>
  )
}
