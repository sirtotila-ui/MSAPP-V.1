import { useEffect, useRef, useState } from 'react'

function getPhase(breathing, elapsed) {
  if (!breathing) return null
  const { inhale, hold = 0, exhale, hold2 = 0 } = breathing
  const total = inhale + hold + exhale + hold2
  const t = elapsed % total
  if (t < inhale) return 'IN'
  if (t < inhale + hold) return 'HOLD'
  if (t < inhale + hold + exhale) return 'OUT'
  return 'HOLD2'
}

/**
 * Vibrazione del dispositivo durante le fasi HOLD e HOLD2 del respiro.
 * Pattern: breve vibrazione ogni ~600 ms per tutta la durata dell'hold.
 */
export function useHoldVibration(holdVibrationOn, isPlaying, breathing) {
  const [elapsed, setElapsed] = useState(0)
  const pulseRef = useRef(null)
  const prevPhaseRef = useRef(null)

  useEffect(() => {
    if (!isPlaying || !breathing) {
      setElapsed(0)
      prevPhaseRef.current = null
      if (pulseRef.current) {
        clearInterval(pulseRef.current)
        pulseRef.current = null
      }
      return
    }
    const tick = setInterval(() => {
      setElapsed((prev) => prev + 0.05)
    }, 50)
    return () => clearInterval(tick)
  }, [isPlaying, breathing])

  useEffect(() => {
    if (!holdVibrationOn || !isPlaying || !breathing) {
      if (pulseRef.current) {
        clearInterval(pulseRef.current)
        pulseRef.current = null
      }
      prevPhaseRef.current = null
      return
    }

    const phase = getPhase(breathing, elapsed)
    const isHold = phase === 'HOLD' || phase === 'HOLD2'

    if (isHold) {
      const wasHold = prevPhaseRef.current === 'HOLD' || prevPhaseRef.current === 'HOLD2'
      if (!wasHold && typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(60)
      }
      if (!pulseRef.current) {
        pulseRef.current = setInterval(() => {
          if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(60)
          }
        }, 600)
      }
    } else {
      if (pulseRef.current) {
        clearInterval(pulseRef.current)
        pulseRef.current = null
      }
    }
    prevPhaseRef.current = phase
  }, [holdVibrationOn, isPlaying, breathing, elapsed])

  useEffect(() => {
    return () => {
      if (pulseRef.current) {
        clearInterval(pulseRef.current)
        pulseRef.current = null
      }
    }
  }, [])
}
