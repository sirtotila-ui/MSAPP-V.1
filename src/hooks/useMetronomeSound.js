import { useEffect, useRef } from 'react'
import * as Tone from 'tone'

/**
 * Suono tick del metronomo ogni secondo quando attivo e player in play
 * volume: 0-100, mappato a gain
 */
export function useMetronomeSound(metronomeOn, isPlaying, volume = 50) {
  const intervalRef = useRef(null)
  const gainValue = Math.min(1, Math.max(0, (volume / 100) * 0.4))

  useEffect(() => {
    if (!metronomeOn || !isPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    const playTick = () => {
      try {
        if (Tone.context.state !== 'running') Tone.start()

        const osc = new Tone.Oscillator(1200, 'sine')
        const gain = new Tone.Gain(gainValue).toDestination()
        osc.connect(gain)
        osc.start()
        osc.stop('+0.03')
        osc.onended = () => {
          osc.dispose()
          gain.dispose()
        }
      } catch (_) {}
    }

    playTick()
    intervalRef.current = setInterval(playTick, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [metronomeOn, isPlaying, gainValue])
}
