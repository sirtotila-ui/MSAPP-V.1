import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getPhaseAndProgress } from '../utils/breathing'

export function BreathingDots({ breathing, isPlaying, color, elapsed: elapsedProp }) {
  const [elapsedLocal, setElapsedLocal] = useState(0)
  const elapsed = elapsedProp ?? elapsedLocal

  useEffect(() => {
    if (!isPlaying || !breathing) return
    if (elapsedProp != null) return
    const interval = setInterval(() => setElapsedLocal((prev) => prev + 0.05), 50)
    return () => clearInterval(interval)
  }, [isPlaying, breathing, elapsedProp])

  if (!breathing || !isPlaying) {
    return (
      <div className="flex gap-2 justify-center">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-2 h-2 rounded-full bg-white/20" />
        ))}
      </div>
    )
  }

  const { phase, progress, phaseDuration } = getPhaseAndProgress(breathing, elapsed)
  const numDots = Math.max(1, Math.round(phaseDuration))

  let filledCount = 0
  const isHold = phase === 'HOLD' || phase === 'HOLD2'

  if (phase === 'IN') {
    filledCount = Math.min(numDots, Math.floor(progress))
  } else if (phase === 'HOLD') {
    filledCount = numDots
  } else if (phase === 'OUT') {
    filledCount = Math.max(0, numDots - Math.floor(progress))
  }
  // HOLD2: filledCount = 0

  return (
    <div className="flex gap-2 sm:gap-3 justify-center items-center flex-wrap">
      {Array.from({ length: numDots }).map((_, i) => {
        const filled = i < filledCount
        const flash = isHold
        return (
          <motion.div
            key={i}
            className="w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
            style={{
              backgroundColor: filled ? color : 'rgba(255,255,255,0.2)',
              opacity: filled ? 1 : 0.3,
              boxShadow: filled ? `0 0 8px ${color}60` : 'none',
            }}
            animate={
              flash
                ? {
                    opacity: filled ? [1, 0.5, 1] : [0.3, 0.15, 0.3],
                    scale: [1, 1.1, 1],
                  }
                : {}
            }
            transition={
              flash ? { duration: 0.6, repeat: Infinity, repeatType: 'reverse' } : {}
            }
          />
        )
      })}
    </div>
  )
}
