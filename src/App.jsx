import { useState, useCallback, useEffect } from 'react'
import { brainStates, brainStatesOrder } from './data/brainStates'
import { useAudioEngine } from './hooks/useAudioEngine'
import { useAmbientSounds } from './hooks/useAmbientSounds'
import { useMetronomeSound } from './hooks/useMetronomeSound'
import { useHoldVibration } from './hooks/useHoldVibration'
import { useHoldVibrationSound } from './hooks/useHoldVibrationSound'
import { Navbar } from './components/Navbar'
import { StateCard } from './components/StateCard'
import { BrainwaveVisualizer } from './components/BrainwaveVisualizer'
import { BreathingCircle } from './components/BreathingCircle'
import { BreathingDots } from './components/BreathingDots'
import { PlayerControls } from './components/PlayerControls'
import { SettingsModal } from './components/SettingsModal'
import { SciencePage } from './components/SciencePage'
import { AmbientSounds } from './components/AmbientSounds'

function App() {
  const [selectedState, setSelectedState] = useState('alpha')
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(70)
  const [ambientVolume, setAmbientVolume] = useState(50)
  const [metronomeVolume, setMetronomeVolume] = useState(50)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [scienceOpen, setScienceOpen] = useState(false)
  const [metronomeOn, setMetronomeOn] = useState(true)
  const [holdVibrationOn, setHoldVibrationOn] = useState(true)

  const { startBinaural, stop, setVolume: setAudioVolume } = useAudioEngine()
  const { toggleSound, setVolume: setAmbientAudioVolume, activeSounds } = useAmbientSounds()
  useMetronomeSound(metronomeOn, isPlaying, metronomeVolume)
  useHoldVibration(holdVibrationOn, isPlaying, currentState?.breathing)
  useHoldVibrationSound(holdVibrationOn, isPlaying, currentState?.breathing)

  const currentState = brainStates[selectedState]

  useEffect(() => {
    setAmbientAudioVolume(0.25)
  }, [setAmbientAudioVolume])

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

  const handleAmbientVolumeChange = useCallback(
    (v) => {
      setAmbientVolume(v)
      const gainValue = (v / 100) * 0.5
      setAmbientAudioVolume(gainValue)
    },
    [setAmbientAudioVolume]
  )

  const handleMetronomeVolumeChange = useCallback((e) => {
    setMetronomeVolume(Number(e.target.value))
  }, [])

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#0a0a0a] pb-4">
      <Navbar
        onScienceClick={() => setScienceOpen(true)}
        onMenuClick={() => setSettingsOpen(true)}
      />

      <SciencePage isOpen={scienceOpen} onClose={() => setScienceOpen(false)} />

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        brainStates={brainStates}
        brainStatesOrder={brainStatesOrder}
        selectedState={selectedState}
        onSelectState={handleSelectState}
        ambientSoundsProps={{
          activeSounds,
          onToggle: toggleSound,
          ambientVolume,
          onVolumeChange: handleAmbientVolumeChange,
          metronomeOn,
          onMetronomeToggle: () => setMetronomeOn((v) => !v),
          metronomeColor: currentState.color,
          breathing: currentState.breathing,
          isPlaying,
          holdVibrationOn,
          onHoldVibrationToggle: () => setHoldVibrationOn((v) => !v),
        }}
      />

      <main className="pt-20 px-4 sm:px-6 pb-4 h-[calc(100vh-5rem)]">
        <div className="h-full max-w-6xl mx-auto flex flex-row gap-6">
          {/* Left: suoni (simmetrici ai pacchetti) */}
          <div className="hidden md:flex flex-col gap-3 justify-center shrink-0">
            <AmbientSounds
              activeSounds={activeSounds}
              onToggle={toggleSound}
              ambientVolume={ambientVolume}
              onVolumeChange={handleAmbientVolumeChange}
              metronomeOn={metronomeOn}
              onMetronomeToggle={() => setMetronomeOn((v) => !v)}
              metronomeColor={currentState.color}
              breathing={currentState.breathing}
              isPlaying={isPlaying}
              showVolumeBar={false}
              holdVibrationOn={holdVibrationOn}
              onHoldVibrationToggle={() => setHoldVibrationOn((v) => !v)}
            />
          </div>
          {/* Center: player e tutto il resto, centrato verticalmente e orizzontalmente */}
          <div className="flex-1 flex flex-col items-center justify-center gap-6 min-w-0">
            {/* Pallini guida respiro */}
            <BreathingDots
              breathing={currentState.breathing}
              isPlaying={isPlaying}
              color={currentState.color}
              holdVibrationOn={holdVibrationOn}
            />
            {/* Indicatore IN / HOLD / OUT */}
            <BreathingCircle
              breathing={currentState.breathing}
              isPlaying={isPlaying}
              color={currentState.color}
              size="large"
            />

            {/* Panel: name+freq left | wave (con volume sotto) | play right */}
            <div className="w-full flex flex-col sm:flex-row items-center gap-4 sm:gap-6 bg-black/40 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10">
              <div className="flex flex-col shrink-0">
                <span className="text-sm font-medium text-white/70 uppercase tracking-wider">
                  {currentState.name}
                </span>
                <span
                  className="font-mono text-lg font-semibold"
                  style={{ color: currentState.color, textShadow: `0 0 16px ${currentState.color}60` }}
                >
                  {currentState.binauralFreq} Hz
                </span>
              </div>
              <div className="flex-1 flex flex-col gap-3 w-full min-w-0">
                <BrainwaveVisualizer
                  isPlaying={isPlaying}
                  frequency={currentState.binauralFreq}
                  color={currentState.color}
                />
                {/* Volume sotto l'onda */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-white/60 text-xs shrink-0">Volume</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="flex-1 w-full"
                    />
                    <span className="text-white/60 text-xs w-8 shrink-0">{volume}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-white/60 text-xs shrink-0">Vol. suoni</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={ambientVolume}
                      onChange={(e) => handleAmbientVolumeChange(Number(e.target.value))}
                      className="flex-1 w-full"
                    />
                    <span className="text-white/60 text-xs w-8 shrink-0">{ambientVolume}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-white/60 text-xs shrink-0">Vol. metronomo</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={metronomeVolume}
                      onChange={handleMetronomeVolumeChange}
                      className="flex-1 w-full"
                    />
                    <span className="text-white/60 text-xs w-8 shrink-0">{metronomeVolume}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-white/60 text-xs shrink-0">Vibrazione durante hold</span>
                    <button
                      type="button"
                      onClick={() => setHoldVibrationOn((v) => !v)}
                      className={`rounded-xl px-3 py-1.5 text-sm font-medium border transition-colors ${
                        holdVibrationOn
                          ? 'bg-white/20 border-white/40 text-white'
                          : 'bg-black/30 border-white/10 text-white/60'
                      }`}
                    >
                      {holdVibrationOn ? 'On' : 'Off'}
                    </button>
                  </div>
                </div>
              </div>
              <PlayerControls
                isPlaying={isPlaying}
                onTogglePlay={handleTogglePlay}
                color={currentState.color}
              />
            </div>
          </div>

          {/* Right: pacchetti */}
          <div className="hidden md:flex flex-col gap-3 justify-center shrink-0">
            {brainStatesOrder.map((key) => (
              <StateCard
                key={key}
                state={brainStates[key]}
                isSelected={selectedState === key}
                size="small"
                onClick={() => handleSelectState(key)}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
