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
  const compactClass = isSelected
    ? 'bg-white/12 border-white/30 scale-[1.03]'
    : 'bg-black/40 border-white/10 hover:border-white/20'

  return (
    <Wrapper
      {...(!isLarge && { type: 'button', onClick })}
      {...(!isLarge && { 'aria-pressed': isSelected })}
      className={`
        rounded-2xl backdrop-blur-sm border transition-all duration-300
        flex flex-col items-center justify-center overflow-hidden
        ${isLarge ? 'w-[320px] h-[320px] p-6 sm:w-72 sm:h-72 md:w-80 md:h-80 bg-black/40' : `w-20 h-20 min-w-[80px] min-h-[80px] p-2 ${compactClass}`}
        touch-manipulation
      `}
      style={{
        borderColor: isLarge ? state.color : isSelected ? `${state.color}` : undefined,
        boxShadow: isSelected ? `0 0 28px ${state.color}55` : `0 0 18px ${state.color}20`,
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
          <span className="text-[10px] text-white/60 leading-none mt-0.5">{state.name}</span>
        </>
      )}
    </Wrapper>
  )
}
