import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ambientSounds } from '../data/ambientSounds'
import { MetronomeIcon } from './MetronomeIcon'

export function AmbientSounds({
  activeSounds,
  onToggle,
  ambientVolume,
  onVolumeChange,
  compact,
  metronomeOn,
  onMetronomeToggle,
  metronomeColor,
  breathing,
  isPlaying,
  showVolumeBar = true,
  holdVibrationOn,
  onHoldVibrationToggle,
}) {
  const [elapsed, setElapsed] = useState(0)
  const [tick, setTick] = useState(0)
  const lastTickRef = useRef(-1)

  useEffect(() => {
    if (!isPlaying || !breathing) return
    const interval = setInterval(() => setElapsed((p) => p + 0.05), 50)
    return () => clearInterval(interval)
  }, [isPlaying, breathing])

  useEffect(() => {
    if (!isPlaying || !metronomeOn) return
    const s = Math.floor(elapsed)
    if (s !== lastTickRef.current && s >= 0) {
      lastTickRef.current = s
      setTick((t) => t + 1)
    }
  }, [elapsed, isPlaying, metronomeOn])
  return (
    <div className={`flex gap-3 shrink-0 ${compact ? 'flex-row items-center flex-wrap' : 'flex-col'}`}>
      <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Suoni</span>
      <div className={`flex ${compact ? 'flex-row flex-wrap gap-2' : 'flex-col gap-3'}`}>
        {ambientSounds.map((sound, index) => {
          const isMetronome = index === 0
          const isActive = isMetronome ? metronomeOn : activeSounds[index - 1]
          const handleClick = isMetronome ? onMetronomeToggle : () => onToggle(index)

          return (
            <motion.button
              key={sound.id}
              type="button"
              onClick={handleClick}
              className={`rounded-2xl flex items-center justify-center font-medium transition-all duration-300 touch-manipulation border ${
                compact ? 'w-10 h-10 text-sm' : 'w-20 h-20 min-w-[80px] min-h-[80px] text-base'
              } ${
                isActive
                  ? 'bg-white/20 border-white/40 text-white'
                  : 'bg-black/30 border-white/10 text-white/60 hover:border-white/20'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={sound.name}
            >
              {isMetronome ? (
                <motion.span
                  key={metronomeOn && isPlaying ? tick : 0}
                  style={isActive && metronomeColor ? { color: metronomeColor } : undefined}
                  animate={metronomeOn && isPlaying ? { rotate: [-4, 4, -4], scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                >
                  <MetronomeIcon size={compact ? 20 : 28} className="flex-shrink-0" />
                </motion.span>
              ) : (
                sound.label
              )}
            </motion.button>
          )
        })}
      </div>
      {showVolumeBar && (
        <div className="flex flex-col gap-1 mt-2">
          <span className="text-xs text-white/60">Vol. suoni</span>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="100"
              value={ambientVolume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className="flex-1 w-20 h-1.5"
            />
            <span className="text-xs text-white/60 w-8">{ambientVolume}%</span>
          </div>
        </div>
      )}
      {onHoldVibrationToggle != null && (
        <div className={`flex items-center gap-2 ${compact ? 'mt-3' : 'mt-3'}`}>
          <span className="text-xs text-white/60 shrink-0">Vibrazione durante hold</span>
          <button
            type="button"
            onClick={onHoldVibrationToggle}
            className={`rounded-xl px-3 py-1.5 text-sm font-medium border transition-colors ${
              holdVibrationOn
                ? 'bg-white/20 border-white/40 text-white'
                : 'bg-black/30 border-white/10 text-white/60'
            }`}
          >
            {holdVibrationOn ? 'On' : 'Off'}
          </button>
        </div>
      )}
    </div>
  )
}
