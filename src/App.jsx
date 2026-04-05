import { lazy, Suspense, useState, useCallback, useEffect, useMemo } from 'react'
import { brainStates, brainStatesOrder } from './data/brainStates'
import { getPhaseAndProgress } from './utils/breathing'
import { loadSettings, saveSettings } from './utils/storage'
import { useAudioEngine } from './hooks/useAudioEngine'
import { useAmbientSounds } from './hooks/useAmbientSounds'
import { useMetronomeSound } from './hooks/useMetronomeSound'
import { Navbar } from './components/Navbar'
import { StateCard } from './components/StateCard'
import { BrainwaveVisualizer } from './components/BrainwaveVisualizer'
import { BreathingCircle } from './components/BreathingCircle'
import { BreathingDots } from './components/BreathingDots'
import { PlayerControls } from './components/PlayerControls'
import { AmbientSounds } from './components/AmbientSounds'

const SettingsModal = lazy(() => import('./components/SettingsModal').then((module) => ({ default: module.SettingsModal })))
const SciencePage = lazy(() => import('./components/SciencePage').then((module) => ({ default: module.SciencePage })))
const initialSettings = loadSettings() ?? {}
const normalizeSliderValue = (value, fallback = 0) => {
  const numericValue = Number(value)
  if (!Number.isFinite(numericValue)) return fallback
  return Math.min(100, Math.max(0, Math.round(numericValue / 10) * 10))
}

const getPremiumSliderStyle = (value, accentColor) => ({
  '--slider-progress': `${normalizeSliderValue(value)}%`,
  '--slider-accent': accentColor,
})

