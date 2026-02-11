import { useCallback, useEffect, useRef, useState } from 'react'
import * as Tone from 'tone'

/**
 * Hook for 5 ambient sounds that can be layered with binaural beats
 * Each sound can be toggled on/off independently, volume is global for all ambient
 */
export function useAmbientSounds() {
  const soundsRef = useRef({ masterGain: null, sources: [], volumeRef: 0.25 })
  const [activeSounds, setActiveSounds] = useState([false, false, false, false]) // 4 suoni: rain, pink, white, pad

  const initMasterGain = useCallback(() => {
    if (Tone.context.state !== 'running') {
      Tone.start()
    }
    if (!soundsRef.current.masterGain) {
      const vol = soundsRef.current.volumeRef
      const gain = new Tone.Gain(vol).toDestination()
      soundsRef.current.masterGain = gain
    }
    return soundsRef.current.masterGain
  }, [])

  // Indici 0-3: rain, pink, white, pad (metronomo = index 0 nei bottoni ma non produce audio)
  const createAndStartSound = useCallback((soundIndex) => {
    const masterGain = initMasterGain()
    const index = soundIndex - 1 // 0=rain, 1=pink, 2=white, 3=pad

    let source
    switch (index) {
      case 0: {
        // Pioggia
        const noise = new Tone.Noise('pink')
        const filter = new Tone.Filter(600, 'lowpass')
        noise.connect(filter)
        filter.connect(masterGain)
        noise.start()
        return { noise, filter }
      }
      case 1:
        source = new Tone.Noise('pink')
        source.connect(masterGain)
        source.start()
        return source
      case 2:
        source = new Tone.Noise('white')
        source.connect(masterGain)
        source.start()
        return source
      case 3: {
        // Pad ambient - oscillatore sinusoidale basso
        source = new Tone.Oscillator(80, 'sine')
        source.connect(masterGain)
        source.start()
        return source
      }
      default:
        source = new Tone.Noise('pink')
        source.connect(masterGain)
        source.start()
        return source
    }
  }, [initMasterGain])

  const stopSound = useCallback((obj) => {
    if (!obj) return
    try {
      if (obj instanceof Tone.Noise) {
        obj.stop()
        obj.dispose()
      } else if (obj instanceof Tone.Oscillator) {
        obj.stop()
        obj.dispose()
      } else if (obj && typeof obj === 'object') {
        if (obj.noise) {
          obj.noise.stop()
          obj.noise.dispose()
        }
        obj.filter?.dispose()
        obj.lfo?.stop()
        obj.lfo?.dispose()
      }
    } catch (_) {}
  }, [])

  const toggleSound = useCallback((soundIndex) => {
    if (soundIndex === 0) return // Metronomo gestito separatamente, no audio
    const index = soundIndex - 1
    const sources = soundsRef.current.sources
    const isCurrentlyActive = sources[index] != null

    if (isCurrentlyActive) {
      const current = sources[index]
      stopSound(current)
      sources[index] = null
      setActiveSounds((prev) => {
        const next = [...prev]
        next[index] = false
        return next
      })
    } else {
      sources[index] = createAndStartSound(soundIndex)
      setActiveSounds((prev) => {
        const next = [...prev]
        next[index] = true
        return next
      })
    }
  }, [createAndStartSound, stopSound])

  const setVolume = useCallback((gainValue) => {
    const v = Math.min(1, Math.max(0, gainValue))
    soundsRef.current.volumeRef = v
    if (soundsRef.current.masterGain) {
      soundsRef.current.masterGain.gain.value = v
    }
  }, [])

  const stopAll = useCallback(() => {
    soundsRef.current.sources.forEach((obj) => stopSound(obj))
    soundsRef.current.sources = []
    setActiveSounds([false, false, false, false])
    if (soundsRef.current.masterGain) {
      soundsRef.current.masterGain.dispose()
      soundsRef.current.masterGain = null
    }
  }, [stopSound])

  useEffect(() => {
    return () => stopAll()
  }, [stopAll])

  return { toggleSound, setVolume, activeSounds, stopAll }
}
