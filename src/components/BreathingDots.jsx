import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

function getPhaseAndProgress(breathing, elapsed) {
  const { inhale, hold = 0, exhale, hold2 = 0 } = breathing
  const total = inhale + hold + exhale + hold2
  const t = elapsed % total

  if (t < inhale) {
    return { phase: 'IN', progress: t, phaseDuration: inhale }
  }
  if (t < inhale + hold) {
    return { phase: 'HOLD', progress: t - inhale, phaseDuration: hold }
  }
  if (t < inhale + hold + exhale) {
    return { phase: 'OUT', progress: t - inhale - hold, phaseDuration: exhale }
  }
  return { phase: 'HOLD2', progress: t - inhale - hold - exhale, phaseDuration: hold2 }
}

export function BreathingDots({ breathing, isPlaying, color }) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!isPlaying || !breathing) return
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 0.05)
    }, 50)
    return () => clearInterval(interval)
  }, [isPlaying, breathing])

  if (!breathing || !isPlaying) {
    return (
      <div className="flex gap-2 justify-center">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-white/20"
          />
        ))}
      </div>
    )
  }

  const { phase, progress, phaseDuration } = getPhaseAndProgress(breathing, elapsed)
  const { inhale } = breathing
  const numDots = Math.max(1, Math.round(inhale))

  let filledCount = 0
  let opacity = 1
  let tremble = false

  if (phase === 'IN') {
    filledCount = Math.min(numDots, Math.floor(progress))
  } else if (phase === 'HOLD') {
    filledCount = numDots
    tremble = true
  } else if (phase === 'OUT') {
    filledCount = numDots
    opacity = Math.max(0, 1 - progress / phaseDuration)
  } else {
    // HOLD2: pallini vuoti o svuotati
    filledCount = 0
  }

  return (
    <div className="flex gap-2 sm:gap-3 justify-center items-center">
      {Array.from({ length: numDots }).map((_, i) => (
        <motion.div
          key={i}
          className="w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
          style={{
            backgroundColor: i < filledCount ? color : 'rgba(255,255,255,0.2)',
            opacity: i < filledCount ? opacity : 0.3,
            boxShadow: i < filledCount ? `0 0 8px ${color}60` : 'none',
          }}
          animate={tremble && i < filledCount ? {
            scale: [1, 1.15, 1],
            opacity: [opacity, opacity * 0.8, opacity],
          } : {}}
          transition={
            tremble
              ? { duration: 0.4, repeat: Infinity, repeatType: 'reverse' }
              : {}
          }
        />
      ))}
    </div>
  )
}
