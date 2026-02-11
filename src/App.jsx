import { useState, useCallback } from 'react'
import { brainStates, brainStatesOrder } from './data/brainStates'
import { useAudioEngine } from './hooks/useAudioEngine'
import { Navbar } from './components/Navbar'
import { StateCard } from './components/StateCard'
import { BrainwaveVisualizer } from './components/BrainwaveVisualizer'
import { BreathingCircle } from './components/BreathingCircle'
import { PlayerControls } from './components/PlayerControls'

function App() {
  const [selectedState, setSelectedState] = useState('alpha')
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(70)

  const { startBinaural, stop, setVolume: setAudioVolume } = useAudioEngine()

  const currentState = brainStates[selectedState]
  const otherStates = brainStatesOrder.filter((k) => k !== selectedState)

  const handleSelectState = useCallback(
    (key) => {
      if (isPlaying) {
        stop()
        setIsPlaying(false)
      }
      setSelectedState(key)
    },
    [isPlaying, stop]
  )

  const handleTogglePlay = useCallback(() => {
    if (isPlaying) {
      stop()
      setIsPlaying(false)
    } else {
      startBinaural(currentState.baseFreq, currentState.binauralFreq)
      setAudioVolume((volume / 100) * 0.5)
      setIsPlaying(true)
    }
  }, [
    isPlaying,
    stop,
    startBinaural,
    setAudioVolume,
    volume,
    currentState.baseFreq,
    currentState.binauralFreq,
  ])

  const handleVolumeChange = useCallback(
    (e) => {
      const v = Number(e.target.value)
      setVolume(v)
      const gainValue = (v / 100) * 0.5
      setAudioVolume(gainValue)
    },
    [setAudioVolume]
  )

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#fafafa] pb-24">
      <Navbar />

      <main className="pt-20 px-4 sm:px-6 pb-4">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-6 items-center lg:items-start justify-center min-h-[calc(100vh-12rem)]">
          {/* Center: selected card + wave + controls */}
          <div className="flex-1 flex flex-col items-center gap-6 w-full max-w-md">
            <StateCard
              state={currentState}
              isSelected
              size="large"
            />

            {/* Under card: name+freq left | wave center | play right */}
            <div className="w-full flex flex-col sm:flex-row items-center gap-4 sm:gap-6 bg-white/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-lg border border-black/5">
              <div className="flex flex-col shrink-0">
                <span className="text-sm font-medium text-black/70 uppercase tracking-wider">
                  {currentState.name}
                </span>
                <span
                  className="font-mono text-lg font-semibold"
                  style={{ color: currentState.color, textShadow: `0 0 16px ${currentState.color}60` }}
                >
                  {currentState.binauralFreq} Hz
                </span>
              </div>
              <BrainwaveVisualizer
                isPlaying={isPlaying}
                frequency={currentState.binauralFreq}
                color={currentState.color}
              />
              <PlayerControls
                isPlaying={isPlaying}
                onTogglePlay={handleTogglePlay}
                color={currentState.color}
              />
            </div>
          </div>

          {/* Right: unselected cards stacked vertically (desktop) / row (mobile) */}
          <div className="flex flex-row flex-wrap lg:flex-col gap-3 justify-center lg:justify-start shrink-0">
            {otherStates.map((key) => (
              <StateCard
                key={key}
                state={brainStates[key]}
                isSelected={false}
                size="small"
                onClick={() => handleSelectState(key)}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 h-20 min-h-[5rem] bg-white/90 backdrop-blur-xl border-t border-black/5 flex items-center justify-between gap-4 px-4 sm:px-6 z-50 pb-[env(safe-area-inset-bottom)]">
        <BreathingCircle
          breathing={currentState.breathing}
          isPlaying={isPlaying}
          color={currentState.color}
        />
        <div className="flex-1 flex items-center gap-3 max-w-xs">
          <span className="text-black/60 text-sm shrink-0">Volume</span>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="flex-1 w-full"
          />
          <span className="text-black/60 text-sm w-8 shrink-0">{volume}%</span>
        </div>
      </footer>
    </div>
  )
}

export default App
