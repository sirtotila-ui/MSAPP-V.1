import { useCallback, useEffect, useRef } from 'react'
import * as Tone from 'tone'

/**
 * Custom hook for binaural beats audio engine using Tone.js
 * Creates two oscillators (left/right) with different frequencies for binaural effect
 */
export function useAudioEngine() {
  const oscillatorsRef = useRef(null)
  const gainNodeRef = useRef(null)

  const startBinaural = useCallback((baseFreq, binauralFreq) => {
    stop()

    if (Tone.context.state !== 'running') {
      Tone.start()
    }

    // Left channel: baseFreq, panned left (-1)
    const leftOsc = new Tone.Oscillator({
      frequency: baseFreq,
      type: 'sine',
    })
    const leftPanner = new Tone.Panner(-1)
    leftOsc.connect(leftPanner)

    // Right channel: baseFreq + binauralFreq, panned right (1)
    const rightOsc = new Tone.Oscillator({
      frequency: baseFreq + binauralFreq,
      type: 'sine',
    })
    const rightPanner = new Tone.Panner(1)
    rightOsc.connect(rightPanner)

    // Common gain with soft fade-in
    const gainNode = new Tone.Gain(0).toDestination()
    leftPanner.connect(gainNode)
    rightPanner.connect(gainNode)

    leftOsc.start()
    rightOsc.start()
    gainNode.gain.rampTo(0.35, 0.4)

    oscillatorsRef.current = { leftOsc, rightOsc, leftPanner, rightPanner }
    gainNodeRef.current = gainNode

    return () => {
      leftOsc.stop()
      rightOsc.stop()
      leftOsc.dispose()
      rightOsc.dispose()
      leftPanner.dispose()
      rightPanner.dispose()
      gainNode.dispose()
    }
  }, [])

  const stop = useCallback(() => {
    if (oscillatorsRef.current) {
      const { leftOsc, rightOsc, leftPanner, rightPanner } = oscillatorsRef.current
      const gainNode = gainNodeRef.current
      gainNode?.gain.rampTo(0, 0.08)
      leftOsc.stop('+0.08')
      rightOsc.stop('+0.08')
      oscillatorsRef.current = null
      gainNodeRef.current = null
      setTimeout(() => {
        leftOsc.dispose()
        rightOsc.dispose()
        leftPanner.dispose()
        rightPanner.dispose()
        gainNode?.dispose()
      }, 100)
    }
  }, [])

  const setVolume = useCallback((gainValue) => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.rampTo(Math.min(1, Math.max(0, gainValue)), 0.1)
    }
  }, [])

  useEffect(() => {
    return () => {
      stop()
    }
  }, [stop])

  return { startBinaural, stop, setVolume }
}
