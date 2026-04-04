import { useEffect, useRef } from 'react'
import * as Tone from 'tone'

const TICK_PROFILE = {
  IN: {
    normal: { freq: 1200, gainMultiplier: 0.4, duration: 0.03 },
    accent: { freq: 800, gainMultiplier: 0.65, duration: 0.06 },
  },
  OUT: {
    normal: { freq: 700, gainMultiplier: 0.4, duration: 0.03 },
    accent: { freq: 500, gainMultiplier: 0.65, duration: 0.06 },
  },
}

/**
 * Tick del metronomo solo durante IN e OUT, quando si colora/svuota un pallino.
 * Tick più forte e diverso: ultimo tick dell'inhale (prima dell'hold) e primo tick dell'out (fine hold).
 */
export function useMetronomeSound(metronomeOn, isPlaying, volume = 50, phase, progress, phaseDuration = 0) {
  const lastTickSecondRef = useRef(-1)
  const normalizedVolume = Math.min(1, Math.max(0, volume / 100))

  useEffect(() => {
    if (!metronomeOn || !isPlaying) {
      lastTickSecondRef.current = -1
      return
    }
    const tickOnDot = phase === 'IN' || phase === 'OUT'
    if (!tickOnDot) {
      lastTickSecondRef.current = -1
      return
    }
    const second = Math.floor(progress)
    if (second !== lastTickSecondRef.current && second >= 0) {
      lastTickSecondRef.current = second
      const numDots = Math.max(1, Math.round(phaseDuration))
      const isLastOfIn = phase === 'IN' && second === numDots - 1
      const isFirstOfOut = phase === 'OUT' && second === 0
      const strongTick = isLastOfIn || isFirstOfOut
      const profile = TICK_PROFILE[phase]?.[strongTick ? 'accent' : 'normal']

      try {
        if (Tone.context.state !== 'running') Tone.start()
        if (!profile) return
        const gainVal = Math.min(1, Math.max(0, normalizedVolume * profile.gainMultiplier))
        const osc = new Tone.Oscillator(profile.freq, 'sine')
        const gain = new Tone.Gain(gainVal).toDestination()
        osc.connect(gain)
        osc.start()
        osc.stop(`+${profile.duration}`)
        osc.onended = () => {
          osc.dispose()
          gain.dispose()
        }
      } catch (_) {}
    }
  }, [metronomeOn, isPlaying, normalizedVolume, phase, progress, phaseDuration])
}
