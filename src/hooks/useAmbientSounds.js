import { useCallback, useEffect, useRef, useState } from 'react'
import * as Tone from 'tone'

/**
 * Ambient sounds layerable with binaural beats.
 * The goal is a soft, non-fatiguing texture rather than raw/noisy signals.
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
        // Pioggia: texture scura e morbida
        const noise = new Tone.Noise('brown')
        const filter = new Tone.Filter(220, 'lowpass')
        const gain = new Tone.Gain(0.3)
        noise.connect(filter)
        filter.connect(gain)
        gain.connect(masterGain)
        noise.start()
        return { noise, filter, gain }
      }
      case 1: {
        // Rumore rosa: più vellutato e meno invasivo
        const noise = new Tone.Noise('pink')
        const filter = new Tone.Filter(700, 'lowpass')
        const gain = new Tone.Gain(0.2)
        noise.connect(filter)
        filter.connect(gain)
        gain.connect(masterGain)
        noise.start()
        return { noise, filter, gain }
      }
      case 2: {
        // Rumore bianco: tagliato sugli acuti per evitare asprezza
        const white = new Tone.Noise('white')
        const filter = new Tone.Filter(1100, 'lowpass')
        const gain = new Tone.Gain(0.14)
        white.connect(filter)
        filter.connect(gain)
        gain.connect(masterGain)
        white.start()
        return { noise: white, filter, gain }
      }
      case 3: {
        // Pad ambient: due oscillatori morbidi con filtro modulato lentamente
        const gain = new Tone.Gain(0.08)
        const filter = new Tone.Filter(360, 'lowpass')
        const lfo = new Tone.LFO(0.07, 280, 460)
        const oscA = new Tone.Oscillator(110, 'sine')
        const oscB = new Tone.Oscillator(165, 'triangle')
        oscA.volume.value = -8
        oscB.volume.value = -14
        lfo.connect(filter.frequency)
        lfo.start()
        oscA.connect(filter)
        oscB.connect(filter)
        filter.connect(gain)
        gain.connect(masterGain)
        oscA.start()
        oscB.start()
        return { oscillators: [oscA, oscB], filter, gain, lfo }
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
        if (obj.oscillators) {
          obj.oscillators.forEach((osc) => {
            osc.stop()
            osc.dispose()
          })
        }
        if (obj.osc) {
          obj.osc.stop()
          obj.osc.dispose()
        }
        obj.filter?.dispose()
        obj.gain?.dispose()
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
