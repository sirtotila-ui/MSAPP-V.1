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

    // Common gain
    const gainNode = new Tone.Gain(0.35).toDestination()
    leftPanner.connect(gainNode)
    rightPanner.connect(gainNode)

    leftOsc.start()
    rightOsc.start()

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
      leftOsc.stop()
      rightOsc.stop()
      leftOsc.dispose()
      rightOsc.dispose()
      leftPanner.dispose()
      rightPanner.dispose()
      gainNodeRef.current?.dispose()
      oscillatorsRef.current = null
      gainNodeRef.current = null
    }
  }, [])

  const setVolume = useCallback((gainValue) => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = Math.min(1, Math.max(0, gainValue))
    }
  }, [])

  useEffect(() => {
    return () => {
      stop()
    }
  }, [stop])

  return { startBinaural, stop, setVolume }
}
