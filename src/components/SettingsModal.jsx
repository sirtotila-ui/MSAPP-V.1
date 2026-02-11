import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { StateCard } from './StateCard'
import { AmbientSounds } from './AmbientSounds'

export function SettingsModal({ isOpen, onClose, brainStates, brainStatesOrder, selectedState, onSelectState, ambientSoundsProps }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-[101] lg:hidden bg-black/95 backdrop-blur-xl rounded-t-2xl border-t border-white/10 p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] max-h-[70vh] overflow-auto"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Menu</h2>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Chiudi"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              {brainStatesOrder.filter((key) => key !== selectedState).map((key) => (
                <StateCard
                  key={key}
                  state={brainStates[key]}
                  isSelected={false}
                  size="small"
                  onClick={() => {
                    onSelectState(key)
                    onClose()
                  }}
                />
              ))}
            </div>
            {ambientSoundsProps && (
              <div className="mt-6 pt-4 border-t border-white/10">
                <AmbientSounds {...ambientSoundsProps} compact />
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
