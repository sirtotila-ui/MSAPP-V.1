import { Moon, Radio, Sun, Zap, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

const iconMap = {
  moon: Moon,
  wave: Radio,
  sun: Sun,
  bolt: Zap,
  sparkles: Sparkles,
}

export function StateCard({ state, isSelected, onClick, size }) {
  const IconComponent = iconMap[state.icon] || Sun
  const isLarge = size === 'large'
  const Wrapper = isLarge ? motion.div : motion.button

  return (
    <Wrapper
      {...(!isLarge && { type: 'button', onClick })}
      className={`
        rounded-2xl bg-black/40 backdrop-blur-sm border transition-all duration-300
        flex flex-col items-center justify-center overflow-hidden
        ${isLarge ? 'w-[320px] h-[320px] p-6 sm:w-72 sm:h-72 md:w-80 md:h-80' : 'w-20 h-20 min-w-[80px] min-h-[80px] p-2'}
        touch-manipulation
      `}
      style={{
        borderColor: state.color,
        boxShadow: `0 0 24px ${state.color}40`,
      }}
      {...(!isLarge && {
        whileHover: { scale: 1.03 },
        whileTap: { scale: 0.98 },
      })}
      {...(isLarge && { whileHover: { scale: 1.02 } })}
    >
      {isLarge ? (
        <>
          <IconComponent
            className="mb-2"
            style={{ color: state.color }}
            size={80}
          />
          <span className="text-5xl sm:text-6xl font-light text-white mb-1 text-glow">
            {state.symbol}
          </span>
          <span className="text-xl font-semibold text-white mb-0.5 text-glow">
            {state.name}
          </span>
          <span className="text-sm text-white/70 text-center">
            {state.description}
          </span>
        </>
      ) : (
        <>
          <IconComponent
            className="mb-0.5"
            style={{ color: state.color }}
            size={24}
          />
          <span className="text-xs font-medium text-white">{state.symbol}</span>
        </>
      )}
    </Wrapper>
  )
}
