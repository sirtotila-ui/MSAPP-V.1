import { useId, useMemo } from 'react'

function generateSinePath(width, height, phase = 0) {
  const points = []
  const amplitude = height / 2
  const centerY = height / 2

  for (let i = 0; i <= width; i += 2) {
    const x = i
    const y = centerY - Math.sin((i / width) * Math.PI * 2 * 5 + phase) * amplitude
    points.push(`${x},${y}`)
  }
  return `M ${points.join(' L ')}`
}

export function BrainwaveVisualizer({ isPlaying, frequency, color }) {
  const gradientId = useId()
  const glowId = useId()
  const width = 200
  const height = 80
  const paths = useMemo(() => {
    return [0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2, Math.PI * 2].map(
      (phase) => generateSinePath(width, height, phase)
    )
  }, [])

  const pathD = paths[0]

  return (
    <div
      className="relative flex-1 min-w-0 overflow-hidden rounded-[1.35rem] border border-white/8 bg-white/[0.03] px-3 py-3 sm:px-4"
      style={{
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.04), 0 24px 64px ${color}18`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-x-[16%] top-1/2 h-16 -translate-y-1/2 rounded-full blur-3xl opacity-60"
        style={{ background: `${color}35` }}
      />
      <div className="absolute inset-x-4 top-3 flex items-center justify-between text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-white/40">
        <span>Neural Sync</span>
        <span>{frequency} Hz</span>
      </div>
      <div className="pointer-events-none absolute inset-x-4 bottom-3 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
      <div className="relative flex items-center justify-center pt-5">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-20 w-full max-w-xs"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="50%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.35" />
          </linearGradient>
          <filter id={glowId} x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="4.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <line
          x1="0"
          y1={height / 2}
          x2={width}
          y2={height / 2}
          stroke={color}
          strokeWidth="1"
          strokeOpacity="0.12"
          strokeDasharray="5 6"
        />
        {isPlaying ? (
          <>
            <path
              d={pathD}
              fill="none"
              stroke={color}
              strokeWidth="6"
              strokeLinecap="round"
              strokeOpacity="0.12"
              filter={`url(#${glowId})`}
            >
              <animate
                attributeName="d"
                dur={frequency >= 18 ? '1.1s' : frequency >= 10 ? '1.3s' : '1.6s'}
                repeatCount="indefinite"
                values={paths.join(';')}
              />
            </path>
            <path
              d={pathD}
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth="2.4"
              strokeLinecap="round"
            >
              <animate
                attributeName="d"
                dur={frequency >= 18 ? '1.1s' : frequency >= 10 ? '1.3s' : '1.6s'}
                repeatCount="indefinite"
                values={paths.join(';')}
              />
            </path>
          </>
        ) : (
          <line
            x1="0"
            y1={height / 2}
            x2={width}
            y2={height / 2}
            stroke={color}
            strokeWidth="2"
            strokeOpacity="0.45"
          />
        )}
      </svg>
      </div>
    </div>
  )
}