function App() {
  const [selectedState, setSelectedState] = useState(initialSettings.selectedState ?? 'alpha')
  const [sessionState, setSessionState] = useState('idle')
  const [volume, setVolume] = useState(normalizeSliderValue(initialSettings.volume, 70))
  const [ambientVolume, setAmbientVolume] = useState(normalizeSliderValue(initialSettings.ambientVolume, 50))
  const [metronomeVolume, setMetronomeVolume] = useState(normalizeSliderValue(initialSettings.metronomeVolume, 50))
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [scienceOpen, setScienceOpen] = useState(false)
  const [metronomeOn, setMetronomeOn] = useState(initialSettings.metronomeOn ?? true)
  const [countdownRemaining, setCountdownRemaining] = useState(null) // 3, 2, 1 poi null
  const [elapsed, setElapsed] = useState(0)
  const isPlaying = sessionState === 'playing'
  const isPaused = sessionState === 'paused'
  const isCountingDown = sessionState === 'countdown'
  const isSessionActive = sessionState !== 'idle'

  const currentState = brainStates[selectedState]
  const breathing = currentState?.breathing
  const phaseInfo = isPlaying && breathing ? getPhaseAndProgress(breathing, elapsed) : null
  const breathingPattern = [breathing?.inhale, breathing?.hold, breathing?.exhale, breathing?.hold2]
    .filter((value) => value != null && value > 0)
    .join(' • ')
  const statusLabel = isCountingDown ? 'Pronto' : isPlaying ? phaseInfo?.phase ?? 'IN' : isPaused ? 'Pausa' : 'Idle'

  const { startBinaural, stop, setVolume: setAudioVolume, pause, resume } = useAudioEngine()
  const { toggleSound, setVolume: setAmbientAudioVolume, activeSounds, stopAll, pauseAll, resumeAll } = useAmbientSounds()
  useMetronomeSound(metronomeOn, isPlaying, metronomeVolume, phaseInfo?.phase, phaseInfo?.progress ?? 0, phaseInfo?.phaseDuration ?? 0)

  useEffect(() => {
    setAmbientAudioVolume((ambientVolume / 100) * 0.5)
  }, [ambientVolume, setAmbientAudioVolume])

  useEffect(() => {
    saveSettings({
      selectedState,
      volume,
      ambientVolume,
      metronomeVolume,
      metronomeOn,
    })
  }, [selectedState, volume, ambientVolume, metronomeVolume, metronomeOn])

  const stopSession = useCallback(() => {
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
        stopSession()
      }
      setSelectedState(key)
    },
    [sessionState, stopSession]
  )

  const handlePlayPause = useCallback(() => {
    if (sessionState === 'idle') {
      setElapsed(0)
      setCountdownRemaining(3)
      setSessionState('countdown')
      return
    }
    if (sessionState === 'countdown' || sessionState === 'playing') {
      pause()
      pauseAll()
      setSessionState('paused')
      return
    }
    if (sessionState === 'paused') {
      if (countdownRemaining != null) {
        setSessionState('countdown')
      } else {
        resume()
        resumeAll()
        setSessionState('playing')
      }
    }
  }, [sessionState, pause, pauseAll, resume, resumeAll, countdownRemaining])

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

  const modalFallback = useMemo(() => <div className="fixed inset-0 pointer-events-none" aria-hidden="true" />, [])

  const handleVolumeChange = useCallback(
    (e) => {
      const v = normalizeSliderValue(e.target.value, 70)
      setVolume(v)
      const gainValue = (v / 100) * 0.5
      setAudioVolume(gainValue)
    },
    [setAudioVolume]
  )

  const handleAmbientVolumeChange = useCallback(
    (v) => {
      const normalizedValue = normalizeSliderValue(v, 50)
      setAmbientVolume(normalizedValue)
      const gainValue = (normalizedValue / 100) * 0.5
      setAmbientAudioVolume(gainValue)
    },
    [setAmbientAudioVolume]
  )

  const handleMetronomeVolumeChange = useCallback((e) => {
    setMetronomeVolume(normalizeSliderValue(e.target.value, 50))
  }, [])

  const premiumControls = [
    {
      id: 'master',
      eyebrow: 'Master',
      title: 'Binaural output',
      description: 'Controlla il mix principale della sessione.',
      value: volume,
      onChange: handleVolumeChange,
    },
    {
      id: 'ambience',
      eyebrow: 'Ambience',
      title: 'Rain, noise and pad',
      description: 'Bilancia il layer ambientale di supporto.',
      value: ambientVolume,
      onChange: (e) => handleAmbientVolumeChange(Number(e.target.value)),
    },
    {
      id: 'metronome',
      eyebrow: 'Metronome',
      title: 'Breathing timing pulse',
      description: 'Regola il timing sonoro della respirazione guidata.',
      value: metronomeVolume,
      onChange: handleMetronomeVolumeChange,
    },
  ]

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#0a0a0a] pb-4">
      <Navbar
        onScienceClick={() => setScienceOpen(true)}
        onMenuClick={() => setSettingsOpen(true)}
      />

      <Suspense fallback={modalFallback}>
        <SciencePage isOpen={scienceOpen} onClose={() => setScienceOpen(false)} />
      </Suspense>

      <Suspense fallback={modalFallback}>
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
      </Suspense>

      <main className="pt-16 sm:pt-20 px-3 sm:px-6 pb-4 sm:pb-6 min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)]">
        <div className="max-w-6xl mx-auto flex flex-row gap-4 sm:gap-6">
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
          <div className="flex-1 flex flex-col items-center justify-start gap-5 sm:gap-6 min-w-0 pt-2 sm:pt-4">
            {/* Countdown 3, 2, 1 prima di iniziare */}
            {isCountingDown && countdownRemaining != null ? (
              <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 pt-2">
                <div
                  className="w-28 h-28 sm:w-40 sm:h-40 rounded-full border-4 flex items-center justify-center text-5xl sm:text-7xl font-bold tabular-nums"
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
            ) : isPaused ? (
              <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 pt-2">
                <div
                  className="w-28 h-28 sm:w-40 sm:h-40 rounded-full border-4 flex items-center justify-center text-lg sm:text-2xl font-semibold uppercase tracking-wider"
                  style={{
                    borderColor: `${currentState.color}aa`,
                    color: currentState.color,
                    boxShadow: `0 0 24px ${currentState.color}40`,
                  }}
                >
                  Pausa
                </div>
                <span className="text-white/60 text-sm uppercase tracking-wider">Riprendi quando vuoi</span>
              </div>
            ) : (
              <div className="flex w-full flex-col items-center gap-4 shrink-0">
                {/* Indicatore IN / HOLD / OUT */}
                <BreathingCircle
                  breathing={currentState.breathing}
                  isPlaying={isPlaying}
                  isVisible={isPlaying || isPaused}
                  color={currentState.color}
                  size="large"
                  elapsed={elapsed}
                />
                {/* Pallini guida respiro */}
                <BreathingDots
                  breathing={currentState.breathing}
                  isPlaying={isPlaying}
                  isVisible={isPlaying || isPaused}
                  color={currentState.color}
                  elapsed={elapsed}
                />
              </div>
            )}

            <div
              className="w-full rounded-[1.9rem] border border-white/10 bg-black/45 p-4 shadow-[0_30px_110px_rgba(0,0,0,0.46)] backdrop-blur-2xl sm:rounded-[2rem] sm:p-6"
              style={{
                boxShadow: `0 30px 110px rgba(0,0,0,0.46), inset 0 1px 0 rgba(255,255,255,0.05), 0 0 0 1px ${currentState.color}12`,
              }}
            >
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
                      <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-[2rem]">{currentState.name}</h2>
                      <span
                        className="font-mono text-lg font-semibold sm:text-xl"
                        style={{ color: currentState.color, textShadow: `0 0 18px ${currentState.color}55` }}
                      >
                        {currentState.binauralFreq} Hz
                      </span>
                    </div>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-white/58">
                      {currentState.description}. Sessione immersiva calibrata su {currentState.frequency} con pattern {breathingPattern}.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-start xl:pl-4">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2">
                      <div className="text-[10px] uppercase tracking-[0.22em] text-white/40">Session</div>
                      <div className="mt-1 text-sm font-medium text-white/80">{statusLabel}</div>
                    </div>
                    <PlayerControls
                      sessionState={sessionState}
                      onPlayPause={handlePlayPause}
                      onStop={stopSession}
                      color={currentState.color}
                    />
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-3 sm:p-4">
                  <BrainwaveVisualizer
                    isPlaying={isPlaying}
                    frequency={currentState.binauralFreq}
                    color={currentState.color}
                  />
                </div>

                <div className="flex items-center justify-between gap-3 px-1 text-[11px] uppercase tracking-[0.18em] text-white/38">
                  <span>Best with stereo headphones</span>
                  <span>{isPlaying ? 'Realtime neural playback' : 'Ready to begin'}</span>
                </div>

                <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
                  {premiumControls.map((control) => (
                    <div
                      key={control.id}
                      className="rounded-[1.45rem] border border-white/8 bg-white/[0.035] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:px-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[11px] uppercase tracking-[0.2em] text-white/42">{control.eyebrow}</p>
                          <p className="mt-1 text-sm font-medium text-white/88">{control.title}</p>
                          <p className="mt-1 text-xs leading-5 text-white/46">{control.description}</p>
                        </div>
                        <div
                          className="shrink-0 rounded-full border px-3 py-1 text-xs font-medium text-white/85"
                          style={{
                            borderColor: `${currentState.color}30`,
                            backgroundColor: `${currentState.color}12`,
                            boxShadow: `0 0 18px ${currentState.color}18`,
                          }}
                        >
                          {control.value}%
                        </div>
                      </div>

                      <div className="mt-4">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="10"
                          value={control.value}
                          onChange={control.onChange}
                          className="app-slider app-slider-premium w-full min-w-0"
                          style={getPremiumSliderStyle(control.value, currentState.color)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
