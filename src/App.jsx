import { useState, useCallback, useEffect } from 'react'
import { brainStates, brainStatesOrder } from './data/brainStates'
import { getPhaseAndProgress } from './utils/breathing'
import { useAudioEngine } from './hooks/useAudioEngine'
import { useAmbientSounds } from './hooks/useAmbientSounds'
import { useMetronomeSound } from './hooks/useMetronomeSound'
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
  const [sessionState, setSessionState] = useState('idle')
  const [volume, setVolume] = useState(70)
  const [ambientVolume, setAmbientVolume] = useState(50)
  const [metronomeVolume, setMetronomeVolume] = useState(50)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [scienceOpen, setScienceOpen] = useState(false)
  const [metronomeOn, setMetronomeOn] = useState(true)
  const [countdownRemaining, setCountdownRemaining] = useState(null) // 3, 2, 1 poi null
  const [elapsed, setElapsed] = useState(0)
  const isPlaying = sessionState === 'playing'
  const isCountingDown = sessionState === 'countdown'
  const isSessionActive = sessionState !== 'idle'

  const currentState = brainStates[selectedState]
  const breathing = currentState?.breathing
  const phaseInfo = isPlaying && breathing ? getPhaseAndProgress(breathing, elapsed) : null
  const breathingPattern = [breathing?.inhale, breathing?.hold, breathing?.exhale, breathing?.hold2]
    .filter((value) => value != null && value > 0)
    .join(' • ')
  const statusLabel = isCountingDown ? 'Pronto' : isPlaying ? phaseInfo?.phase ?? 'IN' : 'Idle'

  const { startBinaural, stop, setVolume: setAudioVolume } = useAudioEngine()
  const { toggleSound, setVolume: setAmbientAudioVolume, activeSounds, stopAll } = useAmbientSounds()
  useMetronomeSound(metronomeOn, isPlaying, metronomeVolume, phaseInfo?.phase, phaseInfo?.progress ?? 0, phaseInfo?.phaseDuration ?? 0)

  useEffect(() => {
    setAmbientAudioVolume(0.25)
  }, [setAmbientAudioVolume])

  const resetSession = useCallback(() => {
    stop()
    stopAll()
    setMetronomeOn(false)
    setElapsed(0)
    setCountdownRemaining(null)
    setSessionState('idle')
  }, [stop, stopAll])

  const handleSelectState = useCallback(
    (key) => {
      if (sessionState !== 'idle') {
        resetSession()
      }
      setSelectedState(key)
    },
    [sessionState, resetSession]
  )

  const handleTogglePlay = useCallback(() => {
    if (sessionState !== 'idle') {
      resetSession()
    } else {
      setElapsed(0)
      setCountdownRemaining(3)
      setSessionState('countdown')
    }
  }, [sessionState, resetSession])

  // Countdown 3, 2, 1 poi avvio sessione (sempre con inhale)
  useEffect(() => {
    if (sessionState !== 'countdown' || countdownRemaining == null) return
    if (countdownRemaining === 0) {
      setCountdownRemaining(null)
      startBinaural(currentState.baseFreq, currentState.binauralFreq)
      setAudioVolume((volume / 100) * 0.5)
      setElapsed(0)
      setSessionState('playing')
      return
    }
    const t = setTimeout(() => setCountdownRemaining((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [
    sessionState,
    countdownRemaining,
    currentState.baseFreq,
    currentState.binauralFreq,
    volume,
    startBinaural,
    setAudioVolume,
  ])

  // Elapsed per respiro (solo quando isPlaying)
  useEffect(() => {
    if (sessionState !== 'playing') return
    const interval = setInterval(() => setElapsed((prev) => prev + 0.05), 50)
    return () => clearInterval(interval)
  }, [sessionState])

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
          isPlaying: isSessionActive,
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
              isPlaying={isSessionActive}
              showVolumeBar={false}
            />
          </div>
          {/* Center: player e tutto il resto, centrato verticalmente e orizzontalmente */}
          <div className="flex-1 flex flex-col items-center justify-center gap-6 min-w-0">
            {/* Countdown 3, 2, 1 prima di iniziare */}
            {isCountingDown && countdownRemaining != null ? (
              <div className="flex flex-col items-center justify-center gap-4">
                <div
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 flex items-center justify-center text-6xl sm:text-7xl font-bold tabular-nums"
                  style={{
                    borderColor: currentState.color,
                    color: currentState.color,
                    boxShadow: `0 0 24px ${currentState.color}60`,
                  }}
                >
                  {countdownRemaining}
                </div>
                <span className="text-white/60 text-sm uppercase tracking-wider">Avvio sessione con inhale...</span>
              </div>
            ) : (
              <>
                {/* Pallini guida respiro */}
                <BreathingDots
                  breathing={currentState.breathing}
                  isPlaying={isPlaying}
                  color={currentState.color}
                  elapsed={elapsed}
                />
                {/* Indicatore IN / HOLD / OUT */}
                <BreathingCircle
                  breathing={currentState.breathing}
                  isPlaying={isPlaying}
                  color={currentState.color}
                  size="large"
                  elapsed={elapsed}
                />
              </>
            )}

            {/* Panel: name+freq left | wave (con volume sotto) | play right */}
            <div className="w-full flex flex-col sm:flex-row items-center gap-4 sm:gap-6 bg-black/40 backdrop-blur-xl rounded-3xl p-4 sm:p-6 border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
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
                <span className="text-xs text-white/55 mt-1">{breathingPattern} respiri guidati</span>
              </div>
              <div className="flex-1 flex flex-col gap-3 w-full min-w-0">
                <BrainwaveVisualizer
                  isPlaying={isPlaying}
                  frequency={currentState.binauralFreq}
                  color={currentState.color}
                />
                <div className="flex items-center justify-between text-xs text-white/55 px-2">
                  <span>Stato: {statusLabel}</span>
                  <span>Usa cuffie stereo</span>
                </div>
                {/* Volume sotto l'onda: stesse dimensioni, stesso inizio e fine */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-white/60 text-xs shrink-0 w-[5.5rem]">Volume</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-48 shrink-0"
                    />
                    <span className="text-white/60 text-xs w-9 shrink-0 text-right">{volume}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-white/60 text-xs shrink-0 w-[5.5rem]">Vol. suoni</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={ambientVolume}
                      onChange={(e) => handleAmbientVolumeChange(Number(e.target.value))}
                      className="w-48 shrink-0"
                    />
                    <span className="text-white/60 text-xs w-9 shrink-0 text-right">{ambientVolume}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-white/60 text-xs shrink-0 w-[5.5rem]">Vol. metronomo</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={metronomeVolume}
                      onChange={handleMetronomeVolumeChange}
                      className="w-48 shrink-0"
                    />
                    <span className="text-white/60 text-xs w-9 shrink-0 text-right">{metronomeVolume}%</span>
                  </div>
                </div>
              </div>
              <PlayerControls
                isPlaying={isSessionActive}
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
