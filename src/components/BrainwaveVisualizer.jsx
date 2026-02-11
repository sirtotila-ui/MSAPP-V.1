import { useMemo } from 'react'

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
  const width = 200
  const height = 80
  const paths = useMemo(() => {
    return [0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2, Math.PI * 2].map(
      (phase) => generateSinePath(width, height, phase)
    )
  }, [])

  const pathD = paths[0]

  return (
    <div className="flex-1 min-w-0 flex items-center justify-center px-2">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full max-w-xs h-20"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.6" />
            <stop offset="50%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.6" />
          </linearGradient>
        </defs>
        {isPlaying ? (
          <path
            d={pathD}
            fill="none"
            stroke="url(#waveGradient)"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <animate
              attributeName="d"
              dur="1.5s"
              repeatCount="indefinite"
              values={paths.join(';')}
            />
          </path>
        ) : (
          <line
            x1="0"
            y1={height / 2}
            x2={width}
            y2={height / 2}
            stroke={color}
            strokeWidth="2"
            strokeOpacity="0.4"
          />
        )}
      </svg>
    </div>
  )
}
