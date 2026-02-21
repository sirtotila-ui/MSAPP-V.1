import { useEffect, useRef, useState } from 'react'
import * as Tone from 'tone'

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
 * Suono di vibrazione (tremolo leggero) durante le fasi HOLD e HOLD2.
 * Oscillatore basso con LFO sul gain per effetto pulsazione.
 */
export function useHoldVibrationSound(holdVibrationOn, isPlaying, breathing) {
  const [elapsed, setElapsed] = useState(0)
  const nodesRef = useRef(null)
  const prevHoldRef = useRef(false)

  useEffect(() => {
    if (!isPlaying || !breathing) {
      setElapsed(0)
      prevHoldRef.current = false
      return
    }
    const tick = setInterval(() => setElapsed((p) => p + 0.05), 50)
    return () => clearInterval(tick)
  }, [isPlaying, breathing])

  useEffect(() => {
    const phase = getPhase(breathing, elapsed)
    const isHold = phase === 'HOLD' || phase === 'HOLD2'

    if (!holdVibrationOn || !isPlaying || !breathing) {
      if (nodesRef.current) {
        try {
          nodesRef.current.osc?.stop()
          nodesRef.current.osc?.dispose()
          nodesRef.current.lfo?.stop()
          nodesRef.current.lfo?.dispose()
          nodesRef.current.gain?.dispose()
        } catch (_) {}
        nodesRef.current = null
      }
      prevHoldRef.current = false
      return
    }

    if (isHold && !prevHoldRef.current) {
      try {
        if (Tone.context.state !== 'running') Tone.start()
        const gainNode = new Tone.Gain(0.08).toDestination()
        const lfo = new Tone.LFO(4, 0.02, 0.12)
        lfo.connect(gainNode.gain)
        lfo.start()
        const osc = new Tone.Oscillator(80, 'sine').connect(gainNode)
        osc.start()
        nodesRef.current = { osc, lfo, gain: gainNode }
      } catch (_) {}
    } else if (!isHold && prevHoldRef.current && nodesRef.current) {
      try {
        nodesRef.current.osc?.stop()
        nodesRef.current.osc?.dispose()
        nodesRef.current.lfo?.stop()
        nodesRef.current.lfo?.dispose()
        nodesRef.current.gain?.dispose()
      } catch (_) {}
      nodesRef.current = null
    }

    prevHoldRef.current = isHold
  }, [holdVibrationOn, isPlaying, breathing, elapsed])

  useEffect(() => {
    return () => {
      if (nodesRef.current) {
        try {
          nodesRef.current.osc?.stop()
          nodesRef.current.osc?.dispose()
          nodesRef.current.lfo?.stop()
          nodesRef.current.lfo?.dispose()
          nodesRef.current.gain?.dispose()
        } catch (_) {}
        nodesRef.current = null
      }
    }
  }, [])
}
